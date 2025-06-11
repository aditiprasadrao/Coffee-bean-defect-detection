import React from "react";
import ImageUpload from "./components/imageupload";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-10">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Coffee Bean Classifier ☕</h1>
        <ImageUpload />
      </div>
    </div>
  );
}

export default App;
