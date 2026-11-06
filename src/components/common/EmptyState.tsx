import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  illustrationType?: 'inventory' | 'sales' | 'history' | 'search';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  illustrationType = 'inventory'
}) => {
  return (
    <div className="py-10 px-4 text-center bg-gradient-to-b from-[#FFFDF9] to-[#FAF6ED] rounded-3xl border-2 border-dashed border-[#DFEBDC] my-4 max-w-lg mx-auto">
      
      {/* Warm botanical illustration */}
      <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-[#EAF4E8] flex items-center justify-center p-3 text-[#2D5A27] shadow-xs">
        {illustrationType === 'inventory' && (
          <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
            <rect x="12" y="24" width="40" height="30" rx="6" fill="#D7E8D3" stroke="#2D5A27" strokeWidth="2.5" />
            <path d="M8 24L32 14L56 24" stroke="#2D5A27" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 14V54" stroke="#2D5A27" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="24" cy="38" r="4" fill="#C47C56" />
            <circle cx="40" cy="38" r="4" fill="#8E6EA8" />
            <path d="M32 8C32 8 36 4 40 6C40 10 36 12 32 12" fill="#559945" />
          </svg>
        )}

        {illustrationType === 'sales' && (
          <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
            <path d="M16 22H48L44 52H20L16 22Z" fill="#F0E8F5" stroke="#7E56A0" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M24 22V16C24 11.5 27.5 8 32 8C36.5 8 40 11.5 40 16V22" stroke="#7E56A0" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="36" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <path d="M32 33V39" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 20C18 16 22 22 26 18" stroke="#366E3A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {illustrationType === 'history' && (
          <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
            <rect x="16" y="12" width="34" height="42" rx="4" fill="#FFFDF8" stroke="#8D5B4C" strokeWidth="2.5" />
            <line x1="24" y1="22" x2="42" y2="22" stroke="#B25E38" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="30" x2="38" y2="30" stroke="#366E3A" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="38" x2="34" y2="38" stroke="#B25E38" strokeWidth="2" strokeLinecap="round" />
            <path d="M42 42L48 48L44 52L38 46L42 42Z" fill="#7E56A0" />
          </svg>
        )}

        {illustrationType === 'search' && (
          <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
            <circle cx="28" cy="28" r="14" fill="#FFFDF8" stroke="#2D5A27" strokeWidth="2.5" />
            <path d="M38 38L50 50" stroke="#8D5B4C" strokeWidth="3" strokeLinecap="round" />
            <path d="M24 24C26 21 31 22 32 25" stroke="#366E3A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <h4 className="font-serif font-black text-slate-800 text-base mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-4">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#3E7B32] hover:from-[#255020] hover:to-[#34692A] text-white font-bold text-xs shadow-md shadow-[#2D5A27]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>{actionText}</span>
        </button>
      )}

    </div>
  );
};
