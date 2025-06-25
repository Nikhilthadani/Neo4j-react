import React from "react";
import { useSecurityStore } from "../../stores/SecurityStore"; // Make sure path is correct

export const Risk = () => {
  // Get the raw data and compute derived values inside the component
  const { repositories, loading, error, lastUpdated } = useSecurityStore();

  // Compute aggregated counts directly in component
  const aggregated = React.useMemo(() => {
    return repositories.reduce(
      (totals, repo) => ({
        totalFindings: totals.totalFindings + (repo.totalFindings || 0),
        verifiedFindings:
          totals.verifiedFindings + (repo.verifiedFindings || 0),
        unverifiedFindings:
          totals.unverifiedFindings + (repo.unverifiedFindings || 0),
        totalScans: totals.totalScans + (repo.totalScans || 0),
        totalRepositories: totals.totalRepositories + 1,
      }),
      {
        totalFindings: 0,
        verifiedFindings: 0,
        unverifiedFindings: 0,
        totalScans: 0,
        totalRepositories: 0,
      }
    );
  }, [repositories]);

  // Compute summary stats
  const summary = React.useMemo(() => {
    const riskCounts = repositories.reduce(
      (counts, repo) => {
        const riskLevel =
          repo.verifiedFindings > 10
            ? "Critical"
            : repo.verifiedFindings > 5
            ? "High"
            : repo.verifiedFindings > 0
            ? "Medium"
            : "Secure";
        counts[riskLevel] = (counts[riskLevel] || 0) + 1;
        return counts;
      },
      { Critical: 0, High: 0, Medium: 0, Secure: 0 }
    );

    return {
      ...aggregated,
      repositoriesWithIssues: repositories.filter(
        (repo) => repo.verifiedFindings > 0
      ).length,
      secureRepositories: repositories.filter(
        (repo) => repo.verifiedFindings === 0
      ).length,
      processingRepositories: repositories.filter(
        (repo) => repo.status === 1 || repo.totalScans === 0
      ).length,
      riskBreakdown: riskCounts,
      averageFindingsPerRepo:
        aggregated.totalRepositories > 0
          ? Math.round(
              (aggregated.totalFindings / aggregated.totalRepositories) * 100
            ) / 100
          : 0,
    };
  }, [repositories, aggregated]);

  // Debug logging
  console.log("Repositories in Risk component:", repositories);
  console.log("Aggregated counts:", aggregated);
  console.log("Summary stats:", summary);

  if (loading) return <div>Loading Risk...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-white">
      <h1>Security Risk Dashboard</h1>

      {lastUpdated && (
        <p className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}

      {/* Debug Info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <p>Repositories loaded: {repositories.length}</p>
        <p>
          Sample repository:{" "}
          {repositories[0] ? JSON.stringify(repositories[0], null, 2) : "None"}
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600">
            Total Findings
          </h3>
          <div className="text-2xl font-bold text-blue-600">
            {aggregated.totalFindings}
          </div>
        </div>

        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600">
            Verified Findings
          </h3>
          <div className="text-2xl font-bold text-red-600">
            {aggregated.verifiedFindings}
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600">
            Unverified Findings
          </h3>
          <div className="text-2xl font-bold text-yellow-600">
            {aggregated.unverifiedFindings}
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600">
            Total Repositories
          </h3>
          <div className="text-2xl font-bold text-green-600">
            {aggregated.totalRepositories}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Risk Breakdown</h3>
          <div className="space-y-1">
            <p>Critical: {summary.riskBreakdown?.Critical || 0}</p>
            <p>High: {summary.riskBreakdown?.High || 0}</p>
            <p>Medium: {summary.riskBreakdown?.Medium || 0}</p>
            <p>Secure: {summary.riskBreakdown?.Secure || 0}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Repository Status</h3>
          <div className="space-y-1">
            <p>With Issues: {summary.repositoriesWithIssues}</p>
            <p>Secure: {summary.secureRepositories}</p>
            <p>Processing: {summary.processingRepositories}</p>
            <p>Avg Findings/Repo: {summary.averageFindingsPerRepo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Risk;
