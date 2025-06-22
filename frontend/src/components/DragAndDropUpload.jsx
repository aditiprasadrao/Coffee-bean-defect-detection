import React, { useRef } from 'react';

function DragDropUpload({ onFileSelect }) {
  const dropRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove('border-amber-600');
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add('border-amber-600');
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove('border-amber-600');
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className="border-2 border-dashed border-gray-400 hover:border-amber-600 bg-white rounded-lg p-6 text-center cursor-pointer transition-all duration-300"
    >
      <p className="text-gray-700">Drag & drop an image here, or click to select</p>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

export default DragDropUpload;
