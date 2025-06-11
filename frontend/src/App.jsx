import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Coffee Bean Defect Analyzer</h1>

      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 ml-2 rounded hover:bg-blue-800">
        Analyze
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Prediction Results:</h2>
          <ul>
            {Object.entries(result.class_counts).map(([cls, count]) => (
              <li key={cls}>{cls}: {count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
