import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'badge' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  light?: boolean;
}

export const APP_LOGO_SRC = '/assets/images/logo_mujer_emprendedora_transparent.png';
export const APP_LOGO_WHITE_SRC = '/assets/images/logo_mujer_emprendedora_white.png';

export const BrandLogo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  light = false
}) => {
  // Dimension definitions for icon container
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-36 h-36 sm:w-48 sm:h-48'
  }[size];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  }[size];

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm'
  }[size];

  // Authentic transparent brand emblem image
  const LogoImage = (
    <div
      className={`relative ${iconDimensions} rounded-2xl bg-white/90 p-1 border border-[#2D5A27]/20 shadow-2xs overflow-hidden shrink-0 flex items-center justify-center group`}
    >
      <img
        src={APP_LOGO_SRC}
        alt="Logotipo Mujer Emprendedora"
        className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
      />
    </div>
  );

  // Compact / Icon variant (for mobile icons, small badges and modal headers)
  if (variant === 'compact' || variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoImage}
      </div>
    );
  }

  // Badge variant (Vertical presentation with transparent/white background, ideal for Welcome Hero)
  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative mb-3 p-2 rounded-[36px] bg-gradient-to-b from-[#2D5A27]/5 via-[#FAF7EE] to-[#2D5A27]/10 border-2 border-[#2D5A27]/20 shadow-xl shadow-[#2D5A27]/10">
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-[28px] bg-white/95 overflow-hidden shadow-inner flex items-center justify-center p-2.5">
            <img
              src={APP_LOGO_SRC}
              alt="Logotipo Oficial Mujer Emprendedora"
              className="w-full h-full object-contain object-center drop-shadow-sm"
            />
          </div>
        </div>
        <h1
          className={`font-serif font-black tracking-tight ${textSizes} ${
            light ? 'text-white' : 'text-[#1F3D1B]'
          }`}
        >
          Mujer Emprendedora
        </h1>
        <span
          className={`font-sans tracking-wide uppercase font-semibold ${subtitleSizes} ${
            light ? 'text-[#D4EDCE]' : 'text-[#8D5B4C]'
          } mt-0.5`}
        >
          Palmira, Valle del Cauca • Colombia
        </span>
      </div>
    );
  }

  // Horizontal variant (Emblem + Typography, ideal for Navbar, Header and Modals)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoImage}
      <div className="flex flex-col leading-tight">
        <span
          className={`font-serif font-black tracking-tight ${textSizes} ${
            light ? 'text-white' : 'text-[#1F3D1B]'
          }`}
        >
          Mujer Emprendedora
        </span>
        <span
          className={`font-sans font-medium ${subtitleSizes} ${
            light ? 'text-[#D4EDCE]' : 'text-[#7D5344]'
          }`}
        >
          Herramientas Digitales para el Campo • Palmira
        </span>
      </div>
    </div>
  );
};
