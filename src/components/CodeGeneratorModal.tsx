import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface CodeGeneratorModalProps {
  onClose: () => void;
  onGenerate: (code: string) => void;
}

const CodeGeneratorModal: React.FC<CodeGeneratorModalProps> = ({ onClose, onGenerate }) => {
  const [language, setLanguage] = useState('javascript');
  const [functionName, setFunctionName] = useState('myFunction');
  const [parameters, setParameters] = useState([{ name: 'param1', type: 'string' }]);
  const [returnType, setReturnType] = useState('void');
  const [codeContent, setCodeContent] = useState('');
  const [copied, setCopied] = useState(false);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'rust', label: 'Rust' },
    { value: 'csharp', label: 'C#' },
  ];

  const typeOptions = [
    'string', 'number', 'boolean', 'object', 'array', 'void', 'any', 'unknown',
    'int', 'float', 'double', 'char', 'byte', 'short', 'long'
  ];

  const addParameter = () => {
    setParameters([...parameters, { name: `param${parameters.length + 1}`, type: 'string' }]);
  };

  const removeParameter = (index: number) => {
    if (parameters.length > 1) {
      const newParams = [...parameters];
      newParams.splice(index, 1);
      setParameters(newParams);
    }
  };

  const updateParameter = (index: number, field: 'name' | 'type', value: string) => {
    const newParams = [...parameters];
    newParams[index] = { ...newParams[index], [field]: value };
    setParameters(newParams);
  };

  const generateCode = () => {
    let code = '';
    
    switch (language) {
      case 'javascript':
        code = `function ${functionName}(${parameters.map(p => p.name).join(', ')}) {
  // Your code here
  ${codeContent}
}`;
        break;
        
      case 'typescript':
        code = `function ${functionName}(${parameters.map(p => `${p.name}: ${p.type}`).join(', ')}): ${returnType} {
  // Your code here
  ${codeContent}
}`;
        break;
        
      case 'go':
        { const goReturnType = returnType === 'void' ? '' : ` ${returnType}`;
        code = `func ${functionName}(${parameters.map(p => `${p.name} ${p.type}`).join(', ')})${goReturnType} {
  // Your code here
  ${codeContent}
}`;
        break; }
        
      case 'python':
        code = `def ${functionName}(${parameters.map(p => p.name).join(', ')}):
    # Your code here
    ${codeContent.replace(/\n/g, '\n    ')}`;
        break;
        
      case 'java':
        { const javaReturnType = returnType === 'void' ? 'void' : returnType;
        code = `public ${javaReturnType} ${functionName}(${parameters.map(p => `${p.type} ${p.name}`).join(', ')}) {
    // Your code here
    ${codeContent}
}`;
        break; }
        
      case 'cpp':
        { const cppReturnType = returnType === 'void' ? 'void' : returnType;
        code = `${cppReturnType} ${functionName}(${parameters.map(p => `${p.type} ${p.name}`).join(', ')}) {
    // Your code here
    ${codeContent}
}`;
        break; }
        
      case 'rust':
        { const rustReturnType = returnType === 'void' ? '' : ` -> ${returnType}`;
        code = `fn ${functionName}(${parameters.map(p => `${p.name}: ${p.type}`).join(', ')})${rustReturnType} {
    // Your code here
    ${codeContent}
}`;
        break; }
        
      case 'csharp':
        { const csReturnType = returnType === 'void' ? 'void' : returnType;
        code = `public ${csReturnType} ${functionName}(${parameters.map(p => `${p.type} ${p.name}`).join(', ')})
{
    // Your code here
    ${codeContent}
}`;
        break; }
        
      default:
        code = `// Unsupported language: ${language}`;
    }
    
    return code;
  };

  const handleGenerate = () => {
    const code = generateCode();
    onGenerate(`\`\`\`${language}\n${code}\n\`\`\``);
    onClose();
  };

  const copyToClipboard = () => {
    const code = generateCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Code Generator</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-gray-800 text-gray-200">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Function Name</label>
              <input
                type="text"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                placeholder="Enter function name"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">Parameters</label>
              <button
                onClick={addParameter}
                className="px-2 py-1 bg-green-700 text-gray-100 rounded hover:bg-green-600 text-xs"
              >
                Add Parameter
              </button>
            </div>
            
            <div className="space-y-2">
              {parameters.map((param, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) => updateParameter(index, 'name', e.target.value)}
                    className="border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    placeholder="Parameter name"
                  />
                  <select
                    value={param.type}
                    onChange={(e) => updateParameter(index, 'type', e.target.value)}
                    className="border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
                  >
                    {typeOptions.map((type) => (
                      <option key={type} value={type} className="bg-gray-800 text-gray-200">
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="flex">
                    <button
                      onClick={() => removeParameter(index)}
                      disabled={parameters.length <= 1}
                      className={`px-3 py-2 rounded text-sm flex-1 ${parameters.length <= 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-700 text-gray-100 hover:bg-red-600'}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Return Type</label>
            <input
              type="text"
              value={returnType}
              onChange={(e) => setReturnType(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              placeholder="Return type (e.g., string, number, void)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Code Content</label>
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 font-mono"
              placeholder="Enter your code implementation..."
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">Preview</label>
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 text-sm"
              >
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="border rounded p-3 bg-gray-800 border-gray-700 max-h-40 overflow-y-auto">
              <pre className="text-sm font-mono text-gray-200">
                {generateCode()}
              </pre>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 text-sm text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 text-sm"
            >
              Generate Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGeneratorModal;