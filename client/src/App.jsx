import Article from "./components/Article";
import ClaimInput from "./components/ClaimInput";
import Navigation from "./components/Navigation";
import SearchQueries from "./components/SearchQueries";
import AiResponse from "./components/AiResponse";
import ProgressIndicator from "./components/ProgressIndicator";
import { useState } from 'react';
import { verifyClaim } from './services/api'; 


function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(null);

  const handleVerify = async (claim) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDuration(null);

    try {
      const data = await verifyClaim(claim);
      setResult(data);
      setDuration(data.processingTime);
    } catch (err) {
      setError(err.error || err.message || 'Failed to verify claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50">
      <Navigation />
      <main className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 lg:min-h-[83vh] md:min-h-[82vh] min-h-[76vh] mx-5">
        <div className="left col-span-2 flex flex-col lg:min-h-[83vh] md:min-h-[82vh] min-h-[70vh] justify-between">
          <div className="card mb-5 shadow bg-white h-[56vh] sm:h-[64vh] rounded-xl">
            <div className="main-response flex flex-col h-full justify-between overflow-y-auto">
              {loading && (
                <ProgressIndicator duration={duration} />
              )}

              {error && (
                <div className="m-5 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                      <h3 className="font-bold text-red-800">Error</h3>
                      <p className="text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && !loading && (
                <>
                  <AiResponse result={result} /> 
                
                  <SearchQueries queries={result.queries} />
                  
                </>
              )}

              {!result && !loading && !error && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Enter a claim to verify</p>
                </div>
              )}
            </div>
          </div>

          <ClaimInput onVerify={handleVerify} loading={loading} />
          
        </div>

        <div className="right bg-white flex flex-col shadow rounded-xl p-4 lg:h-[83vh] md:h-[83vh] lg:col-span-1 col-span-2  h-auto">
          <div className="heading text-center text-lg pb-3 font-semibold">
            Related Articles {result?.articles ? `(${result.articles.length})` : ''}
          </div>

          <div className="card-list flex flex-col gap-3 overflow-y-auto pr-2">
            {result?.articles && result.articles.length > 0 ? (
              result.articles.map((article, index) => (
                <Article key={index} article={article} index={index} />
                
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No articles yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;