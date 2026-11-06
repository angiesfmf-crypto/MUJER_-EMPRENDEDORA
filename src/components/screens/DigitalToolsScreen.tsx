import React, { useState } from 'react';
import {
  Wrench,
  Search,
  ExternalLink,
  CheckCircle2,
  Wifi,
  WifiOff,
  UserCheck
} from 'lucide-react';
import { DIGITAL_TOOLS } from '../../data/digitalToolsData';
import { DigitalTool, ToolCategory, UserProfile } from '../../types';
import { ModuleGuideBanner } from '../common/ModuleGuideBanner';
import { OfficialToolLogo } from '../brand/OfficialToolLogo';

interface DigitalToolsScreenProps {
  currentUser: UserProfile;
}

const CATEGORIES: ToolCategory[] = [
  'Diseño y Publicidad',
  'Comunicación y Clientes',
  'Organización y Archivos',
  'Hojas de Cálculo y Administración',
  'Formularios y Encuestas',
  'Redes Sociales y Marketing',
  'Pagos y Finanzas Rurales',
  'Video y Contenido Móvil'
];

export const DigitalToolsScreen: React.FC<DigitalToolsScreenProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedToolDetails, setSelectedToolDetails] = useState<DigitalTool | null>(null);

  const filteredTools = DIGITAL_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.ruralUtility.toLowerCase().includes(q) ||
      tool.practicalExample.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#FAF7EE] flex flex-col p-3 sm:p-6 max-w-5xl mx-auto w-full">
      
      {/* Onboarding Guide Banner */}
      <ModuleGuideBanner
        moduleKey="digital_tools"
        title="Centro de Herramientas Digitales para el Campo"
        description="Seleccionamos las aplicaciones y plataformas más útiles y confiables para tu negocio rural. Aquí puedes conocer para qué sirve cada una, ver un ejemplo práctico de cómo usarla en Palmira y abrir su página oficial de manera segura."
        tips={[
          'Cada tarjeta muestra el logotipo oficial para que aprendas a reconocer la aplicación real en tu celular o en Google Play Store.',
          'La mayoría son 100% gratuitas o tienen versiones libres muy completas.',
          'No necesitas instalarlas todas: empieza con WhatsApp Business para vender y Nequi para cobrar.'
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center shrink-0 border border-[#BED6B8]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] tracking-tight">
                Herramientas Digitales
              </h2>
              <p className="text-xs text-[#8D5B4C] font-medium">
                Catálogo con logotipos oficiales y enlaces verificados para emprendedoras rurales
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium bg-[#FFFDF8] px-3.5 py-1.5 rounded-2xl border border-[#DFEBDC] self-start sm:self-auto shadow-2xs">
          {filteredTools.length} de {DIGITAL_TOOLS.length} herramientas disponibles
        </span>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, tarea (ej: diseñar etiquetas, cobrar, fotos)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-3 bg-[#FFFDF8] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] shadow-2xs text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'bg-[#FFFDF8] text-slate-600 border border-[#DFEBDC] hover:bg-[#F3EFE6]'
            }`}
          >
            Todas ({DIGITAL_TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = DIGITAL_TOOLS.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'bg-[#FFFDF8] text-slate-600 border border-[#DFEBDC] hover:bg-[#F3EFE6]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 sm:p-6 rounded-[32px] bg-[#FFFDF8] border-2 border-[#DFEBDC] hover:border-[#BED6B8] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Top: Official Logo, Name, Category and Badges */}
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-start gap-3.5">
                  <OfficialToolLogo toolId={tool.id} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-black text-slate-900 text-lg leading-snug">
                        {tool.name}
                      </h3>
                      {tool.popularTag && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4E8] text-[#1E4D1A] border border-[#BED6B8]">
                          {tool.popularTag}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#8D5B4C] mt-0.5 block">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#FAF7EE] text-slate-800 border border-[#DFEBDC] shrink-0">
                  {tool.pricingModel}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-700 mb-3.5 leading-relaxed">
                {tool.description}
              </p>

              {/* Rural Utility Box */}
              <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] text-sm text-slate-800 mb-3.5 space-y-2">
                <div className="font-serif font-bold text-[#1F3D1B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
                  <span className="text-sm">Utilidad para tu Emprendimiento:</span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {tool.ruralUtility}
                </p>
              </div>

              {/* Practical Case Example */}
              <div className="p-4 rounded-2xl bg-[#FAF0E6]/80 border border-[#E8C2AC] text-xs sm:text-sm text-[#78391A] mb-4">
                <span className="font-serif font-bold block mb-1 text-xs uppercase tracking-wider text-[#8D441F]">
                  Ejemplo en el Campo:
                </span>
                <p className="leading-relaxed text-[#8D441F] italic">
                  "{tool.practicalExample}"
                </p>
              </div>
            </div>

            {/* Bottom Actions and Requirements */}
            <div className="pt-3.5 border-t border-[#DFEBDC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              
              <div className="flex items-center gap-3 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  {tool.requiresInternet ? (
                    <>
                      <Wifi className="w-4 h-4 text-[#2D5A27]" />
                      <span>Requiere Internet</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-[#C47C56]" />
                      <span>Funciona sin red</span>
                    </>
                  )}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>{tool.requiresRegistration ? 'Pide registro' : 'Sin registro'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedToolDetails(tool)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] hover:bg-[#EAF4E8] text-[#2D5A27] font-bold text-xs border border-[#DFEBDC] transition-colors cursor-pointer"
                >
                  Ver Consejos
                </button>

                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#366E3A] hover:from-[#23481E] hover:to-[#2D5A27] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Abrir Sitio Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Modal with Tool Tips */}
      {selectedToolDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-[36px] p-6 shadow-2xl border-2 border-[#BED6B8] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DFEBDC] mb-4">
              <div className="flex items-center gap-3">
                <OfficialToolLogo toolId={selectedToolDetails.id} size="md" />
                <div>
                  <h3 className="font-serif font-black text-slate-900 text-lg">
                    {selectedToolDetails.name}
                  </h3>
                  <span className="text-xs text-[#8D5B4C] font-semibold">
                    {selectedToolDetails.category} • {selectedToolDetails.pricingModel}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedToolDetails(null)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 mb-6">
              <div className="p-3.5 bg-[#FAF7EE] rounded-2xl border border-[#DFEBDC]">
                <span className="font-serif font-bold text-[#1F3D1B] block mb-1">
                  ¿Cómo aprovecharla mejor en tu vereda?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedToolDetails.ruralUtility}
                </p>
              </div>

              <div>
                <span className="font-serif font-bold text-slate-900 text-sm block mb-2">
                  Consejos Clave de Uso:
                </span>
                <ul className="space-y-2">
                  {selectedToolDetails.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setSelectedToolDetails(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cerrar
              </button>
              <a
                href={selectedToolDetails.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#366E3A] hover:from-[#23481E] hover:to-[#2D5A27] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Ir a la Página Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
