import React from 'react';

interface OfficialToolLogoProps {
  toolId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OfficialToolLogo: React.FC<OfficialToolLogoProps> = ({
  toolId,
  size = 'md',
  className = ''
}) => {
  const containerSize = {
    sm: 'w-9 h-9',
    md: 'w-13 h-13',
    lg: 'w-16 h-16'
  }[size];

  switch (toolId) {
    // ========================================================
    // 1. CANVA - Logotipo Oficial
    // Círculo con gradiente oficial cian a púrpura real (#00C4CC -> #7D2AE8)
    // con la tipografía oficial fluida "Canva" en blanco
    // ========================================================
    case 'tool-canva':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-2 shadow-xs shrink-0 select-none overflow-hidden bg-gradient-to-tr from-[#00C4CC] via-[#5B34EA] to-[#7D2AE8]`}
          title="Logotipo oficial de Canva"
          aria-label="Canva"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(4, 18) scale(0.92)">
              {/* Canva Signature Script Wordmark */}
              <path
                d="M17.5 45.2c-7.2 0-12.8-5.1-12.8-14.2 0-10.7 7.9-19 18.5-19 6.8 0 11.4 3.6 12.6 8.1l-6.2 2.6c-1-3-3.5-5-6.5-5-6.5 0-11 5.7-11 13.2 0 5.9 3.4 9 7.9 9 3.9 0 7-2.1 8.5-4.6l5.4 3.6c-2.6 4-8.1 6.3-16.4 6.3zm28-.3l-1.5-3.9c-1.9 2.6-5 4.3-8.5 4.3-5.6 0-9.1-3.9-9.1-8.6 0-6 5.3-9.1 12.9-9.1h5.8v-1.7c0-3.3-2.4-5.2-6.3-5.2-3.1 0-5.9 1.4-7 3.4l-5.1-3c2.1-3.6 6.9-5.9 12.3-5.9 7.9 0 12.1 4 12.1 10.4v19.3h-5.6zm-5.9-5.1c3.5 0 6-2.1 6-5v-2.9h-5.1c-4.5 0-7.1 1.5-7.1 4.4 0 2.2 1.8 3.5 6.2 3.5zm21.1 5.1v-18.5c1.6-1.8 4.3-2.8 6.9-2.8 4.6 0 7.1 2.8 7.1 8v13.3h6V25.3c0-7.6-4.5-12-11.4-12-4 0-7.6 1.8-9.8 4.8v-4.3h-4.8v25.6h6zm26.6 0l7.9-24.8h-6.1l-5.1 17.9-5.3-17.9h-6.1l8.1 24.8h6.6z"
                fill="#FFFFFF"
              />
            </g>
          </svg>
        </div>
      );

    // ========================================================
    // 2. ADOBE EXPRESS - Logotipo Oficial
    // Esquinas redondeadas con gradiente oficial rojo-coral-púrpura (#EB1000 - #9C007E)
    // con el monograma oficial de la marca "Ae"
    // ========================================================
    case 'tool-adobe-express':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-1.5 shadow-xs shrink-0 select-none overflow-hidden bg-[#FFFFFF] border border-[#E5E7EB]`}
          title="Logotipo oficial de Adobe Express"
          aria-label="Adobe Express"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="adobe_express_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EB1000" />
                <stop offset="50%" stopColor="#FF5A00" />
                <stop offset="100%" stopColor="#A00085" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="22" fill="url(#adobe_express_grad)" />
            {/* Adobe Express official letters "Ae" */}
            <text
              x="50"
              y="66"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="900"
              fontSize="44"
              letterSpacing="-2"
            >
              Ae
            </text>
          </svg>
        </div>
      );

    // ========================================================
    // 3. WHATSAPP BUSINESS - Logotipo Oficial
    // Globo de diálogo en verde WhatsApp (#25D366) con la "B" oficial mayúscula
    // que identifica universalmente la cuenta comercial de WhatsApp
    // ========================================================
    case 'tool-whatsapp-business':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-1.5 shadow-xs shrink-0 select-none overflow-hidden bg-[#25D366]`}
          title="Logotipo oficial de WhatsApp Business"
          aria-label="WhatsApp Business"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chat bubble tail and circle */}
            <path
              d="M50 12C29 12 12 29 12 50c0 7.4 2.1 14.3 5.8 20.2L12 88l18.4-4.8C36 86.4 42.8 88 50 88c21 0 38-17 38-38S71 12 50 12z"
              fill="#25D366"
            />
            {/* Outer subtle shadow or border definition */}
            <path
              d="M50 14c20 0 36 16 36 36S70 86 50 86c-6.8 0-13.3-1.9-18.9-5.1l-1.4-.8-11.2 2.9 3-10.9-.9-1.4C16.9 65.1 15 58.7 15 50c0-20 16-36 35-36z"
              fill="#25D366"
            />
            {/* Official Bold White "B" of WhatsApp Business */}
            <path
              d="M38 31h13.8c6.1 0 10.3 1.5 12.7 4.2 2.1 2.3 3.3 5.5 3.3 9.4 0 3.7-1.2 6.6-3.4 8.8-1.3 1.3-3.1 2.2-5.4 2.8 3.2.6 5.6 2 7.2 4 1.9 2.4 2.8 5.7 2.8 9.7 0 4.5-1.4 8.2-4.1 10.8-2.7 2.6-7.3 4-13.8 4H38V31zm9.8 21h5c2.9 0 5-.6 6.3-1.9 1.3-1.3 1.9-3 1.9-5.3s-.6-4.2-1.9-5.3c-1.3-1.2-3.4-1.8-6.3-1.8h-5v14.3zm0 25.1h5.9c3.4 0 5.9-.7 7.4-2.1s2.2-3.4 2.2-6.1c0-2.5-.7-4.5-2.2-5.9-1.5-1.4-4-2.1-7.4-2.1h-5.9v16.2z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );

    // ========================================================
    // 4. GOOGLE DRIVE - Logotipo Oficial
    // Triángulo tricolor geométrico oficial (#FFBA00 Amarillo, #00AC47 Verde, #0066DA Azul)
    // con proporciones vectoriales oficiales de Google Workspace
    // ========================================================
    case 'tool-google-drive':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-2 bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs shrink-0 select-none overflow-hidden`}
          title="Logotipo oficial de Google Drive"
          aria-label="Google Drive"
        >
          <svg viewBox="0 0 88 78" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Blue base and left corner */}
            <path
              d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
              fill="#0066DA"
            />
            {/* Green left diagonal */}
            <path
              d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
              fill="#00AC47"
            />
            {/* Red bottom accent */}
            <path
              d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l9.25-16c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 11.5z"
              fill="#EA4335"
            />
            {/* Dark green apex shadow */}
            <path
              d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
              fill="#00832D"
            />
            {/* Blue bottom horizontal bar */}
            <path
              d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
              fill="#2684FC"
            />
            {/* Yellow top diagonal */}
            <path
              d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
              fill="#FFBA00"
            />
          </svg>
        </div>
      );

    // ========================================================
    // 5. GOOGLE SHEETS - Logotipo Oficial
    // Hoja verde esmeralda (#0F9D58) con esquina superior plegada (#87CEAB)
    // y cuadrícula blanca de hoja de cálculo
    // ========================================================
    case 'tool-google-sheets':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-2 bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs shrink-0 select-none overflow-hidden`}
          title="Logotipo oficial de Google Sheets"
          aria-label="Google Sheets"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Document sheet body */}
            <path
              d="M24 10h38l22 22v56a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z"
              fill="#0F9D58"
            />
            {/* Folded top-right flap */}
            <path d="M62 10l22 22H66a4 4 0 0 1-4-4V10z" fill="#87CEAB" />
            {/* White Spreadsheet Grid Container */}
            <rect x="32" y="44" width="36" height="28" rx="2.5" fill="#FFFFFF" />
            {/* Grid inner dividers in Sheets green */}
            <line x1="50" y1="44" x2="50" y2="72" stroke="#0F9D58" strokeWidth="2.5" />
            <line x1="32" y1="53" x2="68" y2="53" stroke="#0F9D58" strokeWidth="2" />
            <line x1="32" y1="62" x2="68" y2="62" stroke="#0F9D58" strokeWidth="2" />
          </svg>
        </div>
      );

    // ========================================================
    // 6. GOOGLE FORMS - Logotipo Oficial
    // Hoja púrpura Google Workspace (#7248B9) con esquina superior plegada (#B39DDB)
    // y líneas con casillas de formulario de encuesta
    // ========================================================
    case 'tool-google-forms':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-2 bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs shrink-0 select-none overflow-hidden`}
          title="Logotipo oficial de Google Forms"
          aria-label="Google Forms"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Document sheet body */}
            <path
              d="M24 10h38l22 22v56a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z"
              fill="#7248B9"
            />
            {/* Folded top-right flap */}
            <path d="M62 10l22 22H66a4 4 0 0 1-4-4V10z" fill="#B39DDB" />
            {/* Checklist item 1 */}
            <rect x="32" y="44" width="7" height="7" rx="1.5" fill="#FFFFFF" />
            <rect x="43" y="45.5" width="25" height="4" rx="2" fill="#FFFFFF" />
            {/* Checklist item 2 */}
            <rect x="32" y="55" width="7" height="7" rx="1.5" fill="#FFFFFF" />
            <rect x="43" y="56.5" width="25" height="4" rx="2" fill="#FFFFFF" />
            {/* Checklist item 3 */}
            <rect x="32" y="66" width="7" height="7" rx="1.5" fill="#FFFFFF" />
            <rect x="43" y="67.5" width="18" height="4" rx="2" fill="#FFFFFF" />
          </svg>
        </div>
      );

    // ========================================================
    // 7. META BUSINESS SUITE - Logotipo Oficial
    // Símbolo infinito geométrico oficial de Meta en degradado azul Meta (#0081FB - #0064E0)
    // ========================================================
    case 'tool-meta-business':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-2 bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs shrink-0 select-none overflow-hidden`}
          title="Logotipo oficial de Meta Business Suite"
          aria-label="Meta Business Suite"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="meta_loop_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0064E0" />
                <stop offset="100%" stopColor="#0081FB" />
              </linearGradient>
            </defs>
            <path
              d="M26.4 66.5c-5 0-9.4-2.1-12.7-5.9-3.5-4-5.1-9.5-4.5-15.3.8-7.9 5.8-14.4 13-17.1 4.3-1.5 8.9-1.7 13.3-.3 4.3 1.3 8 4.1 10.9 7.8 1.7 2.2 3.3 4.7 4.9 7.1 1.6-2.4 3.1-4.8 4.9-7.1 2.9-3.7 6.6-6.5 10.9-7.8 4.4-1.4 9-1.2 13.3.3 7.2 2.7 12.2 9.2 13 17.1.6 5.8-1 11.3-4.5 15.3-3.3 3.8-7.7 5.9-12.7 5.9-5.4 0-10.7-2.7-14.4-7.3-3.4-4.3-6.6-9.8-10.5-15.2-3.8 5.3-7.1 10.9-10.5 15.2-3.7 4.7-9 7.4-14.4 7.4zm-3.3-9.2c2.4 0 4.7-1.2 6.5-3.4 3-3.8 5.8-8.5 8.9-13.1-1.3-1.8-2.7-3.5-4.2-4.9-2.2-2-4.8-3.2-7.7-3.3-4.2-.1-8 2.3-9.6 6.1-1.5 3.6-.8 7.8 1.7 10.8 1.1 1.2 2.7 1.8 4.4 1.8zm53.8 0c1.7 0 3.3-.6 4.4-1.8 2.5-3 3.2-7.2 1.7-10.8-1.6-3.8-5.4-6.2-9.6-6.1-2.9.1-5.5 1.3-7.7 3.3-1.5 1.4-2.9 3.1-4.2 4.9 3.1 4.6 5.9 9.3 8.9 13.1 1.8 2.2 4.1 3.4 6.5 3.4z"
              fill="url(#meta_loop_grad)"
            />
          </svg>
        </div>
      );

    // ========================================================
    // 8. NEQUI COLOMBIA - Logotipo Oficial
    // Ícono oficial morado oscuro ciruela (#200020) con el nombre estilizado
    // y el punto superior magenta neón (#FF0077) de Nequi Bancolombia
    // ========================================================
    case 'tool-nequi':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-1.5 shadow-xs shrink-0 select-none overflow-hidden bg-[#200020]`}
          title="Logotipo oficial de Nequi Colombia"
          aria-label="Nequi Colombia"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="22" fill="#200020" />
            {/* Signature "nequi" wordmark with exact brand styling */}
            <g transform="translate(14, 26)">
              <text
                x="30"
                y="36"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="900"
                fontSize="25"
                letterSpacing="-0.5"
              >
                nequi
              </text>
              {/* Vibrant Magenta Dot and underline accent */}
              <circle cx="65" cy="18" r="4.8" fill="#FF0077" />
              <rect x="4" y="42" width="64" height="4.5" rx="2.2" fill="#FF0077" />
            </g>
          </svg>
        </div>
      );

    // ========================================================
    // 9. DAVIPLATA - Logotipo Oficial
    // Fondo rojo Davivienda (#ED1C24) con la moneda amarilla (#FFCC00)
    // la sonrisa arqueada característica y la marca tipográfica "daviplata"
    // ========================================================
    case 'tool-daviplata':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-1.5 shadow-xs shrink-0 select-none overflow-hidden bg-[#ED1C24]`}
          title="Logotipo oficial de Daviplata"
          aria-label="Daviplata"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="22" fill="#ED1C24" />
            {/* Daviplata yellow central emblem */}
            <circle cx="50" cy="38" r="19" fill="#FFCC00" />
            {/* Playful smile / curve */}
            <path
              d="M36 38c0 7.7 6.3 14 14 14s14-6.3 14-14"
              stroke="#ED1C24"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* White lowercase "daviplata" */}
            <text
              x="50"
              y="76"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="14.5"
              letterSpacing="-0.6"
            >
              daviplata
            </text>
          </svg>
        </div>
      );

    // ========================================================
    // 10. CAPCUT - Logotipo Oficial
    // Fondo negro (#000000) con las dos cintas geométricas blancas superpuestas
    // en forma de reloj de arena / corte de película
    // ========================================================
    case 'tool-capcut':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-1.5 shadow-xs shrink-0 select-none overflow-hidden bg-[#000000]`}
          title="Logotipo oficial de CapCut"
          aria-label="CapCut"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="22" fill="#000000" />
            {/* CapCut overlapping white ribbons */}
            <path
              d="M26 23h48l-14 26H12l14-26z"
              fill="#FFFFFF"
            />
            <path
              d="M26 77h48l14-26H40l-14 26z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );

    // ========================================================
    // 11. GOOGLE MAPS / PERFIL DE NEGOCIO - Logotipo Oficial
    // Pin oficial de Google Maps con los 4 colores primarios
    // (#EA4335 Rojo, #4285F4 Azul, #34A853 Verde, #FBBC04 Amarillo)
    // ========================================================
    case 'tool-google-maps-business':
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center p-2 bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs shrink-0 select-none overflow-hidden`}
          title="Logotipo oficial de Google Maps / Perfil de Negocio"
          aria-label="Google Maps"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Red Pin Header */}
            <path
              d="M50 14c-15.5 0-28 12.5-28 28 0 16.5 16 35 28 44 12-9 28-27.5 28-44 0-15.5-12.5-28-28-28z"
              fill="#EA4335"
            />
            {/* Green Bottom Section */}
            <path
              d="M50 86c-4.5-3.5-10.5-9.5-15.5-16.5l15.5 16.5z"
              fill="#34A853"
            />
            {/* Blue and Yellow side facets */}
            <path
              d="M50 14c-15.5 0-28 12.5-28 28 0 8.5 4.5 17.5 11 25.5l17-25.5V14z"
              fill="#4285F4"
              opacity="0.25"
            />
            {/* White Center Hole */}
            <circle cx="50" cy="42" r="11" fill="#FFFFFF" />
            {/* Inner Red Core */}
            <circle cx="50" cy="42" r="6" fill="#EA4335" />
          </svg>
        </div>
      );

    // Clean typography fallback if toolId is unrecognized
    default:
      return (
        <div
          className={`${containerSize} ${className} rounded-2xl flex items-center justify-center bg-[#FAF7EE] border border-[#DFEBDC] text-[#2D5A27] font-bold text-xs select-none`}
        >
          APP
        </div>
      );
  }
};
