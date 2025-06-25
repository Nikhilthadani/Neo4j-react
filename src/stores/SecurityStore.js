
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const useSecurityStore = create(
  persist(
    (set, get) => ({
      // Data state
      repositories: [],
      loading: false,
      error: null,
      lastUpdated: null,
      
      // Polling state
      pollingInterval: null,
      isPolling: false,
      pollAttempts: 0,
      maxPollAttempts: 20, // Stop after 20
      pollDelay: 3000, // 3 seconds
      
      // Data freshness (1 minutes)
      DATA_FRESHNESS_THRESHOLD: 1 * 60 * 1000,
      
      // Core actions
      setRepositories: (repositories) => set({
        repositories: Array.isArray(repositories) ? repositories : [],
        lastUpdated: new Date(),
        error: null,
      }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Smart data loading - only loads if data is stale or missing
      loadInitialData: async (forceRefresh = false) => {
        const state = get()
        
        // Check if we need to load data
        if (!forceRefresh  && state.lastUpdated) {
          const timeSinceUpdate = Date.now() - new Date(state.lastUpdated).getTime()
          if (timeSinceUpdate < state.DATA_FRESHNESS_THRESHOLD) {
            console.log('Using cached data - still fresh')
            return state.repositories
          }
        }   

        // Prevent multiple simultaneous calls
        if (state.loading) {
          console.log('Already loading, skipping duplicate call')
          return state.repositories
        }

        try {
          set({ loading: true, error: null })
          
          const response = await axios.get(`${process.env.REACT_APP_URL}api/findings`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          })

          const data = response.data?.repositories
          console.log('Loaded initial data:', data)
          if (!data || !Array.isArray(data)) {
            set({ repositories: [], error: null })
            return []
          }

          set({ 
            repositories: data,
            lastUpdated: new Date(),
            error: null 
          })
          
          return data
        } catch (error) {
          console.error('Error loading initial data:', error)
          const errorCode = error.response?.status || error.status || 'network_error'
          set({ error: errorCode })
          
          // Return empty array for graceful degradation
          return []
        } finally {
          set({ loading: false })
        }
      },

      // Smart polling for repository page
      startPolling: () => {
        const state = get()
        
        if (state.isPolling) {
          console.log('Polling already active')
          return
        }

        set({ isPolling: true, pollAttempts: 0 })
        
        const poll = async () => {
          const currentState = get()
          
          if (currentState.pollAttempts >= currentState.maxPollAttempts) {
            console.log('Max poll attempts reached, stopping')
            currentState.stopPolling()
            return
          }

          try {
            const previousCount = currentState.repositories.length
            const previousFindings = currentState.repositories.reduce((sum, repo) => 
              sum + (repo.totalFindings || 0), 0)

            await currentState.loadInitialData(true)
            
            const newState = get()
            const newCount = newState.repositories.length
            const newFindings = newState.repositories.reduce((sum, repo) => 
              sum + (repo.totalFindings || 0), 0)

            set({ pollAttempts: currentState.pollAttempts + 1 })

            // Stop polling if no changes detected
            if (previousCount === newCount && previousFindings === newFindings) {
              console.log('No changes detected, continuing polling...')
            }

            // Continue polling if still processing repositories
            const processingRepos = newState.repositories.filter(repo => 

              repo.latestScanTime === null || 
              repo.latestScanTime === undefined ||
              repo.latestScanId === null || 
              repo.latestScanId === undefined)
            
            if (processingRepos.length === 0) {
              console.log('All repositories processed, stopping polling')
              newState.stopPolling()
              return
            }

          } catch (error) {
            console.error('Polling error:', error)
            const currentState = get()
            set({ pollAttempts: currentState.pollAttempts + 1 })
          }

          // Schedule next poll
          const finalState = get()
          if (finalState.isPolling) {
            finalState.pollingInterval = setTimeout(poll, finalState.pollDelay)
          }
        }

        // Start first poll
        poll()
      },

      stopPolling: () => {
        const state = get()
        if (state.pollingInterval) {
          clearTimeout(state.pollingInterval)
        }
        set({ 
          isPolling: false, 
          pollingInterval: null, 
          pollAttempts: 0 
        })
      },

      // Computed getters with fallbacks
      getRepositoryStats: () => {
        let { repositories } = get()
        if (!Array.isArray(repositories)) repositories = []

        return repositories.map(repo => ({
          ...repo,
          riskLevel: (repo.verifiedFindings || 0) > 10 ? 'Critical' :
                    (repo.verifiedFindings || 0) > 5 ? 'High' :
                    (repo.verifiedFindings || 0) > 0 ? 'Medium' : 'Secure',
          lastScanDate: repo.latestScanTime ? new Date(repo.latestScanTime * 1000) : null,
          isProcessing: repo.status === 1 || (repo.totalScans || 0) === 0
        }))
      },

      getAggregatedCounts: () => {
        let { repositories } = get()
        if (!Array.isArray(repositories)) repositories = []

        return repositories.reduce((totals, repo) => ({
          totalFindings: totals.totalFindings + (repo.totalFindings || 0),
          verifiedFindings: totals.verifiedFindings + (repo.verifiedFindings || 0),
          unverifiedFindings: totals.unverifiedFindings + (repo.unverifiedFindings || 0),
          totalScans: totals.totalScans + (repo.totalScans || 0),
          totalRepositories: totals.totalRepositories + 1
        }), {
          totalFindings: 0,
          verifiedFindings: 0,
          unverifiedFindings: 0,
          totalScans: 0,
          totalRepositories: 0
        })
      },

      getSummaryStats: () => {
        let { repositories } = get()
        if (!Array.isArray(repositories)) repositories = []

        const aggregated = get().getAggregatedCounts()

        const statusCounts = repositories.reduce((counts, repo) => {
          const status = repo.status || 0
          counts[status] = (counts[status] || 0) + 1
          return counts
        }, {})

        const riskCounts = repositories.reduce((counts, repo) => {
          const verifiedFindings = repo.verifiedFindings || 0
          const riskLevel = verifiedFindings > 10 ? 'Critical' :
                           verifiedFindings > 5 ? 'High' :
                           verifiedFindings > 0 ? 'Medium' : 'Secure'
          counts[riskLevel] = (counts[riskLevel] || 0) + 1
          return counts
        }, { Critical: 0, High: 0, Medium: 0, Secure: 0 })

        return {
          ...aggregated,
          repositoriesWithIssues: repositories.filter(repo => (repo.verifiedFindings || 0) > 0).length,
          secureRepositories: repositories.filter(repo => (repo.verifiedFindings || 0) === 0).length,
          processingRepositories: repositories.filter(repo => repo.status === 1 || (repo.totalScans || 0) === 0).length,
          statusBreakdown: statusCounts,
          riskBreakdown: riskCounts,
          averageFindingsPerRepo: aggregated.totalRepositories > 0 ? 
            Math.round(aggregated.totalFindings / aggregated.totalRepositories * 100) / 100 : 0
        }
      },

      getRecentActivity: () => {
        let { repositories } = get()
        if (!Array.isArray(repositories)) repositories = []

        return repositories
          .filter(repo => repo.latestScanTime)
          .sort((a, b) => (b.latestScanTime || 0) - (a.latestScanTime || 0))
          .slice(0, 10)
          .map(repo => ({
            id: repo.id,
            name: repo.name,
            owner: repo.owner,
            totalFindings: repo.totalFindings || 0,
            verifiedFindings: repo.verifiedFindings || 0,
            lastScanTime: new Date(repo.latestScanTime * 1000),
            scanId: repo.latestScanId,
            status: repo.status
          }))
      },

      getDailyRiskScores: () => {
        let { repositories } = get()
        if (!Array.isArray(repositories)) repositories = []

        const today = new Date()
        const daysMap = new Map()

        const fmt = new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
        })

        // Initialize 15-day window
        for (let i = 0; i < 15; i++) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          const key = fmt.format(date)
          daysMap.set(key, { verified: 0, unverified: 0 })
        }

        repositories.forEach(repo => {
          if (repo.latestScanTime) {
            const scanDate = new Date(repo.latestScanTime * 1000)
            const key = fmt.format(scanDate)
            if (daysMap.has(key)) {
              const dayStats = daysMap.get(key)
              dayStats.verified += repo.verifiedFindings || 0
              dayStats.unverified += repo.unverifiedFindings || 0
            }
          }
        })

        return Array.from(daysMap.entries())
          .sort(([a], [b]) => {
            const parseDate = str => new Date(`${str} ${new Date().getFullYear()}`)
            return parseDate(a) - parseDate(b)
          })
          .map(([date, { verified, unverified }]) => {
            const total = verified + unverified
            const riskScore = total > 0 ? verified / total : 0
            return { date, riskScore, verified, unverified }
          })
      },

      getAverageRiskScore: () => {
        const daily = get().getDailyRiskScores()

        let totalVerified = 0
        let totalUnverified = 0

        daily.forEach(day => {
          totalVerified += day.verified
          totalUnverified += day.unverified
        })

        const total = totalVerified + totalUnverified
        const averageRiskScore = total > 0 ? totalVerified / total : 0

        return {
          averageRiskScore,
          pieData: [
            { name: 'Verified', value: totalVerified },
            { name: 'Unverified', value: totalUnverified },
          ],
        }
      },

      // Utility methods
      getRepositoryById: (id) => {
        let { repositories } = get()
        if (!Array.isArray(repositories)) return null
        return repositories.find(repo => repo.id === id)
      },

      getRepositoriesByStatus: (status) => {
        let { repositories } = get()
        if (!Array.isArray(repositories)) return []
        return repositories.filter(repo => repo.status === status)
      },

      // Check if data is fresh
      isDataFresh: () => {
        const { lastUpdated, DATA_FRESHNESS_THRESHOLD } = get()
        if (!lastUpdated) return false
        
        const timeSinceUpdate = Date.now() - new Date(lastUpdated).getTime()
        return timeSinceUpdate < DATA_FRESHNESS_THRESHOLD
      },

      // Force refresh data
      refreshData: () => {
        return get().loadInitialData(true)
      },

      clearData: () => {
        const { stopPolling } = get()
        stopPolling()
        set({
          repositories: [],
          error: null,
          lastUpdated: null
        })
      },

      // Cleanup on unmount
      cleanup: () => {
        get().stopPolling()
      }
    }),
    {
      
      // Don't persist polling state
      partialize: (state) => ({
        repositories: state.repositories,
        lastUpdated: state.lastUpdated,
        error: state.error
      })
    }
  )
)

export default useSecurityStore
export { useSecurityStore }