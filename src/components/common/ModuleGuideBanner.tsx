import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';

interface ModuleGuideBannerProps {
  title: string;
  description: string;
  tips?: string[];
  moduleKey: string;
}

export const ModuleGuideBanner: React.FC<ModuleGuideBannerProps> = ({
  title,
  description,
  tips = [],
  moduleKey
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(`guide_dismissed_${moduleKey}`) === 'true';
  });

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(`guide_dismissed_${moduleKey}`, 'true');
  };

  return (
    <div className="mb-4 bg-gradient-to-r from-[#FAF6ED] to-[#F1F7EE] border border-[#D7E8D3] rounded-3xl p-3.5 sm:p-4 text-xs text-[#2A4425] shadow-2xs transition-all">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="w-8 h-8 rounded-2xl bg-[#E2EFE0] text-[#2F6126] flex items-center justify-center shrink-0 mt-0.5 border border-[#C5DEC1]">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#1E3A1A]">{title}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5D7F0] text-[#5C3B78]">
                Consejo del Campo
              </span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {description}
            </p>

            {isOpen && tips.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 pl-1 border-t border-[#DFEBDC] pt-2">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#366E3A] mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {tips.length > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl hover:bg-[#E5F0E2] text-slate-500 transition-colors"
              title={isOpen ? 'Contraer consejos' : 'Ver más consejos'}
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl hover:bg-[#E5F0E2] text-slate-400 hover:text-slate-700 transition-colors"
            title="Entendido, no volver a mostrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
