import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  onClose: () => void;
  onInsert: (altText: string, imageUrl: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ onClose, onInsert }) => {
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleInsert = () => {
    if (imageUrl.trim()) {
      onInsert(altText, imageUrl);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInsert();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Insert Image</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Alt Text (optional)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              placeholder="Description of the image"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-70 text-gray-200 placeholder-gray-500"
              placeholder="https://example.com/image.png"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 text-sm text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!imageUrl.trim()}
              className={`px-4 py-2 rounded text-sm ${
                imageUrl.trim() 
                  ? 'bg-blue-700 text-gray-100 hover:bg-blue-600' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
