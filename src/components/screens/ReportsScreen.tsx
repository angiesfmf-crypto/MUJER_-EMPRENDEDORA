import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Boxes,
  AlertTriangle,
  Award,
  CreditCard,
  Printer,
  ShoppingBag,
  DollarSign,
  Calendar,
  XCircle,
  Phone,
  MessageCircle,
  CheckCircle2,
  Wallet,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { storage, formatCOP } from '../../services/storage';
import { UserProfile, Sale } from '../../types';
import { ModuleGuideBanner } from '../common/ModuleGuideBanner';

interface ReportsScreenProps {
  currentUser: UserProfile;
}

type TimeframeOption = 'today' | 'week' | 'month' | 'custom';

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ currentUser }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('month');
  
  // Custom date range state (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [customStart, setCustomStart] = useState<string>(todayStr);
  const [customEnd, setCustomEnd] = useState<string>(todayStr);

  // Refresh trigger when payments are recorded
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal for recording debt repayment directly from reports
  const [payingSale, setPayingSale] = useState<Sale | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Fetch real data from local storage
  const products = useMemo(() => storage.getProducts(currentUser.id), [currentUser.id, refreshKey]);
  const allSales = useMemo(() => storage.getSales(currentUser.id), [currentUser.id, refreshKey]);

  // Filter sales based on selected timeframe
  const filteredSales = useMemo(() => {
    const now = new Date();
    
    if (timeframe === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      return allSales.filter((s) => s.date >= todayStart);
    }
    
    if (timeframe === 'week') {
      // Last 7 days
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      return allSales.filter((s) => s.date >= sevenDaysAgo);
    }
    
    if (timeframe === 'month') {
      // First day of current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return allSales.filter((s) => s.date >= startOfMonth);
    }
    
    if (timeframe === 'custom') {
      if (!customStart || !customEnd) return allSales;
      const startTs = new Date(`${customStart}T00:00:00`).getTime();
      const endTs = new Date(`${customEnd}T23:59:59`).getTime();
      return allSales.filter((s) => s.date >= startTs && s.date <= endTs);
    }

    return allSales;
  }, [allSales, timeframe, customStart, customEnd]);

  // --- 7 KEY KPIS ---
  // 1. Total vendido en el período
  const totalVendido = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  }, [filteredSales]);

  // 2. Dinero efectivamente recibido (lo cobrado, sin contar lo que quedó en crédito)
  const dineroRecibido = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + (s.amountPaid ?? s.totalAmount), 0);
  }, [filteredSales]);

  // 3. Valor actual del inventario (existencias * precio de cada producto)
  const valorInventario = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price * Math.max(0, p.stock)), 0);
  }, [products]);

  // 4. Número de ventas realizadas
  const numeroVentas = filteredSales.length;

  // 5. Venta promedio por compra
  const ventaPromedio = numeroVentas > 0 ? Math.round(totalVendido / numeroVentas) : 0;

  // 6. Productos entregados (unidades totales vendidas)
  const totalUnidadesVendidas = useMemo(() => {
    return filteredSales.reduce((acc, s) => {
      return acc + s.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
    }, 0);
  }, [filteredSales]);

  // 7. Cuentas pendientes de cobro (fiados activos en el negocio de la emprendedora)
  // Calculamos la deuda pendiente activa global de la emprendedora
  const totalCuentasPendientes = useMemo(() => {
    return allSales.reduce((acc, s) => acc + (s.pendingBalance || 0), 0);
  }, [allSales]);

  // Debtor sales (fiados con saldo pendiente > 0)
  const pendingDebtSales = useMemo(() => {
    return allSales
      .filter((s) => (s.pendingBalance || 0) > 0)
      .sort((a, b) => b.date - a.date);
  }, [allSales]);

  // Products stock alerts
  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 0);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert);
  }, [products]);

  // Top products by units sold in the selected period
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; quantity: number; revenue: number }> = {};
    filteredSales.forEach((s) => {
      s.items.forEach((item) => {
        if (!map[item.productId]) {
          map[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        map[item.productId].quantity += item.quantity;
        map[item.productId].revenue += item.subtotal;
      });
    });
    return Object.values(map).sort((a, b) => b.quantity - a.quantity);
  }, [filteredSales]);

  // Payment distribution breakdown
  const paymentBreakdown = useMemo(() => {
    const breakdown = {
      Efectivo: { count: 0, total: 0 },
      Nequi: { count: 0, total: 0 },
      Transferencia: { count: 0, total: 0 },
      Crédito: { count: 0, total: 0 },
      Combinado: { count: 0, total: 0 }
    };

    filteredSales.forEach((s) => {
      const pm = s.paymentMethod;
      if (pm === 'Efectivo') {
        breakdown.Efectivo.count += 1;
        breakdown.Efectivo.total += s.totalAmount;
      } else if (pm === 'Nequi') {
        breakdown.Nequi.count += 1;
        breakdown.Nequi.total += s.totalAmount;
      } else if (pm === 'Transferencia bancaria') {
        breakdown.Transferencia.count += 1;
        breakdown.Transferencia.total += s.totalAmount;
      } else if (pm === 'Crédito local') {
        breakdown.Crédito.count += 1;
        breakdown.Crédito.total += s.totalAmount;
      } else {
        breakdown.Combinado.count += 1;
        breakdown.Combinado.total += s.totalAmount;
      }
    });

    return breakdown;
  }, [filteredSales]);

  // Daily trend data for the visual chart (last 7 or custom daily points)
  const salesTrendData = useMemo(() => {
    const daysMap: Record<string, { label: string; total: number; dateTs: number }> = {};
    
    // Sort sales ascending
    const sorted = [...filteredSales].sort((a, b) => a.date - b.date);

    if (sorted.length === 0) return [];

    sorted.forEach((sale) => {
      const d = new Date(sale.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const label = d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
      
      if (!daysMap[key]) {
        daysMap[key] = { label, total: 0, dateTs: sale.date };
      }
      daysMap[key].total += sale.totalAmount;
    });

    return Object.values(daysMap);
  }, [filteredSales]);

  const maxDailyRevenue = useMemo(() => {
    return Math.max(...salesTrendData.map((d) => d.total), 1);
  }, [salesTrendData]);

  // Handle Abono a Fiado modal submission
  const handleConfirmAbono = () => {
    if (!payingSale) return;
    const amount = Number(paymentAmountInput);
    if (!amount || amount <= 0) return;

    storage.recordPaymentOnSale(payingSale.id, amount);
    setPaymentSuccessMsg(`¡Abono de ${formatCOP(amount)} registrado con éxito!`);
    setTimeout(() => {
      setPayingSale(null);
      setPaymentAmountInput('');
      setPaymentSuccessMsg(null);
      setRefreshKey((prev) => prev + 1);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-[#FAF7EE] flex flex-col p-3 sm:p-6 max-w-6xl mx-auto w-full">
      
      {/* Onboarding Guide Banner */}
      <ModuleGuideBanner
        moduleKey="reports"
        title="¿Cómo leer las cuentas y balances de tu negocio?"
        description="Aquí puedes ver la platica que ha entrado a tu caja, el valor de tus existencias en taller o huerta, las cuentas que te deben tus clientas y los productos favoritos de Palmira."
        tips={[
          'Revisa el Dinero Efectivamente Recibido para saber con cuánta plata líquida cuentas hoy.',
          'En la sección de alertas puedes hacer clic en "Abonar a fiado" para registrar pagos de tus clientas.'
        ]}
      />

      {/* Header and Date Filter Toolbar */}
      <div className="bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] p-4 sm:p-5 shadow-2xs mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center shrink-0 border border-[#BED6B8] shadow-2xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] tracking-tight">
                Panel Administrativo y Reportes
              </h2>
              <p className="text-xs text-[#8D5B4C] font-semibold">
                {currentUser.businessName} • Palmira, Valle del Cauca
              </p>
            </div>
          </div>

          {/* Date Range Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex p-1 bg-[#FAF7EE] rounded-2xl border border-[#DFEBDC] text-xs font-bold shadow-2xs">
              <button
                onClick={() => setTimeframe('today')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeframe === 'today'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeframe === 'week'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Esta semana
              </button>
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeframe === 'month'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Este mes
              </button>
              <button
                onClick={() => setTimeframe('custom')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  timeframe === 'custom'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Personalizar
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] text-slate-700 hover:text-slate-900 hover:bg-[#EAF4E8] transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Imprimir informe en papel o guardar en PDF"
            >
              <Printer className="w-4 h-4 text-[#2D5A27]" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* Custom Date Pickers Drawer if "Personalizar fechas" is chosen */}
        {timeframe === 'custom' && (
          <div className="mt-4 pt-3 border-t border-[#DFEBDC] flex flex-wrap items-center gap-3 text-xs bg-[#FAF7EE]/60 p-3 rounded-2xl">
            <span className="font-bold text-[#2D5A27] flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Rango de fechas:
            </span>
            <div className="flex items-center gap-2">
              <label className="text-slate-600 font-semibold">Desde:</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-white border border-[#BED6B8] rounded-xl px-2.5 py-1 text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-600 font-semibold">Hasta:</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-white border border-[#BED6B8] rounded-xl px-2.5 py-1 text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-[#2D5A27]"
              />
            </div>
            <span className="text-[11px] text-slate-500 italic">
              Mostrando {filteredSales.length} venta(s) registradas en el período seleccionado.
            </span>
          </div>
        )}
      </div>

      {/* 7 KEY KPIS GRID - Spacious and accessible layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 mb-6">
        
        {/* KPI 1: Total Vendido */}
        <div className="p-4 bg-[#FFFDF8] rounded-3xl border-2 border-[#DFEBDC] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                1. Total Vendido
              </span>
              <DollarSign className="w-4 h-4 text-[#2D5A27]" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] block">
              {formatCOP(totalVendido)}
            </span>
          </div>
          <span className="text-xs text-[#2D5A27] font-semibold mt-2.5 block border-t border-[#DFEBDC] pt-1.5">
            Facturado en el período seleccionado
          </span>
        </div>

        {/* KPI 2: Dinero Efectivamente Recibido */}
        <div className="p-4 bg-[#FFFDF8] rounded-3xl border-2 border-[#BED6B8] shadow-2xs flex flex-col justify-between bg-gradient-to-br from-[#FFFDF8] to-[#F1F8EE]">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27]">
                2. Plata Recibida Líquida
              </span>
              <Wallet className="w-4 h-4 text-[#2D5A27]" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-[#2D5A27] block">
              {formatCOP(dineroRecibido)}
            </span>
          </div>
          <span className="text-xs text-[#2D5A27] font-bold mt-2.5 block border-t border-[#BED6B8]/50 pt-1.5">
            Efectivo + Nequi en mano
          </span>
        </div>

        {/* KPI 3: Valor actual del inventario */}
        <div className="p-4 bg-[#FFFDF8] rounded-3xl border-2 border-[#DFEBDC] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                3. Valor Inventario
              </span>
              <Boxes className="w-4 h-4 text-[#7E56A0]" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-[#7E56A0] block">
              {formatCOP(valorInventario)}
            </span>
          </div>
          <span className="text-xs text-[#7E56A0] font-semibold mt-2.5 block border-t border-[#DFEBDC] pt-1.5">
            {products.length} productos en taller o huerta
          </span>
        </div>

        {/* KPI 4: Número de ventas */}
        <div className="p-4 bg-[#FFFDF8] rounded-3xl border-2 border-[#DFEBDC] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                4. Número de Ventas
              </span>
              <ShoppingBag className="w-4 h-4 text-[#C47C56]" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-slate-900 block">
              {numeroVentas}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-semibold mt-2.5 block border-t border-[#DFEBDC] pt-1.5">
            Transacciones realizadas
          </span>
        </div>

        {/* KPI 5: Venta promedio */}
        <div className="p-4 bg-[#FFFDF8] rounded-3xl border-2 border-[#DFEBDC] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                5. Venta Promedio
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-slate-900 block">
              {formatCOP(ventaPromedio)}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-semibold mt-2.5 block border-t border-[#DFEBDC] pt-1.5">
            Ticket promedio por clienta
          </span>
        </div>

        {/* KPI 6: Productos entregados */}
        <div className="p-4 bg-[#FFFDF8] rounded-3xl border-2 border-[#DFEBDC] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                6. Unidades Entregadas
              </span>
              <Boxes className="w-4 h-4 text-[#8D441F]" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-[#8D441F] block">
              {totalUnidadesVendidas}
            </span>
          </div>
          <span className="text-xs text-[#8D441F] font-semibold mt-2.5 block border-t border-[#DFEBDC] pt-1.5">
            Unidades cosechadas / vendidas
          </span>
        </div>

        {/* KPI 7: Cuentas pendientes de cobro (Fiados) */}
        <div className="p-4 bg-[#FFFDF8] rounded-3xl border-2 border-[#E8C2AC] shadow-2xs flex flex-col justify-between bg-gradient-to-br from-[#FFFDF8] to-[#FAF0E6] sm:col-span-2 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between text-[#8D441F] mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#8D441F]">
                7. Cuentas Pendientes por Cobrar (Fiados)
              </span>
              <Clock className="w-4 h-4 text-[#8D441F]" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-[#8D441F] block">
              {formatCOP(totalCuentasPendientes)}
            </span>
          </div>
          <span className="text-xs text-[#8D441F] font-bold mt-2.5 block border-t border-[#E8C2AC]/60 pt-1.5">
            {pendingDebtSales.length} saldo(s) fiado(s) por recaudar
          </span>
        </div>

      </div>

      {/* CHARTS ROW: Sales Trend by Day + Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        
        {/* Sales Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFEBDC] mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2D5A27]" />
              <h3 className="font-serif font-black text-slate-900 text-base">
                Comportamiento de Ventas en el Período
              </h3>
            </div>
            <span className="text-xs font-bold text-[#2D5A27] bg-[#EAF4E8] px-2.5 py-1 rounded-xl border border-[#BED6B8]">
              {formatCOP(totalVendido)} total
            </span>
          </div>

          {salesTrendData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Calendar className="w-10 h-10 text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-semibold">No se encontraron ventas en las fechas seleccionadas.</p>
              <p className="text-xs text-slate-400 mt-1">Registra cobros en el módulo de Ventas para ver las gráficas.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-end pt-4">
              {/* Visual Bars Container */}
              <div className="h-44 sm:h-52 w-full flex items-end gap-2 sm:gap-4 px-2 pb-2 border-b border-slate-200">
                {salesTrendData.map((d, index) => {
                  const barHeightPct = Math.max(12, Math.round((d.total / maxDailyRevenue) * 100));
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-bold shadow-md pointer-events-none whitespace-nowrap z-10">
                        {d.label}: {formatCOP(d.total)}
                      </div>

                      {/* Bar Value above */}
                      <span className="text-[10px] font-mono font-bold text-slate-500 mb-1 hidden sm:block truncate max-w-full">
                        ${Math.round(d.total / 1000)}k
                      </span>

                      {/* Bar Graphic */}
                      <div
                        style={{ height: `${barHeightPct}%` }}
                        className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#2D5A27] to-[#559945] hover:to-[#7E56A0] transition-all duration-300 shadow-2xs group-hover:shadow-md cursor-pointer"
                      />

                      {/* Day Label below */}
                      <span className="text-[10px] font-bold text-slate-600 mt-2 truncate max-w-full text-center">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 px-2">
                <span>Eje: Ventas diarias registradas</span>
                <span>Actualizado con almacenamiento local</span>
              </div>
            </div>
          )}
        </div>

        {/* Top Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFEBDC] mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D9825B]" />
              <h3 className="font-serif font-black text-slate-900 text-base">
                Productos Más Vendidos
              </h3>
            </div>
            <span className="text-xs text-slate-400">Por unidades</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Award className="w-10 h-10 text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-semibold">Sin ventas en este rango de fechas.</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {topProducts.slice(0, 5).map((tp, idx) => {
                const maxQty = topProducts[0]?.quantity || 1;
                const percent = Math.round((tp.quantity / maxQty) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-full bg-[#EAF4E8] text-[#2D5A27] font-black text-[11px] flex items-center justify-center shrink-0 border border-[#BED6B8]">
                          {idx + 1}
                        </span>
                        <span className="font-serif font-bold text-slate-800 truncate">
                          {tp.name}
                        </span>
                      </div>
                      <span className="font-mono text-slate-800 font-black shrink-0 ml-2">
                        {tp.quantity} unid. ({formatCOP(tp.revenue)})
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#FAF7EE] rounded-full overflow-hidden border border-[#DFEBDC]">
                      <div
                        className="h-full bg-gradient-to-r from-[#2D5A27] to-[#7E56A0] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* PAYMENT METHODS DISTRIBUTION */}
      <div className="bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] p-5 shadow-2xs mb-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFEBDC] mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#7E56A0]" />
            <h3 className="font-serif font-black text-slate-900 text-base">
              Distribución por Formas de Pago
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {filteredSales.length} transacciones registradas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(paymentBreakdown).map(([method, data]) => {
            const pct = totalVendido > 0 ? Math.round((data.total / totalVendido) * 100) : 0;
            return (
              <div
                key={method}
                className="p-3.5 bg-[#FAF7EE] rounded-2xl border border-[#DFEBDC] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-700">{method}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white border border-[#DFEBDC] text-[#2D5A27]">
                      {pct}%
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-serif font-black text-[#1F3D1B] block">
                    {formatCOP(data.total)}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#DFEBDC] flex items-center justify-between text-[11px] text-slate-500">
                  <span>{data.count} venta(s)</span>
                  <span className="w-2 h-2 rounded-full bg-[#2D5A27]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ALERTS AND FOLLOW-UP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        
        {/* Out of Stock & Low Stock Items (6 cols) */}
        <div className="lg:col-span-6 bg-[#FFFDF8] rounded-3xl border-2 border-[#E8C2AC] p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFEBDC] mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#8D441F]" />
              <h3 className="font-serif font-black text-[#8D441F] text-base">
                Alertas de Inventario ({outOfStockProducts.length + lowStockProducts.length})
              </h3>
            </div>
            <span className="text-xs text-[#8D441F] font-bold">Para comprar o elaborar</span>
          </div>

          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-[#2D5A27] mb-2" />
              <p className="text-sm font-serif font-bold text-slate-800">¡Inventario en excelente estado!</p>
              <p className="text-xs text-slate-500 mt-1">Todos tus productos tienen existencias suficientes.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 flex-1">
              {/* Out of Stock (Stock 0) */}
              {outOfStockProducts.map((p) => (
                <div
                  key={`out-${p.id}`}
                  className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <h4 className="font-serif font-bold text-red-950">{p.name}</h4>
                      <span className="text-[11px] text-red-600 font-semibold">
                        Agotado por completo en tu negocio
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white font-mono font-black shrink-0">
                    0 {p.unit}s
                  </span>
                </div>
              ))}

              {/* Low Stock Items */}
              {lowStockProducts.map((p) => (
                <div
                  key={`low-${p.id}`}
                  className="p-3 rounded-2xl bg-[#FAF0E6] border border-[#E8C2AC] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#8D441F] shrink-0" />
                    <div>
                      <h4 className="font-serif font-bold text-slate-900">{p.name}</h4>
                      <span className="text-[11px] text-[#8D441F] font-semibold">
                        Quedan solo {p.stock} (Mínimo recomendado: {p.minStockAlert})
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-[#F3D5C3] text-[#78391A] font-mono font-black shrink-0">
                    {p.stock} {p.unit}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clientas con Cuentas Pendientes de Cobro (Fiados) (6 cols) */}
        <div className="lg:col-span-6 bg-[#FFFDF8] rounded-3xl border-2 border-[#E8C2AC] p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFEBDC] mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8D441F]" />
              <h3 className="font-serif font-black text-[#8D441F] text-base">
                Cuentas por Cobrar a Clientas ({pendingDebtSales.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-[#8D441F]">
              Total: {formatCOP(totalCuentasPendientes)}
            </span>
          </div>

          {pendingDebtSales.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-[#2D5A27] mb-2" />
              <p className="text-sm font-serif font-bold text-slate-800">¡Al día con las cuentas!</p>
              <p className="text-xs text-slate-500 mt-1">Ninguna clienta tiene saldos pendientes de pago.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 flex-1">
              {pendingDebtSales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-3.5 rounded-2xl bg-[#FAF0E6] border border-[#E8C2AC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-slate-900 text-sm">
                        {sale.customerName || 'Clienta'}
                      </h4>
                      {sale.customerPhone && (
                        <a
                          href={`https://wa.me/57${sale.customerPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(sale.customerName || 'Clienta')},%20te%20saludo%20de%20${encodeURIComponent(currentUser.businessName || 'mi emprendimiento')}.%20Tienes%20un%20saldo%20pendiente%20de%20${encodeURIComponent(formatCOP(sale.pendingBalance || 0))}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-[11px] text-slate-600">
                      Fecha: {new Date(sale.date).toLocaleDateString('es-CO')} • Total venta: {formatCOP(sale.totalAmount)}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[#8D441F] font-bold">
                        Debe: <strong className="font-mono text-sm">{formatCOP(sale.pendingBalance || 0)}</strong>
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        (Abonó: {formatCOP(sale.amountPaid || 0)})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPayingSale(sale);
                      setPaymentAmountInput(String(sale.pendingBalance || 0));
                    }}
                    className="px-3 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#1F3D1B] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Abonar a fiado</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MODAL: ABONAR A FIADO */}
      {payingSale && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-3xl border-2 border-[#BED6B8] max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#DFEBDC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-slate-900 text-base">
                    Registrar Abono a Cuenta Fiada
                  </h3>
                  <p className="text-xs text-slate-500">Clienta: {payingSale.customerName || 'Clienta'}</p>
                </div>
              </div>
              <button
                onClick={() => setPayingSale(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {paymentSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <p className="font-serif font-bold text-green-900 text-sm">{paymentSuccessMsg}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-[#FAF0E6] border border-[#E8C2AC] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total de la compra inicial:</span>
                    <span className="font-mono font-bold text-slate-900">{formatCOP(payingSale.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total ya abonado:</span>
                    <span className="font-mono font-bold text-green-700">{formatCOP(payingSale.amountPaid || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-serif font-bold text-[#8D441F] pt-1 border-t border-[#E8C2AC]">
                    <span>Saldo pendiente:</span>
                    <span className="font-mono">{formatCOP(payingSale.pendingBalance || 0)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ¿Cuánto dinero te está entregando la clienta hoy? ($ COP)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={payingSale.pendingBalance || 0}
                    value={paymentAmountInput}
                    onChange={(e) => setPaymentAmountInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#BED6B8] text-lg font-mono font-black text-[#1F3D1B] focus:outline-hidden focus:border-[#2D5A27]"
                    placeholder="0"
                  />
                </div>

                {/* Quick preset buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentAmountInput(String(payingSale.pendingBalance || 0))}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-[#EAF4E8] text-[#2D5A27] text-xs font-bold border border-[#BED6B8] hover:bg-[#d9ecd6] cursor-pointer"
                  >
                    Pagar todo ({formatCOP(payingSale.pendingBalance || 0)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmountInput(String(Math.round((payingSale.pendingBalance || 0) / 2)))}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-[#FAF0E6] text-[#8D441F] text-xs font-bold border border-[#E8C2AC] hover:bg-[#f5e2d5] cursor-pointer"
                  >
                    Pagar la mitad ({formatCOP(Math.round((payingSale.pendingBalance || 0) / 2))})
                  </button>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPayingSale(null)}
                    className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAbono}
                    disabled={!Number(paymentAmountInput) || Number(paymentAmountInput) <= 0}
                    className="flex-1 py-2.5 rounded-2xl bg-[#2D5A27] hover:bg-[#1F3D1B] disabled:opacity-50 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guardar Abono</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
