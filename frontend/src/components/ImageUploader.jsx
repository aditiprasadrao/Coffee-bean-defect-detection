import React, { useState } from 'react'
import axios from 'axios'

function ImageUploader() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setLoading(true)

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload/', formData)
      setResult(response.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-gray-700 mb-4"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
        onClick={handleUpload}
      >
        Analyze
      </button>

      {loading && <p className="mt-4 text-sm text-gray-600">Processing...</p>}

      {result && (
        <div className="mt-6 text-left">
          <h3 className="text-lg font-semibold">Prediction:</h3>
          <ul className="mt-2 text-sm text-gray-800">
            {Object.entries(result.class_counts).map(([cls, count]) => (
              <li key={cls}>{cls}: {count}</li>
            ))}
          </ul>
          <img
            src={`http://127.0.0.1:8000/${result.annotated_image_path}`}
            alt="Prediction"
            className="mt-4 w-full border rounded"
          />
        </div>
      )}
    </div>
  )
}

export default ImageUploader
