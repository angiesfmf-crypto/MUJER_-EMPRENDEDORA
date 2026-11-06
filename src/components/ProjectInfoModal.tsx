import React from 'react';
import { X, Award, MapPin, ShieldCheck, Database, Smartphone, CheckCircle, HeartHandshake } from 'lucide-react';
import { BrandLogo } from './brand/Logo';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAndroidCode: () => void;
  onExportZip: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  isOpen,
  onClose,
  onOpenAndroidCode,
  onExportZip
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-[36px] shadow-2xl flex flex-col border-2 border-[#DFEBDC] overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-6 bg-gradient-to-br from-[#2D5A27] via-[#366E3A] to-[#7E56A0] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#D4EDCE] text-xs font-bold border border-white/20 mb-3 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Proyecto Académico de Innovación Social</span>
          </div>

          <BrandLogo variant="horizontal" size="lg" light className="mb-2" />

          <p className="text-sm sm:text-base text-[#E5F3E2] italic font-serif leading-relaxed mt-2">
            "Impulsando el crecimiento de los emprendimientos rurales mediante herramientas digitales accesibles"
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* Location & Territory */}
          <div className="p-4 rounded-3xl bg-[#FAF7EE] border border-[#DFEBDC] flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] shrink-0 border border-[#BED6B8]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-black text-[#1F3D1B] text-sm sm:text-base mb-1">
                Territorio de Impacto: Municipio de Palmira, Valle del Cauca
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                Esta iniciativa fortalece a las mujeres campesinas y artesanas de las veredas y corregimientos de <strong>La Quisquina, Rozo, El Bolo, Tienda Nueva, Potrerillo, Combia, Guanabanal y La Torre</strong>, reduciendo la brecha digital con herramientas adaptadas a la realidad del campo.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-3xl border border-[#DFEBDC] bg-[#FFFDF8] shadow-2xs">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center font-bold mb-2">
                <Database className="w-4 h-4" />
              </div>
              <h5 className="font-serif font-black text-slate-900 mb-1">Arquitectura Offline-First</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                En zonas montañosas de Palmira la señal suele ser inestable. Por eso la aplicación usa <strong>Room SQLite</strong> como almacenamiento local principal y encola cambios con <strong>WorkManager</strong> para sincronizar con Cloud Firestore al llegar al pueblo.
              </p>
            </div>

            <div className="p-4 rounded-3xl border border-[#DFEBDC] bg-[#FFFDF8] shadow-2xs">
              <div className="w-9 h-9 rounded-2xl bg-[#F0E8F5] text-[#7E56A0] flex items-center justify-center font-bold mb-2">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h5 className="font-serif font-black text-slate-900 mb-1">Diseño Humano y Accesible</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Espacios amplios, contrastes altos, tipografía legible y botones grandes para facilitar el uso a señoras y productoras rurales sin experiencia previa en tecnología.
              </p>
            </div>
          </div>

          {/* Module checklist */}
          <div className="p-4 rounded-3xl bg-[#FAF7EE] border border-[#DFEBDC]">
            <h4 className="font-serif font-black text-[#1F3D1B] text-sm mb-2">
              Funcionalidades Operativas:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>Inventario de Productos:</strong> Control de existencias y alertas de bajo stock para nunca quedarse sin producto en ferias.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>Ventas y Cobros:</strong> Cálculo automático en pesos ($ COP) y descuento inmediato de inventario impidiendo vender lo que no hay.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>Cuentas Claras:</strong> Reportes de ganancias, compras promedio y productos favoritos de las clientas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>Escuela TIC Rural:</strong> 5 módulos con consejos sobre Nequi, WhatsApp y fotos de productos con celular.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#FAF7EE] border-t border-[#DFEBDC] flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenAndroidCode();
            }}
            className="text-xs font-bold text-[#2D5A27] hover:underline cursor-pointer"
          >
            Explorar Código Fuente Android (Kotlin)
          </button>
          <button
            onClick={() => {
              onClose();
              onExportZip();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#366E3A] hover:from-[#23481E] hover:to-[#2D5A27] text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Descargar Proyecto Android Studio (.zip)
          </button>
        </div>

      </div>
    </div>
  );
};
