import { ExternalLink } from 'lucide-react';

const Article = ({ article }) => {
  const handleClick = () => {
    if (article.url && article.url !== 'N/A') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Safely extract source name
  const sourceName = typeof article.source === 'string' 
    ? article.source 
    : article.source?.name || 'Unknown Source';

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(article.publishedAt);

  return (
    <div 
      className={`card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 ${
        article.url && article.url !== 'N/A' 
          ? 'cursor-pointer' 
          : 'cursor-default'
      }`}
      onClick={handleClick}
    >
      {/* Article Content */}
      <div>
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-xs text-gray-600 line-clamp-3 mb-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-gray-700">{sourceName}</span>
            {formattedDate && (
              <span className="text-gray-400">{formattedDate}</span>
            )}
          </div>
          
          {article.url && article.url !== 'N/A' && (
            <div className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium">
              <span>Read</span>
              <ExternalLink size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;