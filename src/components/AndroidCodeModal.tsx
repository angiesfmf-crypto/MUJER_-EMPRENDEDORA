import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Folder, Terminal } from 'lucide-react';
import { ANDROID_PROJECT_FILES, AndroidSourceFile } from '../android-code/androidProjectSources';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportZip: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({
  isOpen,
  onClose,
  onExportZip
}) => {
  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(ANDROID_PROJECT_FILES[5]); // Default to Entities.kt
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 text-slate-100 w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl flex flex-col border border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Arquitectura Android Nativa (Kotlin + Jetpack Compose)
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Room + WorkManager + Material 3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Código fuente preparado para compilar en Android Studio y generar el APK funcional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportZip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Proyecto .ZIP</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: File Tree + Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar / File List */}
          <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 overflow-y-auto p-3 shrink-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-2 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-emerald-400" />
              <span>Archivos de la Solución</span>
            </div>
            
            <div className="space-y-1">
              {ANDROID_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/40'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">Estructura Offline-First:</span>
              Cada archivo refleja la arquitectura nativa solicitada para Palmira: DAOs con corrutinas, base de datos Room SQLite, y encolamiento en WorkManager.
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-medium truncate">
                {selectedFile.path}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 font-mono text-xs overflow-auto text-slate-200 leading-relaxed selection:bg-emerald-600/40">
              <code>{selectedFile.content}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
