import React from 'react';
import { Link } from 'react-router-dom';
import { User, GitBranch, Hash, Shield, AlertTriangle, Clock, Loader2, XCircle } from 'lucide-react';

const ScanCard = ({ 
  repoId, 
  repositoryName, 
  userName, 
  totalFindings, 
  verified_findings, 
  unverified_findings, 
  latestScanId,
  isProcessing = false,
  pollingCompleted = false // Changed from pollingStopped to pollingCompleted
}) => {
  // Determine if this repo couldn't be processed due to constraints
  const isStalled = isProcessing && pollingCompleted;

  // If repository is processing, don't make it clickable
  const CardContent = () => (
    <div className={`bg-[#1F1F23] border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
      isStalled
        ? 'border-[#FFA500] bg-[#2A2416]' // Orange border for stalled repos
        : isProcessing 
        ? 'border-[#A9DFD8] bg-[#1F1F23]' // Normal processing state
        : 'border-[#3A3A3D] hover:border-[#A9DFD8] group'
    }`}>
      <div className="space-y-3">
        {/* Repository name */}
        <div className="flex items-center space-x-2">
          <GitBranch className={`w-4 h-4 ${
            isStalled ? 'text-[#FFA500]' : isProcessing ? 'text-[#A9DFD8]' : 'text-[#A9DFD8]'
          }`} />
          <span className={`text-sm font-medium transition-colors ${
            isStalled
              ? 'text-[#FFFFFF]'
              : isProcessing 
              ? 'text-[#FFFFFF]' 
              : 'text-[#FFFFFF] group-hover:text-[#A9DFD8]'
          }`}>
            {repositoryName}
          </span>
        </div>

        {/* Owner name */}
        <div className="flex items-center space-x-2">
          <User className={`w-4 h-4 ${
            isStalled ? 'text-[#FFA500]' : isProcessing ? 'text-[#A9DFD8]' : 'text-[#A9DFD8]'
          }`} />
          <span className="text-[#FFFFFF] text-sm font-medium">{userName}</span>
        </div>

        {/* Processing indicator or findings info */}
        {isStalled ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#FFA500]" />
              <span className="text-[#FFA500] text-xs font-medium">
                Not available under free tier.
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="w-3 h-3 text-[#FFA500]" />
              <span className="text-[#FFA500] text-xs">Large files.</span>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-[#A9DFD8] animate-spin" />
              <span className="text-[#A9DFD8] text-xs font-medium">
                Processing...
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#A9DFD8]" />
              <span className="text-[#A9DFD8] text-xs">Pending</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-[#A6A7A9]" />
              <span className="text-[#A6A7A9] text-xs">
                {totalFindings || 0} findings
              </span>
            </div>

            {/* Conditional icon */}
            {verified_findings > 0 ? (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 text-xs">{verified_findings}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">Secure</span>
              </div>
            )}
          </div>
        )}

        {/* Additional processing indicator
        {isStalled ? (
          <div className="mt-2 pt-2 border-t border-[#3A3A3D]">
            <div className="flex items-center justify-center">
              <span className="text-[#A6A7A9] text-xs text-center">
                Repository couldn't be processed. Might be too large or facing constraints.
              </span>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="mt-2 pt-2 border-t border-[#3A3A3D]">
            <div className="flex items-center justify-center">
              <span className="text-[#A6A7A9] text-xs text-center">
                Scan results will appear here once processing is complete
              </span>
            </div>
          </div>
        ) : null} */}
      </div>
    </div>
  );

  // If processing or stalled, don't wrap with Link
  if (isProcessing || isStalled) {
    return <CardContent />;
  }

  // If not processing, wrap with Link for navigation
  return (
    <Link to={`/repositories/${repoId}`}>
      <CardContent />
    </Link>
  );
};

export default ScanCard;