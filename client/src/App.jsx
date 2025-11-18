import './App.css'
import { useState } from 'react'
import Display from './component/Display'
import Upload from './component/Upload'

function App() {
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleUploadSuccess = () => {
    setIsImageUploaded(true);
  };

  const handleFileChange = () => {
    setIsImageUploaded(false);
  };

  const handleResultsShown = () => {
    setHasResults(true);
  };

  const handleReset = () => {
    setIsImageUploaded(false);
    setHasResults(false);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-r from-yellow-100 via-stone-150 to-amber-100'>
      <div>
        <p className="text-4xl font-bold text-amber-900 mb-6">MangoSpecs: Image-Based Mango Variety Classification</p>
      </div>
      <div className='bg-white/30
           backdrop-blur-sm
           rounded-lg p-6
           border border-white/50
           shadow-lg
           w-auto min-w-fit max-w-full flex flex-col space-y-4'>
        <Upload 
          onUploadSuccess={handleUploadSuccess} 
          onFileChange={handleFileChange}
          disabled={hasResults}
        />
        <Display 
          isImageUploaded={isImageUploaded} 
          onResultsShown={handleResultsShown}
          onReset={handleReset}
          hasResults={hasResults}
        />
      </div>
    </div>
  )
}

export default App
