import React, { useState } from "react";
import axios from "axios";

const INTEGRATION_URL = "https://nhi.api.stackguard.org";

const IntegrationAzurePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);

  // Trigger Azure analysis run
  const triggerRun = async () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      const response = await axios.post(
        `${INTEGRATION_URL}/api/v1/connector/trigger`,
        {
          azure_creds: {
            tenant_id: tenantId,
            client_id: clientId,
            client_secret: clientSecret,
          },
          platform: "azure",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setData(response.data.body || []);
      clearInterval(progressInterval);
      setProgress(100);
    } catch (error) {
      console.error("Error triggering run:", error);
      setError(
        "Failed to trigger Azure analysis. Please check credentials and try again."
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  // Dialog handlers
  const handleOpenDialog = () => setIsDialogOpen(true);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setClientId("");
    setClientSecret("");
    setTenantId("");
    setError(null);
  };

  const handleSubmit = () => {
    if (clientId && clientSecret && tenantId) {
      setIsDialogOpen(false);
      triggerRun();
    } else {
      setError("Please fill in all Azure credentials.");
    }
  };

  // Process data for metrics
  const totalPolicies = data.length;
  const overPermissivePoliciesCount = data.reduce(
    (acc, item) =>
      acc +
      item.metadata.findings.reduce(
        (sum, finding) => sum + finding.overpermissive_policies.length,
        0
      ),
    0
  );
  const overPermissivePercentage =
    totalPolicies > 0
      ? Math.round((overPermissivePoliciesCount / totalPolicies) * 100)
      : 0;

  // Static percentage change (placeholder)
  const overPermissiveChange = 3;
  const overPermissiveChangeSymbol = overPermissiveChange >= 0 ? "↑" : "↓";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1a1a1d] to-black text-white">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-200 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{error}</span>
              </div>
              <button
                className="text-red-300 hover:text-red-100 transition-colors text-sm px-3 py-1 rounded-lg hover:bg-red-500/20"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-white bg-clip-text text-transparent mb-2">
                Azure Roles Analysis
              </h1>
              <p className="text-gray-400 text-lg">
                Monitor and analyze Azure role permissions
              </p>
            </div>
            <button
              onClick={handleOpenDialog}
              disabled={isLoading}
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 ${
                isLoading ? "opacity-50 cursor-not-allowed scale-100" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Running...
                </div>
              ) : (
                "Trigger Run"
              )}
            </button>
          </div>

          {/* Loading Bar */}
          {isLoading && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                <span>Analyzing Azure roles...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Total Policies
              </h2>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {totalPolicies}
            </p>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Over-Permissive Policies
              </h2>
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {overPermissivePoliciesCount}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">
                {overPermissivePercentage}% of total
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  overPermissiveChange >= 0
                    ? "bg-red-500/20 text-red-300"
                    : "bg-green-500/20 text-green-300"
                }`}
              >
                <span>{overPermissiveChangeSymbol}</span>
                <span>{Math.abs(overPermissiveChange)}%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Table */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-2">
              Overpermissive Policy Findings
            </h2>
            <p className="text-gray-400">
              Detailed analysis of potentially risky permissions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700/50">
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Principal
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Platform
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Action
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Resource
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Effect
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                        </div>
                        <p>
                          No policy findings available. Trigger a run to analyze
                          Azure roles.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((entry, index) =>
                    entry.metadata.findings.flatMap((finding, fIdx) =>
                      finding.overpermissive_policies.map((policy, pIdx) => (
                        <tr
                          key={`${entry.id}-${fIdx}-${pIdx}`}
                          className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                        >
                          <td className="p-4 text-gray-200">
                            {entry.principal.name}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                              {entry.platform}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300 font-mono text-xs">
                            {Array.isArray(policy.finding.policy_snippet.Action)
                              ? policy.finding.policy_snippet.Action.join(", ")
                              : policy.finding.policy_snippet.Action}
                          </td>
                          <td className="p-4 text-gray-300 font-mono text-xs">
                            {policy.finding.policy_snippet.Resource}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs font-medium">
                              {policy.finding.effect}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs">
                              {policy.reason}
                            </span>
                          </td>
                        </tr>
                      ))
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Azure Credentials Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">
                  Enter Azure Credentials
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Provide your Azure service principal details
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Enter Client ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Enter Client Secret"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tenant ID
                  </label>
                  <input
                    type="text"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Enter Tenant ID"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-700/50 flex justify-end gap-3">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationAzurePage;
