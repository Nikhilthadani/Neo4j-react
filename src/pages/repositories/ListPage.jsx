import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react";
import axios from "axios";

const ListPage = () => {
  const { repoId } = useParams();
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setname] = useState("");

  useEffect(() => {
    const fetchFindings = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.REACT_APP_URL}api/findings/repoId/${repoId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );

        console.log("data at layer 2", response.data);

        // If repositories is empty or undefined/null, handle it gracefully
        if (
          !response.data?.repositories ||
          response.data.repositories.length === 0
        ) {
          setError(
            "No repositories found for this account, Please configure the app."
          );
          setFindings([]);
          return;
        }

        setname(response.data.repositories[0].repository);
        setFindings(response.data);
      } catch (error) {
        console.error("Error fetching findings:", error);

        // Axios error object check
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "Something went wrong! Please try again later."
          );
        } else {
          setError("Unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFindings();
  }, [repoId]);

  if (loading) {
    return (
      <div className="bg-[#18181B] min-h-screen p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A9DFD8]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#27272A] min-h-screen p-6">
        <div className="bg-[#18181B] rounded-lg shadow-md p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() =>
              window.location.href("http://localhost:8080/api/auth/installApp")
            }
            className="bg-[#A9DFD8] text-[#1e1e1e] px-4 py-2 rounded text-sm font-medium hover:bg-[#8FCCC5] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#27272A] min-h-screen p-6">
      <div className="bg-[#18181B] rounded-lg shadow-md">
        <div className="p-6 border-b border-[#3A3A3D] flex items-center justify-between">
          <Link
            to="/repositories"
            className="flex items-center space-x-2 text-[#A9DFD8] hover:text-[#8FCCC5]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Repositories</span>
          </Link>
          <h1 className="text-[#FFFFFF] text-xl font-semibold">
            Findings for <p>{name}</p>
          </h1>
        </div>

        <div className="p-6">
          {findings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#A6A7A9] text-lg mb-4">
                No findings found for this repository
              </p>
              <p className="text-[#A6A7A9] text-sm">
                This repository appears to be clean of any detected secrets.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#3A3A3D]">
                    <th className="text-left p-3 text-[#A6A7A9] font-medium">
                      Status
                    </th>
                    <th className="text-left p-3 text-[#A6A7A9] font-medium">
                      Scan ID
                    </th>
                    {/* <th className="text-left p-3 text-[#A6A7A9] font-medium">Repository</th> */}
                    <th className="text-left p-3 text-[#A6A7A9] font-medium">
                      Owner
                    </th>
                    <th className="text-left p-3 text-[#A6A7A9] font-medium">
                      Detector
                    </th>
                    <th className="text-left p-3 text-[#A6A7A9] font-medium">
                      File
                    </th>
                    <th className="text-left p-3 text-[#A6A7A9] font-medium">
                      Raw Result
                    </th>
                    {/* <th className="text-left p-3 text-[#A6A7A9] font-medium">Date</th>*/}
                    <th className="text-left p-3 text-[#A6A7A9] font-medium">
                      Blast Radius
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {findings.repositories.map((finding, index) => (
                    <tr
                      key={finding.id || index}
                      className="border-b border-[#2A2A35] hover:bg-[#1F1F23]"
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          {finding.verified ? (
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                          ) : (
                            <Shield className="w-4 h-4 text-green-400" />
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              finding.verified
                                ? "bg-orange-900 text-orange-300"
                                : "bg-green-900 text-green-300"
                            }`}
                          >
                            {finding.verified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-[#FFFFFF]">
                        {finding.scan_id.slice(0, 8)}...
                      </td>
                      {/* <td className="p-3 text-[#FFFFFF]">{finding.repository}</td> */}
                      <td className="p-3 text-[#A6A7A9]">{finding.owner}</td>
                      <td className="p-3 text-xs ml-2 text-[#A9DFD8] px-2 py-1 rounded">
                        {finding.detector_type}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-[#A6A7A9]">
                            {finding.file}
                          </span>
                          <span className="text-xs text-[#A6A7A9]">
                            Line {finding.line}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 max-w-xs">
                        <span className="font-mono text-xs text-[#FFFFFF] truncate block">
                          {finding.raw_result}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          className="w-4 h-4"
                          to={`/repositories/${repoId}/secrets/${finding.id}`}
                        >
                          <button className="text-[#A9DFD8] hover:text-[#8FCCC5] transition-colors">
                            Insights
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
