import React from 'react';
import {
  ShoppingBag,
  Boxes,
  LineChart,
  GraduationCap,
  Wrench,
  ArrowRight,
  User,
  KeyRound,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../brand/Logo';
import { UserProfile } from '../../types';
import { ScreenId } from '../BottomNavigation';

interface WelcomeScreenProps {
  currentUser: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onOpenUserSwitch: () => void;
  onOpenProjectInfo: () => void;
  onOpenAndroidCode: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  currentUser,
  onNavigate,
  onOpenUserSwitch
}) => {
  return (
    <div className="flex-1 bg-[#FAF7EE] flex flex-col p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
      
      {/* 1. Encabezado Institucional Cálido y Limpio */}
      <div className="bg-[#FFFDF8] rounded-[32px] border-2 border-[#DFEBDC] p-6 sm:p-8 mb-6 shadow-xs text-center flex flex-col items-center">
        
        {/* Logo Institucional (Intacto y Oficial) */}
        <div className="mb-4">
          <BrandLogo variant="badge" size="xl" />
        </div>

        {/* Nombre del Proyecto */}
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1F3D1B] tracking-tight mb-2">
          Mujer Emprendedora – Palmira
        </h1>

        {/* Frase Institucional Legible */}
        <p className="text-base sm:text-lg text-[#3A5C33] font-serif italic max-w-xl leading-relaxed mb-6">
          "Impulsando el crecimiento de los emprendimientos rurales mediante herramientas digitales accesibles"
        </p>

        {/* Tarjeta de la Emprendedora Activa */}
        <div className="w-full max-w-xl bg-[#FAF7EE] border-2 border-[#BED6B8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2D5A27] text-white font-serif font-black text-lg flex items-center justify-center shrink-0 shadow-2xs">
              {currentUser.name ? currentUser.name[0] : 'M'}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27] block">
                Emprendedora Activa:
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-tight">
                {currentUser.name}
              </h2>
              <p className="text-sm font-semibold text-[#8D5B4C] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#C47C56] shrink-0" />
                <span>{currentUser.businessName} • {currentUser.location}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenUserSwitch}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] text-[#2D5A27] text-sm font-bold border-2 border-[#BED6B8] shrink-0 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <KeyRound className="w-4 h-4" />
            <span>Cambiar Cuenta o PIN</span>
          </button>
        </div>

      </div>

      {/* 2. Pregunta Principal y Accesos Diarios Prioritarios */}
      <div className="mb-4">
        <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] tracking-tight">
          ¿Qué deseas hacer hoy?
        </h3>
        <p className="text-base text-slate-600 mt-1">
          Selecciona una acción para atender y organizar tu negocio campesino:
        </p>
      </div>

      {/* Tarjetas de Acción Grandes, Accesibles y con Alto Contraste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
        {/* ACCIÓN 1: VENTAS (Prioridad #1 diaria) */}
        <div
          onClick={() => onNavigate('sales')}
          className="p-5 sm:p-6 rounded-[28px] bg-[#FFFDF8] border-2 border-[#2D5A27] hover:border-[#1F3D1B] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center shrink-0 border border-[#BED6B8] group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27] block mb-0.5">
                Acción Diaria
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-snug">
                Registrar una Venta
              </h4>
              <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                Anotar cobros, calcular el cambio en efectivo y registrar fiados de clientas.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* ACCIÓN 2: INVENTARIO (Prioridad #2 diaria) */}
        <div
          onClick={() => onNavigate('inventory')}
          className="p-5 sm:p-6 rounded-[28px] bg-[#FFFDF8] border-2 border-[#DFEBDC] hover:border-[#BED6B8] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF0E6] text-[#8D441F] flex items-center justify-center shrink-0 border border-[#E8C2AC] group-hover:scale-105 transition-transform">
              <Boxes className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#8D441F] block mb-0.5">
                Productos
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-snug">
                Controlar mi Inventario
              </h4>
              <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                Consultar existencias disponibles, actualizar precios y agregar nuevos productos.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 group-hover:bg-[#2D5A27] group-hover:text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* ACCIÓN 3: REPORTES */}
        <div
          onClick={() => onNavigate('reports')}
          className="p-5 sm:p-6 rounded-[28px] bg-[#FFFDF8] border-2 border-[#DFEBDC] hover:border-[#BED6B8] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center shrink-0 border border-[#BED6B8] group-hover:scale-105 transition-transform">
              <LineChart className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27] block mb-0.5">
                Cuentas Claras
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-snug">
                Ver Cuentas y Reportes
              </h4>
              <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                Revisar dinero recibido hoy, total de ventas y cuentas pendientes por cobrar.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 group-hover:bg-[#2D5A27] group-hover:text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* ACCIÓN 4: ESCUELA TIC */}
        <div
          onClick={() => onNavigate('training')}
          className="p-5 sm:p-6 rounded-[28px] bg-[#FFFDF8] border-2 border-[#D5C2E3] hover:border-[#7E56A0] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F0E8F5] text-[#7E56A0] flex items-center justify-center shrink-0 border border-[#D5C2E3] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#7E56A0] block mb-0.5">
                Capacitación
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-snug">
                Escuela de Aprendizaje TIC
              </h4>
              <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                Lecciones paso a paso organizadas por niveles para hacer crecer tu emprendimiento.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F0E8F5] text-[#7E56A0] group-hover:bg-[#7E56A0] group-hover:text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* ACCIÓN 5: HERRAMIENTAS DIGITALES */}
        <div
          onClick={() => onNavigate('tools')}
          className="md:col-span-2 p-5 sm:p-6 rounded-[28px] bg-[#FFFDF8] border-2 border-[#DFEBDC] hover:border-[#BED6B8] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7EE] text-[#1F3D1B] flex items-center justify-center shrink-0 border border-[#DFEBDC] group-hover:scale-105 transition-transform">
              <Wrench className="w-7 h-7 text-[#2D5A27]" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27] block mb-0.5">
                Herramientas Útiles
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-snug">
                Catálogo de Herramientas Digitales
              </h4>
              <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                WhatsApp Business, Canva para volantes, Google Drive y calculadoras con enlaces oficiales y explicaciones sencillas.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 group-hover:bg-[#2D5A27] group-hover:text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. Indicador de Confianza Rural: Sin Internet y Seguro */}
      <div className="bg-[#FFFDF8] border-2 border-[#DFEBDC] rounded-2xl p-4 flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-700">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#2D5A27] shrink-0" />
          <span className="font-semibold">
            Tus datos se guardan primero en tu teléfono y se sincronizan en la nube automáticamente al conectarse.
          </span>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="text-xs font-bold text-[#2D5A27] hover:underline shrink-0 cursor-pointer"
        >
          Ver Perfil →
        </button>
      </div>

    </div>
  );
};
