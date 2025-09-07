import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TableModalProps {
  onClose: () => void;
  onGenerate: (config: { rows: number; cols: number; headers: string[] }) => void;
}

const TableModal: React.FC<TableModalProps> = ({ onClose, onGenerate }) => {
  const [tableConfig, setTableConfig] = useState({ 
    rows: 3, 
    cols: 3, 
    headers: ['Column 1', 'Column 2', 'Column 3'] 
  });

  const generateTable = () => {
    onGenerate(tableConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Create Table</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Rows</label>
              <input
                type="number"
                min="2"
                max="20"
                value={tableConfig.rows}
                onChange={(e) => setTableConfig({...tableConfig, rows: parseInt(e.target.value)})}
                className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Columns</label>
              <input
                type="number"
                min="1"
                max="10"
                value={tableConfig.cols}
                onChange={(e) => {
                  const cols = parseInt(e.target.value);
                  const headers = Array(cols).fill(null).map((_, i) => `Column ${i + 1}`);
                  setTableConfig({...tableConfig, cols, headers});
                }}
                className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Column Headers</label>
            {tableConfig.headers.map((header, index) => (
              <input
                key={index}
                type="text"
                value={header}
                onChange={(e) => {
                  const newHeaders = [...tableConfig.headers];
                  newHeaders[index] = e.target.value;
                  setTableConfig({...tableConfig, headers: newHeaders});
                }}
                className="w-full border rounded px-3 py-2 mb-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                placeholder={`Header ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 text-sm text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={generateTable}
              className="px-4 py-2 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 text-sm"
            >
              Create Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableModal;