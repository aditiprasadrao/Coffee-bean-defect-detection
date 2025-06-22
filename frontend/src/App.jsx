import React from "react";
import ImageUploader from "./components/ImageUploader";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3e2723] via-[#4e342e] to-[#6d4c41] flex flex-col items-center px-4 py-10">
      
      {/* Header */}
      <header className="text-center mb-10">
        <img
          src="/logo.png"
          alt="Coffee Bean Logo"
          className="h-20 w-20 object-contain mx-auto mb-4"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-amber-100 tracking-wide">
          COFFEE BEAN DEFECT ANALYSER
        </h1>
        <div className="border-b-4 border-amber-300 mt-3 w-72 mx-auto"></div>
      </header>

      {/* Content Box */}
      <main className="bg-white bg-opacity-95 shadow-2xl rounded-xl p-8 w-full max-w-2xl">
        <ImageUploader />
      </main>
    </div>
  );
}

export default App;
