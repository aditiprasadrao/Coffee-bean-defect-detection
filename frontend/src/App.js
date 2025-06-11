import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/predict", formData);
      setResult(response.data);
    } catch (err) {
      console.error("Prediction failed", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-100 to-yellow-200 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4 text-center text-amber-700">Coffee Bean Analyzer</h1>
        
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4 w-full" />
        <button
          onClick={handleUpload}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {loading ? "Analyzing..." : "Upload and Analyze"}
        </button>

        {result && (
          <div className="mt-6">
            <img src={`data:image/png;base64,${result.annotated_image}`} alt="Prediction" className="w-full rounded mb-4" />
            <h2 className="text-xl font-semibold text-amber-800">Results:</h2>
            <ul className="list-disc pl-6">
              {Object.entries(result.class_counts).map(([label, count]) => (
                <li key={label}>
                  <strong>{label}:</strong> {count}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
