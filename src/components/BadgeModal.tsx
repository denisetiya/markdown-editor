import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface BadgeModalProps {
  onClose: () => void;
  onInsert: (badgeMarkdown: string) => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ onClose, onInsert }) => {
  const [badgeType, setBadgeType] = useState('custom');
  const [label, setLabel] = useState('TypeScript');
  const [message, setMessage] = useState('007ACC');
  const [color, setColor] = useState('007ACC');
  const [logo, setLogo] = useState('typescript');
  const [style, setStyle] = useState('for-the-badge');
  const [copied, setCopied] = useState(false);

  // Predefined badges
  const predefinedBadges = [
    { name: 'TypeScript', label: 'TypeScript', message: '007ACC', color: '007ACC', logo: 'typescript' },
    { name: 'JavaScript', label: 'JavaScript', message: 'F7DF1E', color: 'F7DF1E', logo: 'javascript' },
    { name: 'React', label: 'React', message: '61DAFB', color: '61DAFB', logo: 'react' },
    { name: 'Node.js', label: 'Node.js', message: '339933', color: '339933', logo: 'node.js' },
    { name: 'Python', label: 'Python', message: '3776AB', color: '3776AB', logo: 'python' },
    { name: 'HTML5', label: 'HTML5', message: 'E34F26', color: 'E34F26', logo: 'html5' },
    { name: 'CSS3', label: 'CSS3', message: '1572B6', color: '1572B6', logo: 'css3' },
    { name: 'Docker', label: 'Docker', message: '2496ED', color: '2496ED', logo: 'docker' },
    { name: 'GitHub', label: 'GitHub', message: '181717', color: '181717', logo: 'github' },
    { name: 'Git', label: 'Git', message: 'F05032', color: 'F05032', logo: 'git' },
  ];

  const generateBadgeUrl = () => {
    const baseUrl = 'https://img.shields.io/badge/';
    const encodedLabel = encodeURIComponent(label);
    const encodedMessage = encodeURIComponent(message);
    const params = new URLSearchParams();
    
    if (color) params.append('color', color);
    if (logo) params.append('logo', logo);
    if (style) params.append('style', style);
    
    return `${baseUrl}${encodedLabel}-${encodedMessage}?${params.toString()}`;
  };

  const generateMarkdown = () => {
    const badgeUrl = generateBadgeUrl();
    return `[![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}?color=${color}${logo ? `&logo=${logo}` : ''}${style ? `&style=${style}` : ''})](${badgeUrl})`;
  };

  const generatePreviewHtml = () => {
    const badgeUrl = generateBadgeUrl();
    return `<a href="${badgeUrl}" target="_blank"><img src="https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}?color=${color}${logo ? `&logo=${logo}` : ''}${style ? `&style=${style}` : ''}" alt="${label}"></a>`;
  };

  const handleInsert = () => {
    const markdown = generateMarkdown();
    onInsert(markdown);
  };

  const handleCopy = () => {
    const markdown = generateMarkdown();
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePredefinedBadgeSelect = (badge: typeof predefinedBadges[0]) => {
    setLabel(badge.label);
    setMessage(badge.message);
    setColor(badge.color);
    setLogo(badge.logo);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Insert Badge</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Badge Type</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setBadgeType('predefined')}
                  className={`px-4 py-2 rounded text-sm ${
                    badgeType === 'predefined'
                      ? 'bg-blue-700 text-gray-100'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Predefined
                </button>
                <button
                  onClick={() => setBadgeType('custom')}
                  className={`px-4 py-2 rounded text-sm ${
                    badgeType === 'custom'
                      ? 'bg-blue-700 text-gray-100'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {badgeType === 'predefined' ? (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Select a Badge</label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {predefinedBadges.map((badge, index) => (
                    <button
                      key={index}
                      onClick={() => handlePredefinedBadgeSelect(badge)}
                      className="p-2 text-left bg-gray-800 hover:bg-gray-700 rounded border border-gray-600"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-white p-1 rounded">
                          <img 
                            src={`https://img.shields.io/badge/${badge.label}-${badge.message}?${badge.logo ? `logo=${badge.logo}&` : ''}style=flat-square&color=${badge.color}&logoColor=white`}
                            alt={badge.name}
                            className="h-6"
                          />
                        </div>
                        <span className="text-gray-300 text-sm">{badge.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Label</label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    placeholder="Badge label"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Message</label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    placeholder="Badge message"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                      placeholder="Hex color (e.g., 007ACC)"
                    />
                    <input
                      type="color"
                      value={`#${color}`}
                      onChange={(e) => setColor(e.target.value.substring(1))}
                      className="w-12 h-10 border rounded bg-gray-800 border-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Logo</label>
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    placeholder="Logo name (e.g., typescript)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    See{' '}
                    <a 
                      href="https://simpleicons.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Simple Icons
                    </a>{' '}
                    for available logos
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
                  >
                    <option value="flat">Flat</option>
                    <option value="flat-square">Flat Square</option>
                    <option value="plastic">Plastic</option>
                    <option value="for-the-badge">For the Badge</option>
                    <option value="social">Social</option>
                  </select>
                </div>
              </>
            )}
          </div>
          
          {/* Right Column - Preview and Actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Preview</label>
              <div className="bg-gray-800 p-4 rounded border border-gray-600 min-h-32 flex items-center justify-center">
                <div className="bg-white p-2 rounded" dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Markdown</label>
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <code className="text-gray-300 text-sm break-all">
                  {generateMarkdown()}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className="mt-2 flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 text-sm text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleInsert}
                className="px-4 py-2 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 text-sm"
              >
                Insert Badge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;