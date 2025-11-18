import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Upload = ({ onUploadSuccess, onFileChange, disabled }) => {
     
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'
    const [uploadMessage, setUploadMessage] = useState('');
    const prevDisabledRef = useRef(disabled);

    useEffect(() => {
      // Reset when disabled changes from true to false (reset was clicked)
      if (prevDisabledRef.current === true && disabled === false) {
        setFile(null);
        setUploadStatus(null);
        setUploadMessage('');
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.value = '';
        }
      }
      prevDisabledRef.current = disabled;
    }, [disabled]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadStatus(null); // Reset status when new file is selected
    setUploadMessage('');
    
    if (onFileChange) {
      onFileChange();
    }
    
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only JPG, JPEG, PNG images are allowed.");
      setFile(null);
      return;
    }
  };

  const handleUpload = async () => {
    // Check if a file has been selected
    if (!file) {
      alert('Please upload an image.');
      return; 
    }

    setUploadStatus('uploading');
    setUploadMessage('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/uploadfile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      setUploadStatus('success');
      setUploadMessage(`Image "${file.name}" uploaded successfully!`);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
      setUploadMessage('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className='flex flex-col items-center space-y-4'>
       <input 
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        className='hidden'
        id='fileInput'
        disabled={disabled}
      />
      <label 
        htmlFor='fileInput' 
        className={`upload-label px-6 py-4 border-2 border-dashed rounded-lg transition-colors duration-200 font-medium text-center min-w-[200px] ${
          disabled 
            ? 'border-amber-300 bg-amber-50/30 text-amber-500 cursor-not-allowed opacity-50' 
            : 'border-amber-600 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 cursor-pointer'
        }`}
      >
        {file ? file.name : 'Drop The Image'}
      </label>
      <button 
        onClick={handleUpload} 
        disabled={uploadStatus === 'uploading' || !file || disabled}
        className='px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
      >
        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
      </button>
      {uploadMessage && (
        <div className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium ${
          uploadStatus === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : uploadStatus === 'error'
            ? 'bg-red-100 text-red-800 border border-red-300'
            : 'bg-blue-100 text-blue-800 border border-blue-300'
        }`}>
          {uploadStatus === 'uploading' && (
            <span className="inline-block animate-spin mr-2">⏳</span>
          )}
          {uploadStatus === 'success' && (
            <span className="inline-block mr-2">✓</span>
          )}
          {uploadStatus === 'error' && (
            <span className="inline-block mr-2">✗</span>
          )}
          {uploadMessage}
        </div>
      )}
    </div>
  )
}

export default Upload