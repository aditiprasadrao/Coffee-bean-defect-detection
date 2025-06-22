import React, { useState } from 'react';
import axios from 'axios';
import DragDropUpload from "./DragAndDropUpload";


function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null); // Reset previous result if new file is selected
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Section */}
      <section>
        <DragDropUpload onFileSelect={handleFileSelect} />
      </section>

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full max-h-60 object-contain border rounded transition-transform duration-300 hover:scale-105"
        />
      )}

      {/* Upload Button */}
      <button
        className={`w-full bg-amber-600 text-white text-lg px-6 py-3 rounded-lg transition-transform duration-300 ${
          file ? 'hover:bg-amber-700 hover:scale-105' : 'opacity-50 cursor-not-allowed'
        }`}
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6 text-left w-full">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Prediction:</h3>
          <ul className="text-sm text-gray-800 list-disc list-inside">
            {Object.entries(result.counts).map(([cls, count]) => (
              <li key={cls}>
                <strong>{cls}</strong>: {count}
              </li>
            ))}
          </ul>
          <img
            src={`http://127.0.0.1:8000/${result.annotated_image_path}`}
            alt="Prediction"
            className="mt-4 w-full border rounded transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
