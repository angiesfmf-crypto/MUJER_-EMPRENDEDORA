import React, { useState } from 'react';
import {
  User,
  Edit3,
  MapPin,
  Phone,
  Mail,
  FileText,
  Briefcase,
  Check,
  X,
  Sparkles,
  LogOut,
  RefreshCcw,
  ShieldCheck,
  Download,
  Boxes,
  ShoppingBag
} from 'lucide-react';
import { storage } from '../../services/storage';
import { UserProfile, RuralCorregimiento, ProductCategory } from '../../types';
import { ScreenId } from '../BottomNavigation';
import { ModuleGuideBanner } from '../common/ModuleGuideBanner';

interface ProfileScreenProps {
  currentUser: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onOpenUserSwitch: () => void;
  onOpenAndroidCode: () => void;
  onExportZip: () => void;
}

const RURAL_LOCATIONS: RuralCorregimiento[] = [
  'Vereda La Quisquina',
  'Corregimiento Rozo',
  'Corregimiento El Bolo',
  'Vereda Tienda Nueva',
  'Vereda Potrerillo',
  'Corregimiento Combia',
  'Vereda La Buitrera (Palmira)',
  'Corregimiento La Torre',
  'Corregimiento Guanabanal',
  'Zona Rural Palmira Centro'
];

const CATEGORIES: ProductCategory[] = [
  'Alimentos y Conservas',
  'Artesanías y Textiles',
  'Plantas y Vivero',
  'Lácteos y Derivados',
  'Café y Panela',
  'Otros Emprendimientos'
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onNavigate,
  onOpenUserSwitch,
  onOpenAndroidCode,
  onExportZip
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(currentUser.name);
  const [documentId, setDocumentId] = useState(currentUser.documentId);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [businessName, setBusinessName] = useState(currentUser.businessName);
  const [businessCategory, setBusinessCategory] = useState<ProductCategory>(currentUser.businessCategory);
  const [location, setLocation] = useState<RuralCorregimiento>(currentUser.location);
  const [description, setDescription] = useState(currentUser.description);

  const handleStartEdit = () => {
    setName(currentUser.name);
    setDocumentId(currentUser.documentId);
    setPhone(currentUser.phone);
    setEmail(currentUser.email);
    setBusinessName(currentUser.businessName);
    setBusinessCategory(currentUser.businessCategory);
    setLocation(currentUser.location);
    setDescription(currentUser.description);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !businessName.trim()) {
      alert('El nombre y el nombre del emprendimiento son obligatorios.');
      return;
    }

    storage.updateUserProfile({
      ...currentUser,
      name: name.trim(),
      documentId: documentId.trim(),
      phone: phone.trim(),
      email: email.trim(),
      businessName: businessName.trim(),
      businessCategory,
      location,
      description: description.trim()
    });

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDemoData = () => {
    if (confirm('¿Deseas restaurar todos los perfiles de demostración y datos a sus valores iniciales?')) {
      storage.resetToDefaults();
    }
  };

  return (
    <div className="flex-1 bg-[#FAF7EE] flex flex-col p-3 sm:p-6 max-w-4xl mx-auto w-full">
      
      {/* Onboarding Guide Banner */}
      <ModuleGuideBanner
        moduleKey="profile"
        title="Perfil de tu Emprendimiento Campesino"
        description="Aquí puedes ver tus datos, cambiar el nombre de tu negocio o alternar entre los perfiles de demostración (Doña Rosalba, Doña Gladys y Doña Carmen) para verificar que las cuentas de cada una son 100% independientes."
        tips={[
          'Puedes actualizar tu número de WhatsApp para que tus clientas te contacten fácilmente.',
          'Si vas a hacer una demostración académica, puedes alternar entre emprendedoras con un solo toque.'
        ]}
      />

      {/* Profile Header Card */}
      <div className="bg-[#FFFDF8] rounded-[36px] border-2 border-[#DFEBDC] p-5 sm:p-7 shadow-xs mb-4 relative overflow-hidden">
        
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#EAF4E8] rounded-full blur-2xl opacity-60 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#2D5A27] via-[#3E7B32] to-[#7E56A0] text-white font-serif font-black text-2xl flex items-center justify-center shadow-md ring-4 ring-[#EAF4E8] shrink-0">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] tracking-tight">
                  {currentUser.name}
                </h2>
                {currentUser.isDemoProfile && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F0E8F5] text-[#553075] border border-[#D5C2E3]">
                    Perfil Demo
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-bold text-[#2D5A27] flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-[#3E7B32]" />
                <span>{currentUser.businessName}</span>
              </p>

              <p className="text-xs text-[#8D5B4C] flex items-center justify-center sm:justify-start gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#C47C56]" />
                <span>{currentUser.location} • Palmira, Valle</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FAF7EE] hover:bg-[#EAF4E8] text-[#2D5A27] font-bold text-xs border border-[#DFEBDC] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#3E7B32]" />
                <span>Editar Datos</span>
              </button>
            )}
            <button
              onClick={onOpenUserSwitch}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#F0E8F5] hover:bg-[#E4D5ED] text-[#553075] font-bold text-xs border border-[#D5C2E3] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7E56A0]" />
              <span>Cambiar Emprendedora</span>
            </button>
          </div>

        </div>

        {savedSuccess && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#EAF4E8] border border-[#BED6B8] text-[#1E4D1A] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2D5A27]" />
            <span>Perfil actualizado exitosamente en el almacenamiento de tu teléfono.</span>
          </div>
        )}
      </div>

      {/* Edit Form OR View Details */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-[#FFFDF8] rounded-[36px] border-2 border-[#BED6B8] p-5 sm:p-7 shadow-sm space-y-4 mb-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFEBDC]">
            <h3 className="font-serif font-black text-[#1F3D1B] text-base">
              Editar Datos del Emprendimiento
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Cédula de Ciudadanía</label>
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Celular / WhatsApp *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Nombre del Emprendimiento *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Categoría Principal *</label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value as ProductCategory)}
                className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs text-slate-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Vereda o Corregimiento (Palmira) *</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as RuralCorregimiento)}
              className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs text-slate-900"
            >
              {RURAL_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Descripción del Emprendimiento y Filosofía Campesina
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:ring-2 focus:ring-[#2D5A27] text-xs text-slate-900 leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold cursor-pointer hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#366E3A] hover:from-[#255020] hover:to-[#34692A] text-white font-bold shadow-md cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        /* Details View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4 text-xs">
          <div className="bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] p-5 space-y-3 shadow-2xs">
            <h4 className="font-serif font-black text-[#1F3D1B] uppercase text-[11px] tracking-wider">
              Datos Personales
            </h4>
            <div className="flex items-center gap-2.5 text-slate-700">
              <FileText className="w-4 h-4 text-[#8D5B4C] shrink-0" />
              <span>Cédula: <strong>{currentUser.documentId}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Phone className="w-4 h-4 text-[#2D5A27] shrink-0" />
              <span>Celular: <strong>{currentUser.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Mail className="w-4 h-4 text-[#7E56A0] shrink-0" />
              <span>Correo: <strong>{currentUser.email}</strong></span>
            </div>
          </div>

          <div className="bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] p-5 space-y-3 shadow-2xs">
            <h4 className="font-serif font-black text-[#1F3D1B] uppercase text-[11px] tracking-wider">
              Tu Emprendimiento Rural
            </h4>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Briefcase className="w-4 h-4 text-[#2D5A27] shrink-0" />
              <span>Categoría: <strong>{currentUser.businessCategory}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <MapPin className="w-4 h-4 text-[#C47C56] shrink-0" />
              <span>Ubicación: <strong>{currentUser.location}</strong></span>
            </div>
            <p className="text-slate-600 leading-relaxed pt-1.5 border-t border-[#DFEBDC]">
              {currentUser.description}
            </p>
          </div>
        </div>
      )}

      {/* Demonstration & Export Utilities Card */}
      <div className="bg-[#FFFDF8] rounded-[36px] border border-[#DFEBDC] p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">
            Herramientas Académicas y de Demostración
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Recursos para sustentar el proyecto y compilar en Android Studio
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <button
            onClick={onOpenAndroidCode}
            className="p-4 rounded-3xl bg-[#FAF7EE] hover:bg-[#EAF4E8] border border-[#DFEBDC] hover:border-[#BED6B8] text-left transition-all cursor-pointer"
          >
            <div className="font-serif font-bold text-[#1F3D1B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
              <span>Ver Código Kotlin y Compose</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Inspeccionar Room Entities, DAOs y Worker de WorkManager
            </p>
          </button>

          <button
            onClick={onExportZip}
            className="p-4 rounded-3xl bg-[#F0E8F5] hover:bg-[#E4D5ED] border border-[#D5C2E3] text-left transition-all cursor-pointer"
          >
            <div className="font-serif font-bold text-[#4A2369] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#7E56A0]" />
              <span>Descargar Proyecto .ZIP</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Empaqueta todo para abrir directamente en Android Studio
            </p>
          </button>
        </div>

        <div className="pt-3 border-t border-[#DFEBDC] flex items-center justify-between">
          <button
            onClick={handleResetDemoData}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-[#C47C56]" />
            <span>Restablecer datos de fábrica</span>
          </button>

          <button
            onClick={async () => {
              if (confirm('¿Deseas cerrar tu sesión? Tus datos locales quedarán protegidos en IndexedDB.')) {
                await storage.logout();
                onNavigate('welcome');
              }
            }}
            className="text-xs text-[#DC2626] hover:text-[#991B1B] flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

    </div>
  );
};
