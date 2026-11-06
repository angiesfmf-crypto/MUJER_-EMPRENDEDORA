import React from 'react';
import {
  Home,
  Boxes,
  ShoppingBag,
  LineChart,
  GraduationCap,
  Wrench,
  User
} from 'lucide-react';

export type ScreenId =
  | 'welcome'
  | 'inventory'
  | 'sales'
  | 'training'
  | 'tools'
  | 'reports'
  | 'profile';

interface BottomNavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  inventoryCount?: number;
  lowStockCount?: number;
  trainingProgressPercent?: number;
  certificateCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
  inventoryCount = 0,
  lowStockCount = 0,
  trainingProgressPercent = 0,
  certificateCount = 0
}) => {
  const navItems: {
    id: ScreenId;
    label: string;
    sublabel?: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'welcome',
      label: 'Inicio',
      sublabel: 'Portada',
      icon: <Home className="w-6 h-6" />
    },
    {
      id: 'sales',
      label: 'Ventas',
      sublabel: 'Cobros',
      icon: <ShoppingBag className="w-6 h-6" />
    },
    {
      id: 'inventory',
      label: 'Inventario',
      sublabel: `${inventoryCount} ítems`,
      icon: <Boxes className="w-6 h-6" />,
      badge: lowStockCount > 0 ? `! ${lowStockCount}` : undefined,
      badgeColor: 'bg-[#C2673B]'
    },
    {
      id: 'training',
      label: 'Escuela TIC',
      sublabel: `${trainingProgressPercent}%`,
      icon: <GraduationCap className="w-6 h-6" />,
      badge: certificateCount > 0 ? `★ ${certificateCount}` : undefined,
      badgeColor: 'bg-[#2D5A27]'
    },
    {
      id: 'tools',
      label: 'Herramientas',
      sublabel: 'Digitales',
      icon: <Wrench className="w-6 h-6" />
    },
    {
      id: 'reports',
      label: 'Reportes',
      sublabel: 'Balances',
      icon: <LineChart className="w-6 h-6" />
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      sublabel: 'Cuenta',
      icon: <User className="w-6 h-6" />
    }
  ];

  return (
    <nav className="bg-[#FFFDF9]/98 backdrop-blur-md border-t-2 border-[#DFEBDC] py-2 px-1 sm:px-3 shadow-lg shadow-black/5 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[52px] min-w-[58px] sm:min-w-[72px] flex-1 py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#1F3D1B] bg-[#EAF4E8] font-black shadow-xs ring-2 ring-[#2D5A27]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-[#F3EFE6] font-semibold'
              }`}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative mb-0.5">
                <div className={`transition-transform duration-150 ${isActive ? 'scale-110 text-[#2D5A27]' : 'text-slate-600'}`}>
                  {item.icon}
                </div>
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[10px] font-black text-white px-1.5 py-0.2 rounded-full shadow-xs ${
                      item.badgeColor || 'bg-[#2D5A27]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Clear, highly readable label text */}
              <span className={`text-[11px] sm:text-xs tracking-tight truncate max-w-full leading-tight ${isActive ? 'text-[#1F3D1B] font-black' : 'text-slate-700'}`}>
                {item.label}
              </span>

              {isActive && (
                <span className="w-5 h-1 bg-[#2D5A27] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
