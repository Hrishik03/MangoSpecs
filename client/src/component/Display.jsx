import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Display = ({ isImageUploaded, onResultsShown, onReset, hasResults }) => {
    const[result,setResult] = useState(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (result && !loading) {
        onResultsShown();
      }
    }, [result, loading, onResultsShown]);

    const handleAnalyze = async () => {
        setLoading(true);
    
        try {
          const res = await axios.get('http://localhost:8000/analyze');
          console.log(res.data);
          setResult(res.data);
        } catch (error) {
          console.error("Error analyzing:", error);
        }
    
        setLoading(false);
      };

    const handleReset = () => {
      setResult(null);
      setLoading(false);
      if (onReset) {
        onReset();
      }
    };
  return (
    <div className='flex flex-col items-center space-y-4 w-full'>
       <button 
        onClick={handleAnalyze} 
        disabled={loading || !isImageUploaded || hasResults}
        className='px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
      >
        {loading ? 'Analyzing...' : 'Get Result'}
      </button>
      {!isImageUploaded && !hasResults && (
        <p className='text-sm text-amber-700 italic'>Please upload an image first</p>
      )}

      {loading && (
        <div className='flex items-center space-x-2 text-amber-700 font-medium'>
          <span className="inline-block animate-spin">⏳</span>
          <p>Analyzing...</p>
        </div>
      )}

      {result && !loading && (
        <div className='w-full space-y-4'>
          <div className='bg-amber-50/70 border border-amber-200 rounded-lg p-4 shadow-md'>
            <h2 className='text-xl font-bold text-amber-900 mb-2'>Mango Species</h2>
            <p className='text-2xl font-semibold text-amber-800 mb-1'>{result.species?.label}</p>
            <p className='text-sm text-amber-700'>Confidence: <span className='font-semibold'>{result.species?.confidence?.toFixed(2)}%</span></p>
          </div>

          <div className='bg-amber-50/70 border border-amber-200 rounded-lg p-4 shadow-md'>
            <h2 className='text-xl font-bold text-amber-900 mb-2'>Quality Grade</h2>
            <p className='text-2xl font-semibold text-amber-800 mb-1'>{result.grade?.label}</p>
            <p className='text-sm text-amber-700'>Confidence: <span className='font-semibold'>{result.grade?.confidence?.toFixed(2)}%</span></p>
          </div>

          <div className='flex justify-center mt-4'>
            <button 
              onClick={handleReset}
              className='px-4 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
            >
              Reset
            </button>
          </div>
        </div>
      )} 
    </div>
  )
}

export default Display