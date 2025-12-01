import { useState, useEffect } from 'react';

const ProgressIndicator = ({ duration }) => {
  const [progress, setProgress] = useState(0);
//   const estimatedTime = 11000; // 11 seconds average

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        // Smoother progression that reaches ~95% by 11s
        const elapsed = prev;
        const increase = (95 - elapsed) / (11000 / 300);
        return Math.min(prev + increase, 95);
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // When response completes, jump to 100%
 
  const estimatedSeconds = Math.max(1, Math.ceil((11 - (progress / 100) * 11)));

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      <div className="w-full max-w-md">
        {/* Status Text */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-[#0D1828] mb-2">Verifying Claim</h3>
          <p className="text-sm text-gray-500">
            {progress < 100 
              ? `Estimated time: ~${estimatedSeconds}s` 
              : `Completed in ${(duration / 1000).toFixed(2)}s`}
          </p>
        </div>

        {/* Progress Bar - Dark theme matching navbar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-sm">
          <div
            className="bg-linear-to-r from-[#0D1828] to-[#1a2d3f] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress Percentage */}
        <div className="text-center mt-3">
          <span className="text-sm font-semibold text-[#0D1828]">{Math.round(progress)}%</span>
        </div>

        {/* Status Messages */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {progress >= 18 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 18 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Initializing Gemini
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {progress >= 38 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 38 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Searching web and analyzing
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {progress >= 58 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 58 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Processing AI response
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {progress >= 78 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 78 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Extracting sources
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {progress >= 100 ? (
                <span className="text-[#0D1828] font-semibold">✓</span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D1828] opacity-40 animate-pulse"></span>
              )}
            </span>
            <span className={`text-xs transition-colors ${progress >= 100 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              Finalizing results
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;