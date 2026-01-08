"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Product Image" }: ImageUploadProps) {
  const [preview, setPreview] = useState(value);

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreview(url);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Simple URL Input */}
      <input
        type="url"
        value={value}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Paste image URL here"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Preview */}
      {preview && (
        <div className="relative inline-block w-full">
          <img
            src={preview}
            alt="Preview"
            onError={() => setPreview("")}
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-red-50 rounded-full flex items-center justify-center shadow-md transition-colors"
            title="Remove image"
          >
            <X size={16} className="text-red-600" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
