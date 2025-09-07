import React, { useState } from 'react';


interface EmojiPickerProps {
  onInsert: (emoji: string) => void;
  onClose: () => void;
}

const emojiCategories = {
  faces: [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
    '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛',
    '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮',
    '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝',
    '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁',
    '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩',
    '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴'
  ],
  gestures: [
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙',
    '💪', '🦾', '✍️', '🙏', '🦶', '🦵', '👂', '🦻', '👃',
    '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓',
    '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇'
  ],
  hearts: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '💋', '💌', '💐', '🌹', '🌺', '🌻', '🌷', '🌸', '💮', '🏵️'
  ],
  symbols: [
    '✅', '❌', '⭐', '🌟', '💫', '⚡', '🔥', '💥', '💢', '💯',
    '🚀', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🎰',
    '🔔', '🔕', '📢', '📣', '📯', '🔈', '🔉', '🔊', '📻', '🎵',
    '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵'
  ],
  activities: [
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
    '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹',
    '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿'
  ],
  nature: [
    '🌱', '🌿', '🍀', '🍃', '🌳', '🌲', '🌴', '🌵', '🌾', '🌻',
    '🌺', '🌸', '🌼', '🌷', '🥀', '🌹', '🌵', '🍄', '🌰', '🌊',
    '🔥', '❄️', '⭐', '🌟', '💫', '☀️', '🌙', '🌛', '🌜', '🌞'
  ]
} as const;

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onInsert, onClose }) => {
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState<keyof typeof emojiCategories>('faces');

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 bg-opacity-90 rounded-lg border border-gray-700 p-4 w-96 max-w-full max-h-[80vh] overflow-hidden backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Emoji Picker</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="flex space-x-1 mb-3 border-b border-gray-700 pb-2">
            {Object.keys(emojiCategories).map(category => (
              <button
                key={category}
                onClick={() => setSelectedEmojiCategory(category as keyof typeof emojiCategories)}
                className={`px-2 py-1 rounded text-xs ${
                  selectedEmojiCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1">
            {emojiCategories[selectedEmojiCategory].map((emoji: string, index: number) => (
              <button
                key={index}
                onClick={() => {
                  onInsert(emoji);
                  onClose();
                }}
                className="p-2 rounded hover:bg-gray-700 text-xl transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;