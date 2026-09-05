import React from 'react';
import { Camera } from 'lucide-react';
import { createRipple } from './MaterialRipple';

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  label = 'Report Issue',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e, 'rgba(255, 255, 255, 0.4)');
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 bg-[#2E7D32] hover:bg-[#1B5E20] text-white h-14 px-4 sm:px-5 rounded-full shadow-elevation-6 hover:shadow-elevation-8 active:scale-98 transition-all flex items-center space-x-2.5 ripple-surface group focus:outline-none focus:ring-4 focus:ring-[#81C784]/50"
      aria-label={label}
      title={label}
    >
      <Camera className="w-6 h-6 stroke-[2.2] shrink-0" />
      <span className="font-medium text-sm tracking-wider uppercase hidden sm:inline-block">
        {label}
      </span>
      <span className="bg-[#FBC02D] text-[#212121] text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ml-1 hidden md:inline-block">
        +25 XP
      </span>
    </button>
  );
};

export default FloatingActionButton;
