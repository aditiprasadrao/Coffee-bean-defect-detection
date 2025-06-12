import React from 'react'
import ImageUploader from './components/ImageUploader'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold text-amber-800 mb-6">
          Coffee Bean Defect Detector
        </h1>
        <ImageUploader />
      </div>
    </div>
  )
}

export default App
