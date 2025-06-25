import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const RepoAccessPopup = ({ open, onClose, onSave }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [repoAccessType, setRepoAccessType] = useState("all"); // 'all' or 'selected'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  console.log("repo list data ", repositories);

  // Helper to get repo object by id
  const getRepoById = (id) => repositories.find((r) => r.id === id);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      axios
        .get(`${import.meta.env.REACT_APP_URL}api/auth/repolist`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          setRepositories(response.data.repositories || response.data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load repositories");
          setLoading(false);
        });
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!open) return null;

  const handleSelect = (id) => {
    setSelectedRepos((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(id);
    }
  };

  const handleRadioChange = (type) => {
    setRepoAccessType(type);
    if (type === "all") {
      setSelectedRepos([]);
      setDropdownOpen(false);
    }
  };

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      repo.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#18181B] rounded-lg p-8 w-full max-w-lg shadow-lg relative">
        <h2 className="text-xl font-semibold text-white mb-4">
          Repository access
        </h2>
        <div className="mb-4">
          <label className="flex items-center text-white mb-2 cursor-pointer">
            <input
              type="radio"
              name="repoAccess"
              checked={repoAccessType === "all"}
              onChange={() => handleRadioChange("all")}
              className="mr-2"
            />
            All repositories
          </label>
          <label className="flex items-center text-white mb-2 cursor-pointer">
            <input
              type="radio"
              name="repoAccess"
              checked={repoAccessType === "selected"}
              onChange={() => handleRadioChange("selected")}
              className="mr-2"
            />
            Only select repositories
          </label>
          {repoAccessType === "selected" && (
            <div className="relative mt-2" ref={dropdownRef}>
              <button
                className="w-full bg-[#23232a] border border-[#444] rounded px-4 py-2 flex items-center justify-between text-left text-gray-300 focus:outline-none"
                onClick={() => setDropdownOpen((o) => !o)}
                type="button"
              >
                <span className="truncate">
                  {selectedRepos.length === 0
                    ? "Select repositories"
                    : `${selectedRepos.length} repos selected`}
                </span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-[#23232a] border border-[#444] rounded shadow-lg z-10 max-h-80 overflow-y-auto">
                  <div className="sticky top-0 z-20 bg-[#23232a] p-2 pb-0">
                    {selectedRepos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedRepos.map((id) => {
                          const repo = getRepoById(id);
                          if (!repo) return null;
                          return (
                            <span
                              key={id}
                              className="flex items-center bg-[#18181B] border border-[#444] text-white text-xs rounded-full px-3 py-1 mr-1 mb-1"
                            >
                              {repo.full_name}
                              <button
                                className="ml-2 text-gray-400 hover:text-red-400 focus:outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelect(id);
                                }}
                                title="Remove"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded bg-[#18181B] text-white border border-[#333] text-sm focus:outline-none"
                      placeholder="Search for a repository"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  {loading && (
                    <div className="p-4 text-gray-400 text-center text-sm">
                      Loading repositories...
                    </div>
                  )}
                  {error && (
                    <div className="p-4 text-red-400 text-center text-sm">
                      {error}
                    </div>
                  )}
                  {!loading && !error && filteredRepos.length === 0 && (
                    <div className="p-4 text-gray-400 text-center text-sm">
                      No repositories found
                    </div>
                  )}
                  {!loading &&
                    !error &&
                    filteredRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className={`flex items-center px-4 py-2 cursor-pointer rounded transition-colors duration-100 ${
                          selectedRepos.includes(repo.id) ? "bg-[#222]" : ""
                        } hover:bg-[#333] focus:bg-[#222]`}
                        onClick={() => handleSelect(repo.id)}
                        onKeyDown={(e) => handleKeyDown(e, repo.id)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedRepos.includes(repo.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRepos.includes(repo.id)}
                          readOnly
                          className="mr-2 pointer-events-none"
                          tabIndex={-1}
                        />
                        {/* Icon for private/public */}
                        {repo.private ? (
                          <svg
                            className="w-4 h-4 text-yellow-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 17a2 2 0 002-2v-2a2 2 0 00-2-2 2 2 0 00-2 2v2a2 2 0 002 2zm6 0V9a6 6 0 10-12 0v8a2 2 0 002 2h8a2 2 0 002-2z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        )}
                        <div>
                          <div className="text-white font-medium text-sm">
                            {repo.full_name}
                          </div>
                          {repo.description ? (
                            <div className="text-xs text-gray-400">
                              {repo.description}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">
                              No description
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`bg-green-600 text-white px-4 py-2 rounded ${
              repoAccessType === "selected" && selectedRepos.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              repoAccessType === "all" || selectedRepos.length > 0
                ? onSave(selectedRepos)
                : null
            }
            disabled={
              repoAccessType === "selected" && selectedRepos.length === 0
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepoAccessPopup;
