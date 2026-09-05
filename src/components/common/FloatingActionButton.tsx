import React from 'react';
import { Camera } from 'lucide-react';
import { createRipple } from './MaterialRipple';

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  hasRightPanel?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  label = 'Report Issue',
  hasRightPanel = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e, 'rgba(255, 255, 255, 0.4)');
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 z-20 bg-[#4285F4] hover:bg-[#1A73E8] text-white h-14 px-4 sm:px-5 rounded-full shadow-elevation-6 hover:shadow-elevation-8 active:scale-98 transition-all flex items-center space-x-2.5 ripple-surface group focus:outline-none focus:ring-4 focus:ring-[#4285F4]/40 ${
        hasRightPanel ? 'right-6 lg:right-[440px] xl:right-[480px]' : 'right-6'
      }`}
      aria-label={label}
      title={label}
    >
      <Camera className="w-6 h-6 stroke-[2.2] shrink-0" />
      <span className="font-medium text-sm tracking-wider uppercase hidden sm:inline-block">
        {label}
      </span>
      <span className="bg-[#FBBC05] text-[#202124] text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ml-1 hidden md:inline-block">
        +25 XP
      </span>
    </button>
  );
};

export default FloatingActionButton;
