import React, { useState, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface SwipeToPaySliderProps {
  onConfirm: () => void;
  label?: string;
}

export const SwipeToPaySlider: React.FC<SwipeToPaySliderProps> = ({
  onConfirm,
  label = 'SWIPE RIGHT TO PAY',
}) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxDrag = containerRef.current ? containerRef.current.clientWidth - 56 : 240;

  const handleStart = () => {
    if (completed) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || completed || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(clientX - rect.left - 28, maxDrag));
    setDragX(newX);

    if (newX >= maxDrag - 10) {
      setCompleted(true);
      setIsDragging(false);
      setDragX(maxDrag);
      onConfirm();
    }
  };

  const handleEnd = () => {
    if (!completed) {
      setIsDragging(false);
      setDragX(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      className={`relative h-14 w-full rounded-2xl p-1 overflow-hidden select-none transition-colors border shadow-inner flex items-center ${
        completed ? 'bg-[#2E9E5B] border-[#2E9E5B]' : 'bg-[#1B4B66] border-[#1B4B66]'
      }`}
    >
      <div
        className="absolute top-0 left-0 bottom-0 bg-[#1F8A5F]/60 transition-all"
        style={{ width: `${dragX + 56}px` }}
      />

      <div className="absolute inset-0 flex items-center justify-center font-['Sora'] font-extrabold text-xs tracking-widest uppercase pointer-events-none z-0">
        {completed ? (
          <span className="flex items-center gap-2 text-white animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>PAYMENT APPROVED!</span>
          </span>
        ) : (
          <span className="text-white font-extrabold tracking-widest drop-shadow">{label}</span>
        )}
      </div>

      <div
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg transition-transform ${
          completed
            ? 'bg-white text-[#2E9E5B]'
            : 'bg-[#D4A62A] text-[#1E2732] font-bold shadow-md hover:scale-105'
        }`}
        style={{
          transform: completed ? `translateX(${maxDrag}px)` : `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
      >
        {completed ? (
          <CheckCircle2 className="w-6 h-6 text-[#2E9E5B]" />
        ) : (
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        )}
      </div>
    </div>
  );
};
