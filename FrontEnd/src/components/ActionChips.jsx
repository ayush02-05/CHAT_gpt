
import React from 'react';

const chips = [
  { icon: 'code', label: 'Write code', color: 'text-purple-400', hover: 'group-hover:text-purple-300' },
  { icon: 'image', label: 'Generate image', color: 'text-green-400', hover: 'group-hover:text-green-300' },
  { icon: 'movie', label: 'Generate video', color: 'text-red-400', hover: 'group-hover:text-red-300' },
  { icon: 'auto_fix_high', label: 'Modify image', color: 'text-yellow-400', hover: 'group-hover:text-yellow-300' },
  { icon: 'high_quality', label: 'Upscale video', color: 'text-blue-400', hover: 'group-hover:text-blue-300' },
];

export default function ActionChips() {
  return (
    <div className="flex flex-wrap justify-center gap-3 w-full mt-2">
      {chips.map((chip, idx) => (
        <button 
          key={idx} 
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#151515] hover:bg-[#202020] border border-white/5 hover:border-white/20 transition-all group"
        >
          <span className={`material-symbols-outlined text-[18px] ${chip.color} ${chip.hover}`}>
            {chip.icon}
          </span>
          <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
            {chip.label}
          </span>
        </button>
      ))}
      <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#151515] hover:bg-[#202020] border border-white/5 hover:border-white/20 transition-all group">
        <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-white">more_horiz</span>
      </button>
    </div>
  );
}
