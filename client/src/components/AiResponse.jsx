import { X, Check, AlertTriangle} from 'lucide-react';

const AiResponse = ({ result }) => {
   if (!result) return null;

  const confidence = result.confidence || 0;
  const verdict = result.verdict || 'UNKNOWN';
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  // Helper to parse and format text with bold, italics, and paragraphs
  const formatText = (text) => {
    if (!text) return '';
    
    return text.split('\n').map((paragraph, idx) => {
      if (!paragraph.trim()) return null;
      
      // Split by ** for bold
      const parts = paragraph.split(/\*\*(.*?)\*\*/g);
      
      return (
        <p key={idx} className="mb-2">
          {parts.map((part, i) => {
            // Even indices are normal text, odd indices are bold
            return i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>;
          })}
        </p>
      );
    }).filter(Boolean);
  };

  const verdictConfig = {
    'SUPPORTED': { icon: Check, color: 'text-green-500', label: 'Verified' },
    'CONTRADICTED': { icon: X, color: 'text-red-500', label: 'Contradicted' },
    'PARTIALLY_SUPPORTED': { icon: AlertTriangle, color: 'text-yellow-500', label: 'Partially Verified' }
  };

  const config = verdictConfig[verdict] || verdictConfig['CONTRADICTED'];
  const VerdictIcon = config.icon;

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="actual-response mt-5 mx-5 overflow-y-auto">
        <div className="card bg-gray-100 md:flex hidden overflow-y-auto rounded-tr-xl rounded-bl-xl w-40 h-40 float-right ml-4 top-0 right-0 mb-4 flex flex-col items-center justify-center p-4">
          <div className="relative w-24 h-24 md:flex hidden ">
            <svg className="transform md:flex hidden -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-300"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={`${config.color} transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-gray-900">{confidence}%</span>
            </div>
          </div>
          
          
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mt-2">Confidence</span>
        </div>

        <h1 className={config ? `flex gap-2 text-2xl font-medium ${config.color}` : `flex gap-2 text-2xl font-medium`}>
          <VerdictIcon className="size-7" /> {config.label}
        </h1>

        <div className="summary my-3">
          <h1 className="text-xl font-semibold">Summary</h1>
          <div className="text-sm text-gray-700 leading-relaxed">
            {formatText(result.summary)}
          </div>
        </div>




        <div className="Analysis">
          <h1 className="text-xl font-semibold">Analysis</h1>
          <div className="text-sm text-gray-700 leading-relaxed">
            {formatText(result.reasoning)}
          </div>
        </div>

        <div className="clear-both"></div>
      </div>
    </div>
  );
}

export default AiResponse



