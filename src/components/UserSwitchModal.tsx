import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  UserPlus,
  MapPin,
  Sparkles,
  Briefcase,
  KeyRound,
  ShieldCheck,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  User,
  Clock,
  CloudCheck,
  Smartphone
} from 'lucide-react';
import { storage } from '../services/storage';
import { UserProfile, RuralCorregimiento, ProductCategory } from '../types';

interface UserSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
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

type ModalTab = 'login' | 'register' | 'demo';

export const UserSwitchModal: React.FC<UserSwitchModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // Registration Form State
  const [name, setName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState<ProductCategory>(CATEGORIES[0]);
  const [location, setLocation] = useState<RuralCorregimiento>(RURAL_LOCATIONS[0]);
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [showRegPin, setShowRegPin] = useState(false);

  const users = storage.getAllUsers();
  const demoUsers = users.filter((u) => u.isDemoProfile);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  if (!isOpen) return null;

  // Handle Login with Phone/Identifier + 4-digit PIN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginPhone.trim()) {
      setErrorMessage('Por favor escribe tu número de celular.');
      return;
    }
    if (!loginPin.trim() || loginPin.length !== 4) {
      setErrorMessage('El PIN debe tener exactamente 4 dígitos numéricos.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await storage.loginWithPin(loginPhone.trim(), loginPin.trim());
      if (result.success && result.user) {
        setSuccessMessage(`¡Bienvenida, ${result.user.name.split(' ')[0]}! Tu cuenta y datos han sido recuperados desde la nube.`);
        setTimeout(() => {
          onClose();
        }, 900);
      } else {
        if (result.lockoutSeconds) {
          setLockoutTimer(result.lockoutSeconds);
        }
        setErrorMessage(result.error || 'Error al iniciar sesión.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Escribe tu nombre completo.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      setErrorMessage('Ingresa un número de celular válido para recuperación de cuenta.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMessage('Escribe el nombre de tu emprendimiento.');
      return;
    }
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setErrorMessage('El PIN debe ser de 4 dígitos numéricos (ej: 1234).');
      return;
    }
    if (pin !== pinConfirm) {
      setErrorMessage('Los dos PIN ingresados no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = phone.trim();
      const result = await storage.registerWithPin(
        {
          name: name.trim(),
          documentId: documentId.trim() || 'No registrada',
          phone: cleanPhone,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@ruralpalmira.co`,
          businessName: businessName.trim(),
          businessCategory,
          location,
          description: description.trim() || 'Emprendimiento rural familiar en Palmira, Valle del Cauca.'
        },
        pin
      );

      if (result.success && result.user) {
        setSuccessMessage(`¡Cuenta creada y guardada en Cloud Firestore para ${result.user.name}! Podrás ingresar desde cualquier dispositivo con tu celular y PIN.`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(result.error || 'No fue posible registrar la cuenta.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error durante el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to demo profile
  const handleSelectDemoUser = (userId: string) => {
    storage.switchUser(userId);
    setSuccessMessage('Has cambiado de perfil.');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  // Logout current user (wipe session memory to protect data on shared devices)
  const handleLogout = async () => {
    if (confirm('¿Deseas cerrar tu sesión? En dispositivos compartidos, esto protege tus datos para que otra persona no vea tus ventas ni inventario.')) {
      await storage.logout();
      setSuccessMessage('Sesión cerrada con éxito.');
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FFFDF8] w-full max-w-xl rounded-[36px] shadow-2xl flex flex-col border-2 border-[#DFEBDC] overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#2D5A27] via-[#3E7B32] to-[#7E56A0] text-white flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>Cuentas y Acceso Seguro</span>
            </h3>
            <p className="text-xs text-[#D5EAD0] mt-0.5">
              Plataforma Multiusuario • Almacenamiento Centralizado en la Nube
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#DFEBDC] bg-[#FAF7EE] text-xs font-bold px-3 pt-2 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-2 px-3.5 rounded-t-2xl border-t-2 border-x-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-[#FFFDF8] border-[#DFEBDC] text-[#2D5A27] shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Ingresar con PIN</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`py-2 px-3.5 rounded-t-2xl border-t-2 border-x-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-[#FFFDF8] border-[#DFEBDC] text-[#2D5A27] shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('demo');
              setErrorMessage(null);
            }}
            className={`py-2 px-3.5 rounded-t-2xl border-t-2 border-x-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'bg-[#FFFDF8] border-[#DFEBDC] text-[#7E56A0] shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Perfiles Demo</span>
          </button>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: INICIAR SESIÓN CON PIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="bg-[#FAF7EE] p-3.5 rounded-2xl border border-[#DFEBDC] text-xs text-slate-600 space-y-1">
                <span className="font-bold text-[#2D5A27] block flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Acceso seguro y sin enredos
                </span>
                <p>
                  Ingresa tu número de celular y tu PIN personal de 4 dígitos. Funciona en cualquier vereda sin conexión a internet y se sincroniza en la nube al conectarse.
                </p>
              </div>

              {/* Lockout Banner */}
              {lockoutTimer > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                  <div>
                    <span className="font-bold block">Protección activa por intentos fallidos</span>
                    <span>Espera <strong>{lockoutTimer} segundos</strong> antes de intentar nuevamente.</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de Celular o Identificador:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 318 421 9054"
                    value={loginPhone}
                    disabled={lockoutTimer > 0}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DFEBDC] rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    PIN Personal (4 dígitos):
                  </label>
                  <span className="text-[11px] text-slate-500">Ej: 1234</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    required
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="••••"
                    value={loginPin}
                    disabled={lockoutTimer > 0}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#DFEBDC] rounded-2xl text-lg tracking-widest font-mono font-black focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Protección con bloqueo tras 5 intentos erróneos.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || lockoutTimer > 0}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2D5A27] hover:bg-[#1F3D1B] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verificando credenciales...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Iniciar Sesión en Mi Negocio</span>
                  </>
                )}
              </button>

              {/* Current Active Session & Logout */}
              {currentUser && (
                <div className="pt-3 border-t border-[#DFEBDC] flex items-center justify-between text-xs">
                  <div className="truncate">
                    <span className="text-slate-500 block text-[10px]">Sesión activa en este dispositivo:</span>
                    <strong className="text-slate-800 font-serif">{currentUser.name}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold flex items-center gap-1 cursor-pointer"
                    title="Cerrar sesión para proteger la información en dispositivos compartidos"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: CREAR CUENTA NUEVA */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="bg-[#FAF7EE] p-3 rounded-2xl border border-[#DFEBDC] text-xs text-slate-600">
                Crea tu cuenta de emprendedora. Tus productos, ventas y balances estarán completamente aislados y protegidos bajo tu UID exclusivo.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Esperanza Restrepo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Número de Celular: *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 312 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cédula o Documento:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 31.890.123"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Emprendimiento: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Miel Pura de Tienda Nueva"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoría Productiva:
                  </label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vereda o Corregimiento (Palmira):
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as RuralCorregimiento)}
                    className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                  >
                    {RURAL_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4-digit PIN setup */}
              <div className="p-3.5 rounded-2xl bg-[#FAF0E6] border border-[#E8C2AC] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8D441F] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" /> Crea tu PIN personal de 4 dígitos:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRegPin(!showRegPin)}
                    className="text-[11px] text-[#8D441F] font-bold underline cursor-pointer"
                  >
                    {showRegPin ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      PIN (4 números):
                    </label>
                    <input
                      type={showRegPin ? 'text' : 'password'}
                      required
                      maxLength={4}
                      inputMode="numeric"
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full px-3 py-2 bg-white border border-[#E8C2AC] rounded-xl text-center text-base tracking-widest font-mono font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Confirmar PIN:
                    </label>
                    <input
                      type={showRegPin ? 'text' : 'password'}
                      required
                      maxLength={4}
                      inputMode="numeric"
                      placeholder="••••"
                      value={pinConfirm}
                      onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full px-3 py-2 bg-white border border-[#E8C2AC] rounded-xl text-center text-base tracking-widest font-mono font-black"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  Este PIN se protege con derivación criptográfica segura en Firebase Auth y almacenamiento encriptado en IndexedDB.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción o historia del negocio (Opcional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Cultivo y venta de hortalizas y huevos criollos con abono orgánico..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2D5A27] hover:bg-[#1F3D1B] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Registrando en Cloud Firestore...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Mi Cuenta Segura</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: PERFILES FICTICIOS DE DEMOSTRACIÓN */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="bg-[#FAF7EE] p-3 rounded-2xl border border-[#DFEBDC] text-xs text-slate-600">
                <span className="font-bold text-[#7E56A0] block mb-1">
                  Perfiles Académicos de Demostración
                </span>
                Puedes alternar al instante entre estos 3 perfiles para comprobar que los productos, ventas y reportes de cada uno están 100% aislados.
              </div>

              <div className="grid gap-3">
                {demoUsers.map((u) => {
                  const isCurrent = u.id === currentUser?.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectDemoUser(u.id)}
                      className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-[#2D5A27] bg-[#EAF4E8] shadow-xs'
                          : 'border-[#DFEBDC] bg-[#FAF7EE] hover:border-[#BED6B8] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-serif font-black text-sm shrink-0 ${
                              isCurrent
                                ? 'bg-[#2D5A27] text-white shadow-2xs'
                                : 'bg-[#F0E8F5] text-[#553075]'
                            }`}
                          >
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-black text-slate-900 text-sm">{u.name}</h4>
                              <span className="text-[10px] px-2 py-0.5 bg-[#F0E8F5] text-[#553075] rounded-full font-bold">
                                Demo (PIN: 1234)
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#8D5B4C] mt-0.5">{u.businessName}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-[#2D5A27]" />
                              <span>{u.location}</span>
                              <span className="mx-1">•</span>
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{u.phone}</span>
                            </p>
                          </div>
                        </div>

                        {isCurrent && (
                          <span className="px-2.5 py-1 rounded-xl bg-[#2D5A27] text-white text-[11px] font-bold flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                            <span>Activa</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    if (confirm('¿Restablecer datos de fábrica de las cuentas de demostración?')) {
                      storage.resetToDefaults();
                      onClose();
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  Restaurar datos de prueba predeterminados
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#FAF7EE] border-t border-[#DFEBDC] text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>IndexedDB + Cloud Firestore</span>
          </div>
          <span>Palmira, Valle del Cauca</span>
        </div>

      </div>
    </div>
  );
};
