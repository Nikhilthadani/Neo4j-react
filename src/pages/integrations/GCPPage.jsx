import React, { useState } from "react";
import axios from "axios";

const INTEGRATION_URL = "https://nhi.api.stackguard.org";

const IntegrationGCPPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceAccountKey, setServiceAccountKey] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [error, setError] = useState(null);

  // Trigger GCP analysis run
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
          gcp_creds: {
            service_account_key: serviceAccountKey,
            resource_id: resourceId,
          },
          platform: "gcp",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setData(response.data.body || []);
      clearInterval(progressInterval);
      setProgress(100);
    } catch (error) {
      console.error("Error triggering run:", error);
      setError(
        "Failed to trigger GCP analysis. Please check credentials and try again."
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
    setServiceAccountKey("");
    setResourceId("");
    setError(null);
  };

  const handleSubmit = () => {
    if (resourceId && serviceAccountKey) {
      setIsDialogOpen(false);
      triggerRun();
    } else {
      setError("Please fill in all GCP credentials.");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="p-6 lg:p-8">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-red-100">{error}</span>
              </div>
              <button
                className="text-red-300 hover:text-red-100 transition-colors duration-200"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm border border-green-700/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-green-200">
                Total Policies
              </h2>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {totalPolicies}
            </p>
            <div className="text-xs text-green-300">Google Cloud Platform</div>
          </div>

          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-sm border border-red-700/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-red-200">
                Over-Permissive Policies
              </h2>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {overPermissivePoliciesCount}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-red-300">
                {overPermissivePercentage}% of total
              </span>
              <span className="text-red-400">
                {overPermissiveChangeSymbol} {Math.abs(overPermissiveChange)}%
              </span>
            </div>
          </div>
        </div>

        {/* Header and Trigger Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-white bg-clip-text text-transparent">
              GCP Roles Analysis
            </h1>
            <p className="text-gray-400 mt-2">
              Comprehensive security analysis for Google Cloud Platform
            </p>
          </div>
          <button
            onClick={handleOpenDialog}
            disabled={isLoading}
            className={`group relative overflow-hidden bg-blue-500 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 ${
              isLoading ? "opacity-50 cursor-not-allowed scale-100" : ""
            }`}
          >
            <div className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Running Analysis...
                </>
              ) : (
                <>
                  <span>☁️</span>
                  Trigger Run
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>
        </div>

        {/* GCP Credentials Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  GCP Credentials
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Resource ID
                    </label>
                    <input
                      type="text"
                      value={resourceId}
                      onChange={(e) => setResourceId(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter Resource ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Service Account Key
                    </label>
                    <textarea
                      value={serviceAccountKey}
                      onChange={(e) => setServiceAccountKey(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                      placeholder="Enter Service Account Key (JSON format)"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleCloseDialog}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Bar */}
        {isLoading && (
          <div className="mb-8 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-green-300 font-medium">
                Analyzing GCP roles...
              </div>
              <div className="text-green-400 text-sm">{progress}%</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Table */}
        {data.length > 0 && (
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                Overpermissive Policy Findings
              </h2>
              <p className="text-gray-400 mt-1">
                Detailed analysis results for Google Cloud Platform
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Effect
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.map((entry, index) =>
                    entry.metadata.findings.flatMap((finding, fIdx) =>
                      finding.overpermissive_policies.map((policy, pIdx) => (
                        <tr
                          key={`${entry.id}-${fIdx}-${pIdx}`}
                          className="hover:bg-gray-800/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm text-white">
                            {entry.principal.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {entry.platform}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {Array.isArray(policy.finding.policy_snippet.Action)
                              ? policy.finding.policy_snippet.Action.join(", ")
                              : policy.finding.policy_snippet.Action}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {policy.finding.policy_snippet.Resource}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {policy.finding.effect}
                          </td>
                          <td className="px-6 py-4 text-sm text-red-400 font-medium">
                            {policy.reason}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationGCPPage;
