import React, { useState } from "react";
import axios from "axios";

const INTEGRATION_URL = "https://nhi.api.stackguard.org";

const IntegrationGithubPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [error, setError] = useState(null);

  // Trigger Github analysis run
  const triggerRun = async () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      const tokenDetails = await axios.get(
        `${import.meta.env.REACT_APP_URL}api/tokens/github`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      console.log("token details", tokenDetails);

      const response = await axios.post(
        `${INTEGRATION_URL}/api/v1/connector/trigger`,
        {
          github_creds: {
            github_token: tokenDetails.data.access_token,
            owner: tokenDetails.data.owner,
          },
          platform: "github",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setData(response.data.body || []);
      clearInterval(progressInterval);
      setProgress(100);
    } catch (error) {
      console.error("Error triggering run:", error);
      setError(
        "Failed to trigger Github analysis. Please check credentials and try again."
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
    setOwner("");
    setError(null);
  };

  const handleSubmit = () => {
    // if (owner) {
    //   setIsDialogOpen(false);
    triggerRun();
    // } else {
    //   setError('Please fill in the repository owner.');
    // }
  };

  // Process data for metrics
  const totalPolicies = data.length;
  const overPermissivePoliciesCount = data.reduce(
    (acc, item) =>
      acc +
      (item.metadata?.findings?.reduce(
        (sum, finding) => sum + (finding.overpermissive_policies?.length || 0),
        0
      ) || 0),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg border border-red-500/20">
            <div className="flex items-center justify-between">
              <span className="flex-1">{error}</span>
              <button
                className="ml-4 text-sm bg-red-800 hover:bg-red-900 px-3 py-1 rounded-lg transition-colors"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 rounded-xl shadow-xl p-6 border border-gray-200/20">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
              Total Policies
            </h2>
            <p className="text-4xl font-bold text-white mt-3">
              {totalPolicies}
            </p>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4"></div>
          </div>
          <div className="bg-slate-900 rounded-xl shadow-xl p-6 border border-gray-200/20">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
              Over-Permissive Policies
            </h2>
            <p className="text-4xl font-bold text-white mt-3">
              {overPermissivePoliciesCount}
            </p>
            <p className="text-sm text-white mt-2">
              {overPermissivePercentage}% of total policies
            </p>
            <p className="text-sm text-white ">
              {overPermissiveChangeSymbol} {Math.abs(overPermissiveChange)}%
              from last month
            </p>
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mt-4"></div>
          </div>
        </div>

        {/* Header and Trigger Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            GitHub Analysis
          </h1>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
              text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300
              shadow-lg hover:shadow-xl transform hover:scale-105
              ${isLoading ? "opacity-50 cursor-not-allowed transform-none" : ""}
            `}
          >
            {isLoading ? "Running..." : "Trigger Run"}
          </button>
        </div>

        {/* GitHub Credentials Dialog */}
        {/* {isDialogOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50">
              <h2 className="text-2xl font-semibold text-white mb-6">Enter GitHub Credentials</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Repository Owner</label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full p-3 bg-gray-700/50 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter repository owner"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCloseDialog}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Loading Bar */}
        {isLoading && (
          <div className="mb-8">
            <div className="text-sm text-gray-300 mb-3">
              Analyzing GitHub repositories...
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Analysis Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Overpermissive Policy Findings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                      Principal
                    </th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                      Platform
                    </th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                      Action
                    </th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                      Resource
                    </th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                      Effect
                    </th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(
                    (entry, index) =>
                      entry.metadata?.findings?.flatMap(
                        (finding, fIdx) =>
                          finding.overpermissive_policies?.map(
                            (policy, pIdx) => (
                              <tr
                                key={`${entry.id}-${fIdx}-${pIdx}`}
                                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                              >
                                <td className="py-4 px-4 text-gray-200">
                                  {entry.principal?.name}
                                </td>
                                <td className="py-4 px-4 text-gray-200">
                                  {entry.platform}
                                </td>
                                <td className="py-4 px-4 text-gray-200">
                                  {Array.isArray(
                                    policy.finding?.policy_snippet?.Action
                                  )
                                    ? policy.finding.policy_snippet.Action.join(
                                        ", "
                                      )
                                    : policy.finding?.policy_snippet?.Action}
                                </td>
                                <td className="py-4 px-4 text-gray-200">
                                  {policy.finding?.policy_snippet?.Resource}
                                </td>
                                <td className="py-4 px-4 text-gray-200">
                                  {policy.finding?.effect}
                                </td>
                                <td className="py-4 px-4 text-red-400 font-medium">
                                  {policy.reason}
                                </td>
                              </tr>
                            )
                          ) || []
                      ) || []
                  )}
                  {data.length === 0 && !isLoading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 px-4 text-center text-gray-400"
                      >
                        No data available. Run an analysis to see results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGithubPage;
