import React, { useState, useEffect, useMemo } from "react";
import ScanCard from "../../components/repositories/DeploymentCard";
import { Home, Filter, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToaster } from "../../contexts/ToasterContext";
import { useSecurityStore } from "../../stores/SecurityStore";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByVerified, setSortByVerified] = useState(false);

  const location = useLocation();
  const { showToast } = useToaster();
  const navigate = useNavigate();

  // Selectively get only what we need from the store
  const loadInitialData = useSecurityStore((state) => state.loadInitialData);
  const cleanup = useSecurityStore((state) => state.cleanup);
  const startPolling = useSecurityStore((state) => state.startPolling);
  const stopPolling = useSecurityStore((state) => state.stopPolling);
  const repositories = useSecurityStore((state) => state.repositories);
  const pollingCompletedMap = useSecurityStore(
    (state) => state.pollingCompleted
  );
  useEffect(() => {
    const urlpath = new URLSearchParams(location.search);
    const installed = urlpath.get("installed");
    const reposFailed = urlpath.get("repos");

    if (installed) {
      showToast(
        ` GitHub App installed successfully!\n` +
          `${reposFailed} repositories not added to your free trial.`,
        "success"
      );
      navigate("/repositories", { replace: true });
    }
  }, [navigate, location]);

  // useEffect(() => {
  //   // Load initial data and start polling
  //   loadInitialData();
  //   startPolling();

  //   // Cleanup on unmount
  //   return () => {
  //     stopPolling();
  //     cleanup();
  //   };
  // }, [loadInitialData, startPolling, stopPolling, cleanup,navigate]);

  useEffect(() => {
    const initializeData = async () => {
      await loadInitialData();
      // Start polling AFTER initial data is loaded
      startPolling();
    };

    initializeData();

    // Cleanup on unmount
    return () => {
      stopPolling();
      cleanup();
    };
  }, [loadInitialData, startPolling, stopPolling, cleanup]);

  const isRepositoryProcessing = useMemo(
    () => (repo) => {
      return (
        repo.latestScanTime === null ||
        repo.latestScanTime === undefined ||
        repo.latestScanId === null ||
        repo.latestScanId === undefined
      );
    },
    []
  );

  const handleScan = () => {
    showToast("Redirecting to GitHub...", "success");
    window.location.href = `${
      import.meta.env.REACT_APP_URL
    }api/auth/installApp`;
  };

  // Memoize filtered scans to prevent unnecessary recalculations
  const filteredScans = useMemo(() => {
    if (!repositories.length) return [];

    return repositories
      .filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.owner.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortByVerified) {
          return (
            b.verifiedFindings - a.verifiedFindings ||
            b.totalFindings - a.totalFindings
          );
        }
        return 0;
      });
  }, [repositories, searchQuery, sortByVerified]);

  return (
    <div className="bg-[#27272A] min-h-screen p-3 sm:p-4 md:p-6 pt-3">
      <div className="p-5 bg-[#18181B] rounded-[10px] shadow-md">
        <div className="bg-[#19191C] text-white mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:space-x-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="text-[#FFFFFF]">Security Scans</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row w-full lg:items-center justify-between gap-6">
              <h2 className="text-[#FFFFFF] text-[15px] font-[600] underline underline-offset-4 lg:min-w-[150px]">
                Security Scan Results
              </h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setSortByVerified(!sortByVerified)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    sortByVerified
                      ? "bg-[#A9DFD8] text-[#1e1e1e] hover:bg-[#8FCCC5]"
                      : "bg-[#2A2A35] text-[#FFFFFF] hover:bg-[#3A3A45] border border-[#A9DFD8]"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {sortByVerified ? "Show All" : "Verified First"}
                </button>
                <button
                  onClick={handleScan}
                  className="flex items-center gap-2 bg-[#A9DFD8] text-[#1e1e1e] px-4 py-2 rounded text-sm font-medium hover:bg-[#8FCCC5]"
                >
                  <RefreshCw className="w-4 h-4" />
                  Scan New Repository
                </button>
              </div>
            </div>
          </div>

          {filteredScans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#A6A7A9] text-lg mb-4">
                No repositories found
              </p>
              <p className="text-[#A6A7A9] text-sm">
                Start by scanning your first repository to see security
                findings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {filteredScans.map((repo, idx) => (
                <div key={idx} className="h-full">
                  <ScanCard
                    repoId={repo.id}
                    repositoryName={repo.name}
                    userName={repo.owner}
                    totalFindings={repo.totalFindings}
                    verified_findings={repo.verifiedFindings}
                    unverified_findings={repo.unverifiedFindings}
                    latestScanId={repo.latestScanId}
                    isProcessing={isRepositoryProcessing(repo)}
                    pollingCompleted={pollingCompletedMap?.[repo.id] || false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
