import React from 'react';
import { X, Award, Printer, CheckCircle2, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { UserCertificate } from '../../types';
import { BrandLogo, APP_LOGO_SRC } from '../brand/Logo';

interface CertificateModalProps {
  certificate: UserCertificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issuedDate).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-[36px] shadow-2xl border-4 border-[#2D5A27] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="px-6 py-3 bg-[#FAF7EE] border-b border-[#DFEBDC] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D1A]">
            <Award className="w-4 h-4 text-[#D9825B]" />
            <span>Constancia Oficial de Aprobación</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D5A27] hover:bg-[#23481E] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Diploma Design) */}
        <div className="p-8 sm:p-12 text-center relative bg-gradient-to-b from-[#FFFDF8] via-[#FAF7EE] to-[#FFFDF8] border-8 border-double border-[#DFEBDC] m-3 sm:m-6 rounded-[28px]">
          
          {/* Watermark Leaf & Woman Logo in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src={APP_LOGO_SRC} alt="" className="w-72 h-72 object-contain opacity-[0.06] select-none" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Header Emblem */}
            <BrandLogo variant="compact" size="lg" className="mb-3" />

            <span className="text-[11px] uppercase tracking-widest font-bold text-[#8D5B4C] block mb-1">
              Programa de Fortalecimiento a Emprendimientos Femeninos
            </span>

            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#1F3D1B] tracking-tight mb-1">
              Mujer Emprendedora
            </h2>
            <p className="text-xs text-[#3A5C33] font-serif italic mb-6">
              Palmira, Valle del Cauca • Colombia
            </p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#2D5A27] to-transparent mb-6" />

            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block mb-2">
              Otorga la presente constancia de aprobación a:
            </span>

            <h3 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 border-b-2 border-[#BED6B8] pb-1 px-4 mb-2">
              {certificate.userName}
            </h3>

            <p className="text-xs font-bold text-[#8D5B4C] mb-6 flex items-center gap-1.5">
              <span>{certificate.businessName}</span>
              <span>•</span>
              <span className="text-slate-600 font-normal">{certificate.location}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed mb-6">
              Por haber completado satisfactoriamente todas las lecciones pedagógicas, actividades prácticas y evaluación del módulo formativo:
            </p>

            {/* Module Name Box */}
            <div className="bg-[#EAF4E8] border border-[#BED6B8] py-3 px-6 rounded-2xl mb-8 max-w-lg w-full">
              <span className="font-serif font-black text-base sm:text-lg text-[#1F3D1B] block">
                {certificate.moduleTitle}
              </span>
              <span className="text-[11px] font-bold text-[#2D5A27] mt-0.5 block">
                Calificación Obtenida: {certificate.scorePercent}% • Aprobado con Distinción
              </span>
            </div>

            {/* Signatures & Verification */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-md pt-4 border-t border-[#DFEBDC] text-center text-xs">
              <div>
                <div className="font-serif font-bold text-slate-800 text-sm italic mb-1">
                  Coordinación Rural
                </div>
                <div className="w-32 h-0.5 bg-slate-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">
                  Programa Mujer Emprendedora
                </span>
                <span className="text-[10px] text-slate-400">Palmira, Valle</span>
              </div>

              <div>
                <div className="font-serif font-bold text-slate-800 text-sm mb-1">
                  {formattedDate}
                </div>
                <div className="w-32 h-0.5 bg-slate-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">
                  Fecha de Emisión
                </span>
                <span className="font-mono text-[9px] text-[#7E56A0] font-bold block">
                  Cód: {certificate.verificationCode}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
