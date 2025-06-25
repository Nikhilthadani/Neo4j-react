import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const INTEGRATION_URL = "https://nhi.api.stackguard.org";

const IntegrationAWSPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableFindingTypes, setAvailableFindingTypes] = useState([]);

  // Dynamic finding type configuration
  const FINDING_TYPE_CONFIG = {
    overpermissive_policies: {
      label: "Over-Permissive Policies",
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-800/30",
      cardBg: "from-red-900/30 to-red-800/20",
      cardBorder: "border-red-700/30",
      accentColor: "text-red-300",
      valueColor: "text-red-400",
    },
    unused_actions: {
      label: "Unused Actions",
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-800/30",
      cardBg: "from-yellow-900/30 to-yellow-800/20",
      cardBorder: "border-yellow-700/30",
      accentColor: "text-yellow-300",
      valueColor: "text-yellow-400",
    },
    full_admin_privileges: {
      label: "Full Admin Privileges",
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-800/30",
      cardBg: "from-purple-900/30 to-purple-800/20",
      cardBorder: "border-purple-700/30",
      accentColor: "text-purple-300",
      valueColor: "text-purple-400",
    },
    // Add more finding types as needed
    excessive_permissions: {
      label: "Excessive Permissions",
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-800/30",
      cardBg: "from-orange-900/30 to-orange-800/20",
      cardBorder: "border-orange-700/30",
      accentColor: "text-orange-300",
      valueColor: "text-orange-400",
    },
    privilege_escalation: {
      label: "Privilege Escalation",
      color: "text-pink-400",
      bgColor: "bg-pink-900/20",
      borderColor: "border-pink-800/30",
      cardBg: "from-pink-900/30 to-pink-800/20",
      cardBorder: "border-pink-700/30",
      accentColor: "text-pink-300",
      valueColor: "text-pink-400",
    },
  };

  // Get default config for unknown finding types
  const getDefaultConfig = (findingType) => ({
    label: findingType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-800/30",
    cardBg: "from-blue-900/30 to-blue-800/20",
    cardBorder: "border-blue-700/30",
    accentColor: "text-blue-300",
    valueColor: "text-blue-400",
  });

  // Dynamically discover finding types from data
  const discoverFindingTypes = (data) => {
    const findingTypes = new Set();

    data.forEach((item) => {
      if (item.metadata && item.metadata.findings) {
        item.metadata.findings.forEach((finding) => {
          Object.keys(finding).forEach((key) => {
            if (Array.isArray(finding[key]) && finding[key].length > 0) {
              findingTypes.add(key);
            }
          });
        });
      }
    });

    return Array.from(findingTypes);
  };

  // Generate category options dynamically
  const generateCategoryOptions = (findingTypes) => {
    const options = [
      { value: "all", label: "All Categories", color: "text-white" },
    ];

    findingTypes.forEach((type) => {
      const config = FINDING_TYPE_CONFIG[type] || getDefaultConfig(type);
      options.push({
        value: type,
        label: config.label,
        color: config.color,
      });
    });

    return options;
  };

  // Trigger AWS analysis run
  const triggerRun = async () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      const response = await fetch(
        `${INTEGRATION_URL}/api/v1/connector/trigger`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aws_creds: {
              access_key_id: accessKeyId,
              secret_key: secretKey,
              region,
            },
            platform: "aws",
          }),
        }
      );

      const responseData = await response.json();

      if (responseData.body.length === 0 || !responseData.body) {
        setError(
          "Failed to trigger AWS analysis. Please check credentials and try again."
        );
        return;
      }

      console.log("Run triggered successfully:", responseData);
      setData(responseData.body || []);

      // Discover finding types from the response
      const discoveredTypes = discoverFindingTypes(responseData.body || []);
      console.log("Discovered finding types:", discoveredTypes);
      setAvailableFindingTypes(discoveredTypes);

      clearInterval(progressInterval);
      setProgress(100);
    } catch (error) {
      console.error("Error triggering run:", error);
      setError(
        "Failed to trigger AWS analysis. Please check credentials and try again."
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
    setAccessKeyId("");
    setSecretKey("");
    setRegion("us-east-1");
    setError(null);
  };

  const handleSubmit = () => {
    if (accessKeyId && secretKey) {
      setIsDialogOpen(false);
      triggerRun();
    } else {
      setError("Please fill in both Access Key ID and Secret Key.");
    }
  };

  // Process data for display dynamically
  const processData = (items) => {
    return items.map((item) => {
      const processedItem = {
        roleName: item.principal.name,
        findings: {},
      };

      // Dynamically process all finding types
      availableFindingTypes.forEach((findingType) => {
        processedItem.findings[findingType] = item.metadata.findings
          .filter((f) => f[findingType])
          .flatMap((f) =>
            f[findingType].map((finding) => ({
              statement: finding.statement,
              reason: finding.reason,
              action: finding.action,
              resource: finding.resource,
              ...finding, // Include any other properties
            }))
          );
      });

      return processedItem;
    });
  };

  const processedData = processData(data);

  // Calculate metrics dynamically
  const calculateMetrics = () => {
    const metrics = {
      totalPolicies: data.reduce(
        (acc, item) => acc + item.metadata.findings.length,
        0
      ),
    };

    availableFindingTypes.forEach((findingType) => {
      const count = processedData.reduce(
        (acc, item) => acc + (item.findings[findingType]?.length || 0),
        0
      );
      metrics[findingType] = {
        count,
        percentage:
          metrics.totalPolicies > 0
            ? Math.round((count / metrics.totalPolicies) * 100)
            : 0,
        change: Math.floor(Math.random() * 10), // Placeholder - replace with real data
      };
    });

    return metrics;
  };

  const metrics = calculateMetrics();
  const categoryOptions = generateCategoryOptions(availableFindingTypes);

  // Filter data based on selected category
  const getFilteredData = () => {
    if (selectedCategory === "all") return processedData;

    return processedData.filter(
      (item) =>
        item.findings[selectedCategory] &&
        item.findings[selectedCategory].length > 0
    );
  };

  const filteredData = getFilteredData();
  const selectedCategoryData = categoryOptions.find(
    (cat) => cat.value === selectedCategory
  );

  // Render finding details
  const renderFindingDetails = (findings, findingType) => {
    if (!findings || findings.length === 0) {
      return <span className="text-green-400">None</span>;
    }

    const config =
      FINDING_TYPE_CONFIG[findingType] || getDefaultConfig(findingType);

    return (
      <div className="space-y-3">
        {findings.map((finding, idx) => (
          <div
            key={idx}
            className={`${config.bgColor} border ${config.borderColor} rounded-lg p-3`}
          >
            {finding.action && (
              <div className="mb-1">
                <span className={`${config.accentColor} font-medium`}>
                  Action:
                </span>{" "}
                <span className="text-gray-300">
                  {Array.isArray(finding.action)
                    ? finding.action.join(", ")
                    : finding.action}
                </span>
              </div>
            )}
            {finding.statement && finding.statement.Action && (
              <div className="mb-1">
                <span className={`${config.accentColor} font-medium`}>
                  Action:
                </span>{" "}
                <span className="text-gray-300">
                  {Array.isArray(finding.statement.Action)
                    ? finding.statement.Action.join(", ")
                    : finding.statement.Action}
                </span>
              </div>
            )}
            {finding.resource && (
              <div className="mb-1">
                <span className={`${config.accentColor} font-medium`}>
                  Resource:
                </span>{" "}
                <span className="text-gray-300">{finding.resource}</span>
              </div>
            )}
            {finding.statement && finding.statement.Resource && (
              <div className="mb-1">
                <span className={`${config.accentColor} font-medium`}>
                  Resource:
                </span>{" "}
                <span className="text-gray-300">
                  {Array.isArray(finding.statement.Resource)
                    ? finding.statement.Resource.join(", ")
                    : finding.statement.Resource}
                </span>
              </div>
            )}
            {finding.reason && (
              <div>
                <span className={`${config.accentColor} font-medium`}>
                  Reason:
                </span>{" "}
                <span className={config.valueColor}>{finding.reason}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
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

        {/* Dynamic Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 mb-8">
          {/* Total Policies Card */}
          {/* <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium text-blue-200">Total Policies</h2>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{metrics.totalPolicies}</p>
            <div className="text-xs text-blue-300">AWS IAM</div>
          </div> */}

          {/* Dynamic Finding Type Cards */}
          {availableFindingTypes.map((findingType) => {
            const config =
              FINDING_TYPE_CONFIG[findingType] || getDefaultConfig(findingType);
            const metric = metrics[findingType];
            const changeSymbol = metric.change >= 0 ? "↑" : "↓";

            return (
              <div
                key={findingType}
                className={`bg-gradient-to-br ${config.cardBg} backdrop-blur-sm border ${config.cardBorder} rounded-2xl p-4 shadow-xl`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2
                    className="text-xs font-medium"
                    style={{ color: config.color.replace("text-", "") }}
                  >
                    {config.label}
                  </h2>
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor: config.color.replace("text-", ""),
                    }}
                  ></div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {metric.count}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span style={{ color: config.color.replace("text-", "") }}>
                    {metric.percentage}% of total
                  </span>
                  <span
                    style={{ color: config.valueColor.replace("text-", "") }}
                  >
                    {changeSymbol} {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Header and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              AWS Roles Analysis
            </h1>
            <p className="text-gray-400 mt-2">
              Comprehensive security analysis for AWS IAM roles and policies
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter Dropdown */}
            {processedData.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-white px-4 py-3 rounded-xl transition-all duration-200 min-w-[200px] justify-between"
                >
                  <span className={selectedCategoryData?.color}>
                    {selectedCategoryData?.label}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-10 overflow-hidden">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCategory(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors duration-200 ${
                          option.color
                        } ${
                          selectedCategory === option.value ? "bg-gray-700" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trigger Button */}
            <button
              onClick={handleOpenDialog}
              disabled={isLoading}
              className={`group relative overflow-hidden bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 ${
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
                    <span>⚡</span>
                    Trigger Run
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>
        </div>

        {/* AWS Credentials Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  AWS Credentials
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Access Key ID
                    </label>
                    <input
                      type="text"
                      value={accessKeyId}
                      onChange={(e) => setAccessKeyId(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter Access Key ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter Secret Key"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      AWS Region
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter Region (e.g., us-east-1)"
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
                    className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
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
              <div className="text-orange-300 font-medium">
                Analyzing AWS roles...
              </div>
              <div className="text-orange-400 text-sm">{progress}%</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Analysis Table */}
        {filteredData.length > 0 && (
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    AWS IAM Analysis Results
                    {selectedCategory !== "all" && (
                      <span
                        className={`ml-2 text-lg ${selectedCategoryData?.color}`}
                      >
                        - {selectedCategoryData?.label}
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {selectedCategory === "all"
                      ? "Showing all security findings for AWS roles and policies"
                      : `Showing ${
                          filteredData.length
                        } roles with ${selectedCategoryData?.label.toLowerCase()}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Role Name
                    </th>
                    {selectedCategory === "all" ? (
                      availableFindingTypes.map((type) => {
                        const config =
                          FINDING_TYPE_CONFIG[type] || getDefaultConfig(type);
                        return (
                          <th
                            key={type}
                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            {config.label}
                          </th>
                        );
                      })
                    ) : (
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {selectedCategoryData?.label}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {item.roleName}
                      </td>

                      {selectedCategory === "all" ? (
                        availableFindingTypes.map((type) => (
                          <td
                            key={type}
                            className="px-6 py-4 text-sm text-gray-300"
                          >
                            {renderFindingDetails(item.findings[type], type)}
                          </td>
                        ))
                      ) : (
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {renderFindingDetails(
                            item.findings[selectedCategory],
                            selectedCategory
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationAWSPage;
