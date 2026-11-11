import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#080B14]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#151D30] border border-[#725CFF]/35 rounded-3xl p-5 shadow-[0_0_50px_rgba(114,92,255,0.2)] max-h-[90vh] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#725CFF]/15">
          {title && (
            <h2 className="font-display font-bold text-base tracking-wider uppercase text-[#F5F7FF]">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#101626] text-[#929DB5] hover:text-[#F5F7FF] border border-[#725CFF]/20 active:scale-90 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

