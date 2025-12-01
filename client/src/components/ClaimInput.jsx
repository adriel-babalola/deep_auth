import { useState } from 'react';
import { Send } from 'lucide-react';

const ClaimInput = ({ onVerify, loading }) => {
  const [claim, setClaim] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (claim.trim().length >= 10 && !loading) {
      onVerify(claim);
    }
  };

  const exampleClaims = [
    "Electric vehicle sales increased by 40% in 2024",
    "Unemployment rate dropped to historic lows",
    "Nigeria's economy is growing in 2025"
  ];

  const handleExampleClick = (example) => {
    if (!loading) {
      setClaim(example);
    }
  };

  return (
    <div className="input shadow pt-2 rounded-2xl bg-white">
      <form onSubmit={handleSubmit}>
        <div className="examples px-2 mb-2 flex-wrap justify-between">
          <div className="text-xs p-2 text-gray-600">Examples:</div>
          <div className="span text-xs flex flex-wrap gap-3">
            {exampleClaims.map((example, index) => (
              <span
                key={index}
                onClick={() => handleExampleClick(example)}
                className={`bg-gray-100 px-2 py-2 rounded-full transition-all ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-200 cursor-pointer'
                } ${index === 0 ? 'block' : 'hidden md:block'}`}
              >
                {example}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex bg-white shadow-[0_-3px_2px_-3px_rgba(0,0,0,0.05)] rounded-xl border-t border-gray-100 items-center px-3 py-2">
          <input
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Ask Ase..."
            className="flex-1 px-1 py-1 text-sm outline-none disabled:opacity-50"
            disabled={loading}
          />
          
          <button
            onClick={handleSubmit}
            disabled={loading || claim.trim().length < 10}
            className={`rounded-full w-8 h-8 text-white p-2 ml-2 transition-all ${
              loading || claim.trim().length < 10
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#0D1828] hover:bg-[#1a2d3f] cursor-pointer'
            }`}
          >
              {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
{/*         
        {claim.length > 0 && (
          <div className="px-3 py-1 text-xs text-right">
            <span className={claim.length >= 10 ? 'text-green-600' : 'text-gray-400'}>
              {claim.length >= 10 ? '✓ Ready' : `${10 - claim.length} more characters needed`}
            </span>
          </div>
        )} */}
      </form>
    </div>
  );
}

export default ClaimInput
