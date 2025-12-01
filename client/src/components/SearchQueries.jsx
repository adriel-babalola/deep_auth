import React from 'react'
import { Search } from 'lucide-react'

const SearchQueries = ({ queries }) => {
   if (!queries || queries.length === 0) return null;

  return (
    <div className="serch-queries bg-gray-100 p-2 rounded-xl flex flex-col gap-3 m-3">
      <h2 className='text-sm flex items-center gap-2'>
        <Search className='size-3.5'/> Search Queries Used:
      </h2>
      <div className="queries flex flex-wrap gap-3">
        {queries.map((query, index) => (
          <p key={index} className='text-xs bg-white p-2 rounded-full'>{query}</p>
        ))}
      </div>
    </div>
  );
}

export default SearchQueries
