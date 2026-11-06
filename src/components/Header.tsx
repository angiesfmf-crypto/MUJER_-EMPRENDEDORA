import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Code2,
  Download,
  Info,
  Smartphone,
  ChevronDown,
  User,
  SlidersHorizontal,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from './brand/Logo';
import { storage } from '../services/storage';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  isOnline: boolean;
  pendingSyncCount: number;
  onOpenAndroidCode: () => void;
  onOpenProjectInfo: () => void;
  onOpenSyncModal: () => void;
  onOpenUserSwitchModal: () => void;
  onExportZip: () => void;
  isDeviceMode: boolean;
  onToggleDeviceMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  isOnline,
  pendingSyncCount,
  onOpenAndroidCode,
  onOpenProjectInfo,
  onOpenSyncModal,
  onOpenUserSwitchModal,
  onExportZip,
  isDeviceMode,
  onToggleDeviceMode
}) => {
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [isTechMenuOpen, setIsTechMenuOpen] = useState(false);

  const globalStatus = storage.getGlobalConnectionStatus();
  const lastSyncTs = storage.getLastSyncTimestamp();

  const handleToggleOnline = () => {
    storage.setOnlineStatus(!isOnline);
  };

  const handleSyncClick = async () => {
    if (!isOnline) {
      alert('Tu teléfono está en "Modo Finca (Sin Red)". Activa la conexión para sincronizar.');
      return;
    }
    setIsManualSyncing(true);
    try {
      await storage.processSyncQueue();
    } finally {
      setIsManualSyncing(false);
    }
  };

  const formattedLastSync = lastSyncTs
    ? new Date(lastSyncTs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Pendiente';

  return (
    <>
      <header className="bg-[#FFFDF9]/98 backdrop-blur-md border-b-2 border-[#DFEBDC] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* 1. Brand Logo & Platform Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <BrandLogo variant="horizontal" size="md" />
          </div>

          {/* 2. Primary Controls: Cuenta de la Emprendedora, Estado de Red y Menú Técnico */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Entrepreneur Button (Large, accessible, legible) */}
            <button
              onClick={onOpenUserSwitchModal}
              className="flex items-center gap-2 py-2 px-3 sm:px-4 rounded-2xl bg-[#EAF4E8] hover:bg-[#DCEFD9] text-[#1F3D1B] border-2 border-[#BED6B8] transition-all cursor-pointer shadow-2xs"
              title="Cambiar de cuenta o ingresar con PIN"
            >
              <div className="w-8 h-8 rounded-full bg-[#2D5A27] text-white font-serif font-black text-sm flex items-center justify-center shrink-0">
                {currentUser.name ? currentUser.name[0] : 'M'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[11px] uppercase font-extrabold tracking-wider text-[#2D5A27] block leading-none">
                  Emprendedora Activa
                </span>
                <span className="text-sm font-bold text-slate-900 truncate block max-w-[150px] md:max-w-[190px]">
                  {currentUser.name}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#2D5A27] shrink-0" />
            </button>

            {/* Connection Status Button (Clear, legible status) */}
            <button
              onClick={handleToggleOnline}
              className={`flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border-2 shadow-2xs cursor-pointer ${
                globalStatus === 'OFFLINE_AIRPLANE'
                  ? 'bg-[#FAF0E6] text-[#8D441F] border-[#E8C2AC] hover:bg-[#F3E2D4]'
                  : 'bg-[#EAF4E8] text-[#1E4D1A] border-[#BED6B8] hover:bg-[#DDEED8]'
              }`}
              title="Toca para cambiar entre En Línea y Modo Finca (Sin Red)"
            >
              {globalStatus === 'OFFLINE_AIRPLANE' ? (
                <>
                  <WifiOff className="w-4 h-4 text-[#8D441F]" />
                  <span className="hidden sm:inline">Modo Finca (Sin Red)</span>
                  <span className="sm:hidden">Sin Red</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-[#2D5A27]" />
                  <span className="hidden sm:inline">En Línea</span>
                  <span className="sm:hidden">En Línea</span>
                </>
              )}
            </button>

            {/* Sync Queue Indicator (if items are pending) */}
            {pendingSyncCount > 0 && (
              <button
                onClick={onOpenSyncModal}
                className="flex items-center gap-1.5 py-2 px-2.5 sm:px-3 rounded-2xl bg-[#FEF3C7] text-[#92400E] border-2 border-[#FCD34D] text-xs font-bold hover:bg-[#FDE68A] transition-all cursor-pointer"
                title="Hay cambios guardados en el teléfono pendientes de subir a la nube"
              >
                <RefreshCw className="w-4 h-4 text-[#D97706]" />
                <span>{pendingSyncCount}</span>
              </button>
            )}

            {/* Technical / Administrative Menu Trigger */}
            <button
              onClick={() => setIsTechMenuOpen(true)}
              className="p-2 sm:p-2.5 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF7EE] text-slate-700 hover:text-slate-900 border-2 border-[#DFEBDC] transition-colors cursor-pointer shadow-2xs"
              title="Opciones técnicas y herramientas de administración"
              aria-label="Abrir opciones de administración"
            >
              <SlidersHorizontal className="w-5 h-5 text-[#2D5A27]" />
            </button>

          </div>

        </div>
      </header>

      {/* MODAL ADMINISTRATIVO Y TÉCNICO (Opciones de código Android, exportación y proyecto) */}
      {isTechMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-[36px] shadow-2xl border-2 border-[#DFEBDC] overflow-hidden p-6 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DFEBDC]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-slate-900">
                    Opciones Técnicas y Administrativas
                  </h3>
                  <p className="text-xs text-slate-600">Herramientas académicas y de desarrollo</p>
                </div>
              </div>
              <button
                onClick={() => setIsTechMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              
              {/* Código Android Kotlin */}
              <button
                onClick={() => {
                  setIsTechMenuOpen(false);
                  onOpenAndroidCode();
                }}
                className="p-4 rounded-2xl bg-[#FAF7EE] hover:bg-[#EAF4E8] border border-[#DFEBDC] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-[#2D5A27]" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Ver Código Fuente Android</h4>
                    <p className="text-xs text-slate-600">Archivos en Kotlin, Jetpack Compose y Room SQLite</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>

              {/* Descargar Proyecto ZIP */}
              <button
                onClick={() => {
                  setIsTechMenuOpen(false);
                  onExportZip();
                }}
                className="p-4 rounded-2xl bg-[#F0E8F5] hover:bg-[#E5D7EB] border border-[#D5C2E3] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-[#7E56A0]" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Descargar Proyecto Completo (.ZIP)</h4>
                    <p className="text-xs text-slate-600">Listo para abrir y compilar en Android Studio</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>

              {/* Sincronización y WorkManager */}
              <button
                onClick={() => {
                  setIsTechMenuOpen(false);
                  onOpenSyncModal();
                }}
                className="p-4 rounded-2xl bg-[#FAF7EE] hover:bg-[#EAF4E8] border border-[#DFEBDC] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-[#2D5A27]" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Centro de Sincronización</h4>
                    <p className="text-xs text-slate-600">Inspeccionar cola de operaciones y estado Cloud Firestore</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>

              {/* Marco Celular / Modo Dispositivo */}
              <button
                onClick={() => {
                  setIsTechMenuOpen(false);
                  onToggleDeviceMode();
                }}
                className="p-4 rounded-2xl bg-[#FAF7EE] hover:bg-[#EAF4E8] border border-[#DFEBDC] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#2D5A27]" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {isDeviceMode ? 'Quitar Marco de Celular' : 'Ver con Marco de Celular'}
                    </h4>
                    <p className="text-xs text-slate-600">Alternar entre vista completa o simulación en dispositivo</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#2D5A27]">
                  {isDeviceMode ? 'Activo' : 'Inactivo'}
                </span>
              </button>

              {/* Info del Proyecto */}
              <button
                onClick={() => {
                  setIsTechMenuOpen(false);
                  onOpenProjectInfo();
                }}
                className="p-4 rounded-2xl bg-[#FAF7EE] hover:bg-[#EAF4E8] border border-[#DFEBDC] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-[#2D5A27]" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Información del Proyecto</h4>
                    <p className="text-xs text-slate-600">Objetivo institucional en Palmira y autores académicos</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>

            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsTechMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#2D5A27] text-white font-bold text-sm cursor-pointer hover:bg-[#1F3D1B] transition-colors"
              >
                Cerrar Menú
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
