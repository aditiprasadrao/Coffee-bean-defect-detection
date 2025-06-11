import React, { useState } from "react";
import axios from "axios";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);
    const response = await axios.post("http://localhost:8000/upload/", formData);
    setResult(response.data.result);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 text-white"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
      >
        Analyze
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Detected Beans:</h2>
          <ul className="list-disc list-inside mt-2">
            {Object.entries(result).map(([label, count]) => (
              <li key={label}>
                {label}: <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
