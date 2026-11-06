import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  CreditCard,
  AlertCircle,
  Receipt,
  Search,
  Check,
  Sparkles,
  ArrowRight,
  Truck,
  Store,
  DollarSign,
  Smartphone,
  Wallet,
  AlertTriangle,
  FileText,
  Printer,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { storage, formatCOP } from '../../services/storage';
import { Product, Sale, UserProfile, PaymentMethod, DeliveryType, PaymentBreakdown } from '../../types';
import { ModuleGuideBanner } from '../common/ModuleGuideBanner';
import { EmptyState } from '../common/EmptyState';

interface SalesScreenProps {
  currentUser: UserProfile;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const SalesScreen: React.FC<SalesScreenProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'new_sale' | 'history'>('new_sale');

  // ==================== FORM STATE (SECCIONES A - E) ====================
  // Sección A: Productos
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sección B: Clienta
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Sección C: Entrega
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('recogida');
  const [deliveryLocation, setDeliveryLocation] = useState<string>(currentUser.location || '');
  const [deliveryCost, setDeliveryCost] = useState<number | ''>('');

  // Sección D & E: Forma de Pago & Cobro y Cambio
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  // Para Efectivo
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  // Para Crédito Local (Fiado)
  const [creditInitialPaid, setCreditInitialPaid] = useState<number | ''>('');
  // Para Pago Combinado
  const [combinedCash, setCombinedCash] = useState<number | ''>('');
  const [combinedCashReceived, setCombinedCashReceived] = useState<number | ''>('');
  const [combinedNequi, setCombinedNequi] = useState<number | ''>('');
  const [combinedTransfer, setCombinedTransfer] = useState<number | ''>('');
  const [combinedCredit, setCombinedCredit] = useState<number | ''>('');

  // Sección F: Modal de Confirmación Previa y Modal de Éxito
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [saleSuccessModal, setSaleSuccessModal] = useState<Sale | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal para abonar a una deuda en el historial
  const [debtPaymentModal, setDebtPaymentModal] = useState<Sale | null>(null);
  const [debtPaymentAmount, setDebtPaymentAmount] = useState<number | ''>('');

  // ==================== DATA ====================
  const products = storage.getProducts(currentUser.id);
  const salesHistory = storage.getSales(currentUser.id);

  // ==================== CALCULATIONS ====================
  const subtotalProducts = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const parsedDeliveryCost = Number(deliveryCost) || 0;
  const totalAmount = subtotalProducts + parsedDeliveryCost;
  const totalUnitsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cálculos de Cobro y Cambio
  const parsedCashReceived = Number(cashReceived) || 0;
  const cashChange = parsedCashReceived >= totalAmount ? parsedCashReceived - totalAmount : 0;
  const cashMissing = parsedCashReceived < totalAmount ? totalAmount - parsedCashReceived : 0;

  // Cálculos para Crédito Local
  const parsedCreditInitial = Number(creditInitialPaid) || 0;
  const creditPendingBalance = Math.max(0, totalAmount - parsedCreditInitial);

  // Cálculos para Pago Combinado
  const pCash = Number(combinedCash) || 0;
  const pNequi = Number(combinedNequi) || 0;
  const pTransfer = Number(combinedTransfer) || 0;
  const pCredit = Number(combinedCredit) || 0;
  const combinedTotalCovered = pCash + pNequi + pTransfer + pCredit;
  const combinedMissing = Math.max(0, totalAmount - combinedTotalCovered);
  const pCashReceived = Number(combinedCashReceived) || 0;
  const combinedCashChange = pCashReceived >= pCash ? pCashReceived - pCash : 0;

  // ==================== CART ACTIONS ====================
  const handleAddToCart = (product: Product) => {
    setErrorMessage(null);
    if (product.stock <= 0) {
      setErrorMessage(`El producto "${product.name}" está agotado en tu inventario.`);
      return;
    }

    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        setErrorMessage(
          `No puedes agregar más de "${product.name}". Ya alcanzaste las ${product.stock} unidades disponibles en inventario.`
        );
        return;
      }
      setCart(
        cart.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    setErrorMessage(null);
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    if (newQty <= 0) {
      setCart(cart.filter((i) => i.product.id !== productId));
      return;
    }

    if (newQty > item.product.stock) {
      setErrorMessage(
        `Solo tienes ${item.product.stock} ${item.product.unit}(s) disponibles de "${item.product.name}".`
      );
      return;
    }

    setCart(
      cart.map((i) => (i.product.id === productId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((i) => i.product.id !== productId));
  };

  // ==================== VALIDATIONS & SUBMISSION ====================
  const validateBeforeConfirmation = (): boolean => {
    setErrorMessage(null);

    // A. Productos
    if (cart.length === 0) {
      setErrorMessage('Agrega al menos un producto del inventario para registrar la venta.');
      return false;
    }

    // B. Clienta
    if (!customerName.trim()) {
      setErrorMessage('Por favor ingresa el nombre de la clienta para identificar a quién le vendiste.');
      return false;
    }

    // E. Cobro y Cambio
    if (paymentMethod === 'Efectivo') {
      if (parsedCashReceived <= 0) {
        setErrorMessage('Por favor anota cuánto dinero en efectivo te entregó la clienta en el campo "Dinero recibido".');
        return false;
      }
      if (parsedCashReceived < totalAmount) {
        setErrorMessage(
          `Dinero insuficiente: la clienta entregó ${formatCOP(parsedCashReceived)}, pero el total es ${formatCOP(totalAmount)}. Faltan ${formatCOP(cashMissing)}. No se puede registrar como pagada una venta incompleta.`
        );
        return false;
      }
    }

    if (paymentMethod === 'Crédito Local') {
      if (parsedCreditInitial > totalAmount) {
        setErrorMessage('El abono inicial no puede ser mayor que el total de la compra.');
        return false;
      }
    }

    if (paymentMethod === 'Pago Combinado') {
      if (combinedTotalCovered !== totalAmount) {
        setErrorMessage(
          `La suma de los medios de pago (${formatCOP(combinedTotalCovered)}) debe ser exactamente igual al total de la venta (${formatCOP(totalAmount)}). Faltan ${formatCOP(combinedMissing)} por distribuir.`
        );
        return false;
      }
      if (pCash > 0 && pCashReceived > 0 && pCashReceived < pCash) {
        setErrorMessage(
          `En efectivo se acordaron ${formatCOP(pCash)}, pero se anotó haber recibido solo ${formatCOP(pCashReceived)}.`
        );
        return false;
      }
    }

    return true;
  };

  const handleOpenConfirmation = () => {
    if (validateBeforeConfirmation()) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleFinalizeSale = () => {
    try {
      const saleItems = cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity
      }));

      let breakdown: PaymentBreakdown | undefined = undefined;
      let amountPaid = totalAmount;
      let pendingBalance = 0;

      if (paymentMethod === 'Efectivo') {
        breakdown = {
          cashReceived: parsedCashReceived,
          cashChange,
          cashAmount: totalAmount
        };
        amountPaid = totalAmount;
        pendingBalance = 0;
      } else if (paymentMethod === 'Crédito Local') {
        breakdown = {
          cashReceived: parsedCreditInitial,
          creditAmount: creditPendingBalance
        };
        amountPaid = parsedCreditInitial;
        pendingBalance = creditPendingBalance;
      } else if (paymentMethod === 'Pago Combinado') {
        breakdown = {
          cashAmount: pCash,
          cashReceived: pCashReceived || pCash,
          cashChange: combinedCashChange,
          nequiAmount: pNequi,
          transferAmount: pTransfer,
          creditAmount: pCredit
        };
        amountPaid = pCash + pNequi + pTransfer;
        pendingBalance = pCredit;
      } else {
        // Nequi o Transferencia Bancaria
        amountPaid = totalAmount;
        pendingBalance = 0;
      }

      const newSale = storage.registerSale({
        items: saleItems,
        subtotalAmount: subtotalProducts,
        deliveryCost: parsedDeliveryCost,
        totalAmount,
        paymentMethod,
        paymentBreakdown: breakdown,
        amountPaid,
        pendingBalance,
        deliveryType,
        deliveryLocation: deliveryType === 'domicilio' ? deliveryLocation : undefined,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        customerNotes: customerNotes.trim() || undefined
      });

      // Reset form
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerNotes('');
      setDeliveryType('recogida');
      setDeliveryCost('');
      setPaymentMethod('Efectivo');
      setCashReceived('');
      setCreditInitialPaid('');
      setCombinedCash('');
      setCombinedCashReceived('');
      setCombinedNequi('');
      setCombinedTransfer('');
      setCombinedCredit('');
      setIsConfirmModalOpen(false);

      // Open Success receipt
      setSaleSuccessModal(newSale);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar la venta');
      setIsConfirmModalOpen(false);
    }
  };

  // Registrar abono a deuda en el historial
  const handleRegisterDebtPayment = () => {
    if (!debtPaymentModal) return;
    const amount = Number(debtPaymentAmount);
    if (amount <= 0) {
      alert('Ingresa un monto válido para el abono.');
      return;
    }
    const updated = storage.recordPaymentOnSale(debtPaymentModal.id, amount);
    if (updated) {
      setDebtPaymentModal(null);
      setDebtPaymentAmount('');
    }
  };

  // Filter products for catalog search
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="flex-1 bg-[#FAF7EE] flex flex-col p-3 sm:p-6 max-w-5xl mx-auto w-full">
      
      {/* Onboarding Guide Banner */}
      <ModuleGuideBanner
        moduleKey="sales"
        title="Punto de Ventas Rural Organizado"
        description="Registra tus ventas paso a paso: agrega productos de tu inventario, anota la clienta, selecciona entrega y calcula automáticamente el cambio a devolver en efectivo o el saldo fiado."
        tips={[
          'Al confirmar cada venta, las cantidades se descuentan de inmediato de tu inventario local en el teléfono.',
          'Si la clienta paga con un billete grande, la aplicación te dice exactamente cuánto cambio entregar para no equivocarte.'
        ]}
      />

      {/* Tabs Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#DFEBDC] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center shrink-0 border border-[#BED6B8]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] tracking-tight">
              Registro y Control de Ventas
            </h2>
            <p className="text-xs text-[#8D5B4C] font-medium">
              {currentUser.businessName} • {currentUser.location}
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex p-1 bg-[#FFFDF8] rounded-2xl border border-[#DFEBDC] text-xs shadow-2xs">
          <button
            onClick={() => setActiveTab('new_sale')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new_sale'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Venta</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historial ({salesHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fade-in shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5">Atención:</span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-700 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: NUEVA VENTA (SECCIONES ESTRUCTURADAS A - E)        */}
      {/* ======================================================== */}
      {activeTab === 'new_sale' ? (
        <div className="space-y-5">
          
          {/* SECCIÓN A: PRODUCTOS DE LA VENTA */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-[#FFFDF8] border-2 border-[#DFEBDC] shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-[#DFEBDC] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2D5A27] text-white text-xs font-black flex items-center justify-center">
                  A
                </span>
                <h3 className="font-serif font-black text-slate-900 text-base">
                  Productos de la Venta
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {totalUnitsInCart} unidad(es) seleccionada(s)
              </span>
            </div>

            {/* Product Selector with Search & Catalog */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Product Search & Quick Add */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre o categoría..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-[#FAF7EE] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#2D5A27] text-white'
                        : 'bg-[#FAF7EE] text-slate-600 border border-[#DFEBDC]'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#2D5A27] text-white'
                          : 'bg-[#FAF7EE] text-slate-600 border border-[#DFEBDC]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Catalog Grid for Quick Adding */}
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {filteredProducts.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">
                      No encontramos productos con ese nombre.
                    </p>
                  ) : (
                    filteredProducts.map((p) => {
                      const isOutOfStock = p.stock <= 0;
                      const inCart = cart.find((i) => i.product.id === p.id);
                      return (
                        <div
                          key={p.id}
                          className="p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] flex items-center justify-between gap-2 hover:border-[#BED6B8] transition-all"
                        >
                          <div className="min-w-0">
                            <span className="font-serif font-bold text-slate-900 text-xs truncate block">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {formatCOP(p.price)} • {p.stock} disponibles en stock
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(p)}
                            disabled={isOutOfStock || (inCart && inCart.quantity >= p.stock)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                              isOutOfStock
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-[#2D5A27] hover:bg-[#23481E] text-white cursor-pointer shadow-2xs'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{inCart ? `Agregar (${inCart.quantity})` : 'Agregar'}</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Active Cart Basket */}
              <div className="lg:col-span-5 bg-[#FAF7EE] rounded-3xl p-4 border border-[#DFEBDC] flex flex-col justify-between">
                <div>
                  <span className="font-serif font-bold text-xs text-[#1F3D1B] block mb-2">
                    Canasta de la Venta Actual
                  </span>

                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-1 opacity-40 text-[#2D5A27]" />
                      <p className="text-xs">No has agregado productos a la venta.</p>
                      <p className="text-[10px] mt-0.5">Toca "Agregar" en la lista de la izquierda.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-2.5 rounded-2xl bg-[#FFFDF8] border border-[#DFEBDC] text-xs flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900 block truncate">
                              {item.product.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {formatCOP(item.product.price)} c/u • Subtotal:{' '}
                              <strong className="text-[#2D5A27]">
                                {formatCOP(item.product.price * item.quantity)}
                              </strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-6 h-6 rounded-lg bg-[#2D5A27] text-white flex items-center justify-center font-bold disabled:opacity-30"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="p-1 text-slate-400 hover:text-red-600 ml-1"
                              title="Quitar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotal Display */}
                <div className="pt-3 mt-3 border-t border-[#DFEBDC] flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Subtotal Productos:</span>
                  <span className="font-serif font-black text-base text-[#1F3D1B]">
                    {formatCOP(subtotalProducts)}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* SECCIÓN B & C: INFORMACIÓN DE LA CLIENTA Y ENTREGA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* SECCIÓN B: INFORMACIÓN DE LA CLIENTA */}
            <div className="p-5 rounded-[32px] bg-[#FFFDF8] border-2 border-[#DFEBDC] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-[#DFEBDC] pb-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#2D5A27] text-white text-xs font-black flex items-center justify-center">
                    B
                  </span>
                  <h3 className="font-serif font-black text-slate-900 text-base">
                    Información de la Clienta
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre de la clienta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Doña Gladys, Carmen Gómez..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7EE] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono o WhatsApp (Opcional)
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 315 762 1198"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7EE] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Notas del pedido (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Para entregar antes de las 4pm, pedido para fiesta..."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7EE] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN C: ENTREGA */}
            <div className="p-5 rounded-[32px] bg-[#FFFDF8] border-2 border-[#DFEBDC] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-[#DFEBDC] pb-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#2D5A27] text-white text-xs font-black flex items-center justify-center">
                    C
                  </span>
                  <h3 className="font-serif font-black text-slate-900 text-base">
                    Modalidad de Entrega
                  </h3>
                </div>

                {/* Delivery Option Toggle */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType('recogida');
                      setDeliveryCost('');
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      deliveryType === 'recogida'
                        ? 'bg-[#EAF4E8] text-[#1E4D1A] border-[#2D5A27] ring-1 ring-[#2D5A27]'
                        : 'bg-[#FAF7EE] text-slate-600 border-[#DFEBDC]'
                    }`}
                  >
                    <Store className="w-5 h-5 text-[#2D5A27]" />
                    <span>Recogida en Puesto / Finca</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('domicilio')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      deliveryType === 'domicilio'
                        ? 'bg-[#EAF4E8] text-[#1E4D1A] border-[#2D5A27] ring-1 ring-[#2D5A27]'
                        : 'bg-[#FAF7EE] text-slate-600 border-[#DFEBDC]'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#8D5B4C]" />
                    <span>Envío a Domicilio / Vereda</span>
                  </button>
                </div>

                {/* Domicilio Fields */}
                {deliveryType === 'domicilio' ? (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-[#FAF0E6]/50 border border-[#E8C2AC] animate-fade-in text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Lugar, Vereda o Dirección de Entrega:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Vereda La Quisquina, casa de Don Pedro..."
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Costo de domicilio o flete (Opcional $):
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 3000 (dejar vacío si no cobra flete)"
                        value={deliveryCost}
                        onChange={(e) => setDeliveryCost(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-2 bg-white border border-[#DFEBDC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-[#FAF7EE] rounded-2xl border border-[#DFEBDC]">
                    La clienta recoge directamente en tu taller, puesto del parque o finca. Sin costo de flete.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* SECCIÓN D: FORMA DE PAGO */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-[#FFFDF8] border-2 border-[#DFEBDC] shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-[#DFEBDC] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2D5A27] text-white text-xs font-black flex items-center justify-center">
                  D
                </span>
                <h3 className="font-serif font-black text-slate-900 text-base">
                  Forma de Pago
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#8D5B4C]">
                Total a pagar: <strong>{formatCOP(totalAmount)}</strong>
              </span>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'Efectivo', label: 'Efectivo', icon: DollarSign, desc: 'Con cálculo de cambio' },
                { id: 'Nequi', label: 'Nequi', icon: Smartphone, desc: 'Billetera digital' },
                { id: 'Transferencia Bancaria', label: 'Transferencia', icon: CreditCard, desc: 'Daviplata o Banco' },
                { id: 'Crédito Local', label: 'Crédito Local', icon: FileText, desc: 'Fiado a confianza' },
                { id: 'Pago Combinado', label: 'Combinado', icon: Wallet, desc: 'Dos o más medios' }
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id as PaymentMethod)}
                    className={`p-3.5 rounded-2xl border text-xs text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EAF4E8] text-[#1E4D1A] border-[#2D5A27] ring-2 ring-[#2D5A27] shadow-xs'
                        : 'bg-[#FAF7EE] text-slate-700 border-[#DFEBDC] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[#2D5A27]' : 'text-slate-500'}`} />
                      {isSelected && <Check className="w-4 h-4 text-[#2D5A27]" />}
                    </div>
                    <div>
                      <span className="font-bold block text-xs">{opt.label}</span>
                      <span className="text-[10px] text-slate-500">{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN E: COBRO Y CAMBIO (SECCIÓN FUNDAMENTAL) */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-[#FFFDF8] border-2 border-[#BED6B8] shadow-md shadow-[#2D5A27]/5">
            <div className="flex items-center justify-between mb-3 border-b border-[#DFEBDC] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7E56A0] text-white text-xs font-black flex items-center justify-center">
                  E
                </span>
                <h3 className="font-serif font-black text-slate-900 text-base">
                  Cobro y Cálculo de Cambio
                </h3>
              </div>
              <span className="text-xs font-serif font-bold text-[#2D5A27] bg-[#EAF4E8] px-3 py-1 rounded-xl border border-[#C5DEC1]">
                Total de la compra: {formatCOP(totalAmount)}
              </span>
            </div>

            {/* CASO 1: EFECTIVO (Cálculo exacto de cambio con billetes) */}
            {paymentMethod === 'Efectivo' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Dinero recibido en efectivo de la clienta ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="Ej: 50000, 100000..."
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value ? Number(e.target.value) : '')}
                        className="w-full pl-8 pr-3.5 py-3 bg-[#FAF7EE] border-2 border-[#DFEBDC] rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      />
                    </div>

                    {/* Quick Bill Buttons for Rural Colombia */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] text-slate-400 font-medium">Billetes rápidos:</span>
                      {[
                        { label: 'Exacto', val: totalAmount },
                        { label: '$10.000', val: 10000 },
                        { label: '$20.000', val: 20000 },
                        { label: '$50.000', val: 50000 },
                        { label: '$100.000', val: 100000 }
                      ].map((b) => (
                        <button
                          key={b.label}
                          type="button"
                          onClick={() => setCashReceived(b.val)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF7EE] hover:bg-[#EAF4E8] text-slate-700 text-[10px] font-bold border border-[#DFEBDC] cursor-pointer"
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlighted Change or Missing Banner */}
                  <div className="h-full flex flex-col justify-center">
                    {parsedCashReceived <= 0 ? (
                      <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] text-xs text-slate-500 text-center">
                        Ingresa el billete o valor que te entrega la clienta para calcular el cambio automáticamente.
                      </div>
                    ) : parsedCashReceived >= totalAmount ? (
                      <div className="p-4 rounded-2xl bg-[#EAF4E8] border-2 border-[#BED6B8] text-center shadow-xs animate-fade-in">
                        <span className="text-xs uppercase font-bold text-[#1E4D1A] tracking-wider block">
                          Cambio a devolver a la clienta:
                        </span>
                        <span className="text-2xl sm:text-3xl font-serif font-black text-[#1E4D1A] my-1 block">
                          {formatCOP(cashChange)}
                        </span>
                        <span className="text-[11px] text-[#2D5A27]">
                          (Entregó {formatCOP(parsedCashReceived)} - Compra de {formatCOP(totalAmount)})
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center shadow-xs animate-fade-in">
                        <span className="text-xs uppercase font-bold text-amber-800 tracking-wider block">
                          Dinero Insuficiente:
                        </span>
                        <span className="text-2xl font-serif font-black text-amber-900 my-1 block">
                          Faltan {formatCOP(cashMissing)}
                        </span>
                        <span className="text-[11px] text-amber-700">
                          Solo ha entregado {formatCOP(parsedCashReceived)} de {formatCOP(totalAmount)}.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CASO 2: NEQUI */}
            {paymentMethod === 'Nequi' && (
              <div className="p-4 rounded-2xl bg-[#F0E8F5] border border-[#DAC6E5] text-xs text-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-[#4A2369]">
                  <Smartphone className="w-4 h-4 text-[#7E56A0]" />
                  <span>Cobro por Nequi: {formatCOP(totalAmount)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  La clienta te transfiere los <strong>{formatCOP(totalAmount)}</strong> a tu número Nequi (<strong>{currentUser.phone}</strong>) o escanea tu código QR.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-[#DAC6E5] text-[11px] text-[#4A2369]">
                  ✓ No requiere dar cambio en efectivo. Se registra como pagado por completo.
                </div>
              </div>
            )}

            {/* CASO 3: TRANSFERENCIA BANCARIA */}
            {paymentMethod === 'Transferencia Bancaria' && (
              <div className="p-4 rounded-2xl bg-[#EAF4E8] border border-[#BED6B8] text-xs text-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-[#1E4D1A]">
                  <CreditCard className="w-4 h-4 text-[#2D5A27]" />
                  <span>Transferencia Bancaria o Daviplata: {formatCOP(totalAmount)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Pide a la clienta que te comparta el comprobante digital de la transferencia bancaria antes de entregar el paquete.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-[#BED6B8] text-[11px] text-[#1E4D1A]">
                  ✓ Monto completo recibido digitalmente sin cambio en efectivo.
                </div>
              </div>
            )}

            {/* CASO 4: CRÉDITO LOCAL (FIADO A CONFIANZA) */}
            {paymentMethod === 'Crédito Local' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#FAF0E6] border border-[#E8C2AC] text-xs">
                  <div className="flex items-center gap-2 font-serif font-bold text-[#8D441F] mb-1">
                    <FileText className="w-4 h-4 text-[#C47C56]" />
                    <span>Crédito Local / Venta Fiada</span>
                  </div>
                  <p className="text-[#8D441F] text-[11px] leading-relaxed">
                    Anota si la clienta te dio algún abono inicial en mano o si la cuenta queda 100% fiada para pagar después.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Abono inicial recibido hoy ($):
                    </label>
                    <input
                      type="number"
                      placeholder="Ej: 0 (si no abonó nada) o monto inicial"
                      value={creditInitialPaid}
                      onChange={(e) => setCreditInitialPaid(e.target.value ? Number(e.target.value) : '')}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7EE] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#DFEBDC] text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Saldo pendiente por cobrar:
                    </span>
                    <span className="text-xl font-serif font-black text-[#8D441F] mt-0.5 block">
                      {formatCOP(creditPendingBalance)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      a nombre de {customerName || 'la clienta'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CASO 5: PAGO COMBINADO (Múltiples medios) */}
            {paymentMethod === 'Pago Combinado' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#F4ECF8] border border-[#DAC6E5] text-[11px] text-[#4A2369]">
                  Distribuye los <strong>{formatCOP(totalAmount)}</strong> entre los medios que utilizó la clienta:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Parte Efectivo ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={combinedCash}
                      onChange={(e) => setCombinedCash(e.target.value ? Number(e.target.value) : '')}
                      className="w-full text-xs px-3 py-2 bg-[#FAF7EE] border border-[#DFEBDC] rounded-xl focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Parte Nequi ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={combinedNequi}
                      onChange={(e) => setCombinedNequi(e.target.value ? Number(e.target.value) : '')}
                      className="w-full text-xs px-3 py-2 bg-[#FAF7EE] border border-[#DFEBDC] rounded-xl focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Transferencia ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={combinedTransfer}
                      onChange={(e) => setCombinedTransfer(e.target.value ? Number(e.target.value) : '')}
                      className="w-full text-xs px-3 py-2 bg-[#FAF7EE] border border-[#DFEBDC] rounded-xl focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Saldo Fiado ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={combinedCredit}
                      onChange={(e) => setCombinedCredit(e.target.value ? Number(e.target.value) : '')}
                      className="w-full text-xs px-3 py-2 bg-[#FAF7EE] border border-[#DFEBDC] rounded-xl focus:ring-2 focus:ring-[#2D5A27]"
                    />
                  </div>
                </div>

                {/* Sub-calculation for cash change if cash received is higher */}
                {pCash > 0 && (
                  <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-[#DFEBDC] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-700 block">
                        Si entregó un billete para su parte en efectivo:
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Debe pagar {formatCOP(pCash)} en efectivo.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Dinero entregado"
                        value={combinedCashReceived}
                        onChange={(e) => setCombinedCashReceived(e.target.value ? Number(e.target.value) : '')}
                        className="w-32 px-2.5 py-1.5 bg-white border border-[#DFEBDC] rounded-xl text-xs"
                      />
                      {combinedCashChange > 0 && (
                        <span className="font-bold text-[#1E4D1A] bg-[#EAF4E8] px-2 py-1 rounded-lg border border-[#BED6B8]">
                          Cambio: {formatCOP(combinedCashChange)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Combined Totals Validator */}
                <div className="flex items-center justify-between p-3 rounded-2xl border text-xs">
                  <span>
                    Total distribuido:{' '}
                    <strong className={combinedTotalCovered === totalAmount ? 'text-[#1E4D1A]' : 'text-amber-800'}>
                      {formatCOP(combinedTotalCovered)}
                    </strong>{' '}
                    de {formatCOP(totalAmount)}
                  </span>
                  {combinedTotalCovered === totalAmount ? (
                    <span className="text-[#1E4D1A] font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> ¡Totalmente cubierto!
                    </span>
                  ) : (
                    <span className="text-amber-800 font-bold">
                      Faltan {formatCOP(combinedMissing)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* BOTÓN REVISAR Y CONFIRMAR VENTA */}
          <div className="p-4 bg-[#FAF7EE] rounded-[28px] border border-[#DFEBDC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 block">Total a Facturar:</span>
              <span className="text-2xl font-serif font-black text-[#1F3D1B]">
                {formatCOP(totalAmount)}
              </span>
            </div>

            <button
              onClick={handleOpenConfirmation}
              disabled={cart.length === 0}
              className={`px-6 py-3.5 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                cart.length > 0
                  ? 'bg-gradient-to-r from-[#2D5A27] to-[#3E7B32] hover:from-[#23481E] hover:to-[#2D5A27] text-white shadow-[#2D5A27]/20 transform hover:-translate-y-0.5'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Revisar y Confirmar Venta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* ======================================================== */
        /* TAB 2: HISTORIAL DE VENTAS                               */
        /* ======================================================== */
        <div className="space-y-3">
          {salesHistory.length === 0 ? (
            <EmptyState
              illustrationType="sales"
              title="Aún no has registrado ventas"
              description="Cada vez que una clienta te compre mermeladas, artesanías o plantas, anótala aquí para ver tus ganancias y existencias al día."
              actionText="Registrar Mi Primera Venta"
              onAction={() => setActiveTab('new_sale')}
            />
          ) : (
            salesHistory.map((sale) => {
              const hasDebt = (sale.pendingBalance || 0) > 0;
              return (
                <div
                  key={sale.id}
                  className="p-4 sm:p-5 rounded-3xl bg-[#FFFDF8] border border-[#DFEBDC] hover:border-[#BED6B8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-black text-slate-900 text-sm sm:text-base">
                        {sale.customerName || 'Venta al mostrador'}
                      </span>
                      {hasDebt ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                          Debe {formatCOP(sale.pendingBalance || 0)}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EAF4E8] text-[#1E4D1A] border border-[#BED6B8]">
                          Pagada
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{new Date(sale.date).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
                      <span>•</span>
                      <span>{sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}</span>
                      {sale.deliveryType === 'domicilio' && (
                        <>
                          <span>•</span>
                          <span className="text-[#8D5B4C] font-semibold">Envío a {sale.deliveryLocation || 'domicilio'}</span>
                        </>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Medio: <strong>{sale.paymentMethod}</strong>
                      {sale.amountPaid !== undefined && (
                        <span> • Recibido: {formatCOP(sale.amountPaid)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="font-serif font-black text-base text-[#1F3D1B] block">
                        {formatCOP(sale.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {sale.items.reduce((acc, i) => acc + i.quantity, 0)} artículo(s)
                      </span>
                    </div>

                    {hasDebt && (
                      <button
                        onClick={() => {
                          setDebtPaymentModal(sale);
                          setDebtPaymentAmount(sale.pendingBalance || 0);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#8D5B4C] hover:bg-[#723616] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Abonar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECCIÓN F: MODAL DE CONFIRMACIÓN PREVIA                  */}
      {/* ======================================================== */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-[36px] shadow-2xl border-2 border-[#BED6B8] overflow-hidden my-auto">
            
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#2D5A27] to-[#366E3A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-[#A7F3D0]" />
                <h3 className="font-serif font-black text-base sm:text-lg">
                  Confirmación de la Venta
                </h3>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1 rounded-xl text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Breakdown Content */}
            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
              
              {/* Client & Delivery */}
              <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-[#DFEBDC] space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Clienta:</span>
                  <strong className="text-slate-900">{customerName}</strong>
                </div>
                {customerPhone && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Contacto:</span>
                    <span>{customerPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Modalidad:</span>
                  <span>
                    {deliveryType === 'domicilio'
                      ? `Domicilio a ${deliveryLocation || 'dirección indicada'}`
                      : 'Recogida en puesto/taller'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <span className="font-serif font-bold text-slate-900 block mb-2">
                  Productos a Descontar del Inventario:
                </span>
                <div className="space-y-1.5 border border-[#DFEBDC] rounded-2xl p-2.5 bg-white">
                  {cart.map((i) => (
                    <div key={i.product.id} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                      <span>
                        {i.quantity}x {i.product.name}
                      </span>
                      <strong className="text-[#2D5A27]">{formatCOP(i.product.price * i.quantity)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals and Delivery Cost */}
              <div className="space-y-1 pt-2 border-t border-[#DFEBDC]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Productos:</span>
                  <span>{formatCOP(subtotalProducts)}</span>
                </div>
                {parsedDeliveryCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Flete / Envío Domicilio:</span>
                    <span>{formatCOP(parsedDeliveryCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-black text-[#1F3D1B] pt-1 border-t border-slate-200">
                  <span>Total de la Compra:</span>
                  <span>{formatCOP(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-3 rounded-2xl bg-[#EAF4E8] border border-[#BED6B8] space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1E4D1A]">Forma de pago:</span>
                  <strong className="text-[#1E4D1A]">{paymentMethod}</strong>
                </div>

                {paymentMethod === 'Efectivo' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dinero recibido:</span>
                      <span>{formatCOP(parsedCashReceived)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-serif font-black text-[#1E4D1A] pt-1 border-t border-[#BED6B8]">
                      <span>Cambio a devolver:</span>
                      <span>{formatCOP(cashChange)}</span>
                    </div>
                  </>
                )}

                {paymentMethod === 'Crédito Local' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Abono inicial entregado:</span>
                      <span>{formatCOP(parsedCreditInitial)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-serif font-black text-[#8D441F] pt-1 border-t border-[#BED6B8]">
                      <span>Saldo que queda fiado:</span>
                      <span>{formatCOP(creditPendingBalance)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-[#FAF7EE] border-t border-[#DFEBDC] flex gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Modificar
              </button>
              <button
                type="button"
                onClick={handleFinalizeSale}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#366E3A] hover:from-[#23481E] hover:to-[#2D5A27] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Descontar</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE VENTA EXITOSA / RECIBO DIGITAL                  */}
      {/* ======================================================== */}
      {saleSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-[36px] shadow-2xl border-2 border-[#BED6B8] overflow-hidden my-auto p-6 text-center">
            
            <div className="w-14 h-14 rounded-full bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center mx-auto mb-3 border-2 border-[#BED6B8] shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif font-black text-xl text-slate-900 mb-1">
              ¡Venta Registrada Exitosamente!
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Las existencias fueron descontadas de tu inventario local en el teléfono.
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] text-left text-xs space-y-1.5 mb-5 font-mono">
              <div className="flex justify-between font-serif font-bold text-slate-900 pb-1 border-b border-slate-200">
                <span>{currentUser.businessName}</span>
                <span>{formatCOP(saleSuccessModal.totalAmount)}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Clienta: <strong>{saleSuccessModal.customerName}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Medio: <strong>{saleSuccessModal.paymentMethod}</strong>
              </div>
              {saleSuccessModal.paymentBreakdown?.cashChange !== undefined && saleSuccessModal.paymentBreakdown.cashChange > 0 && (
                <div className="text-[11px] font-bold text-[#1E4D1A]">
                  Cambio entregado: {formatCOP(saleSuccessModal.paymentBreakdown.cashChange)}
                </div>
              )}
              {saleSuccessModal.pendingBalance !== undefined && saleSuccessModal.pendingBalance > 0 && (
                <div className="text-[11px] font-bold text-[#8D441F]">
                  Saldo pendiente: {formatCOP(saleSuccessModal.pendingBalance)}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-2xl border border-[#2D5A27] text-[#2D5A27] font-bold text-xs hover:bg-[#EAF4E8] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>
              <button
                onClick={() => setSaleSuccessModal(null)}
                className="flex-1 py-3 rounded-2xl bg-[#2D5A27] hover:bg-[#23481E] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Aceptar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL PARA ABONAR A DEUDA (HISTORIAL)                     */}
      {/* ======================================================== */}
      {debtPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-sm rounded-[32px] p-5 border-2 border-[#BED6B8] shadow-2xl">
            <h3 className="font-serif font-black text-base text-slate-900 mb-1">
              Registrar Abono a Deuda
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Clienta: <strong>{debtPaymentModal.customerName}</strong> • Saldo actual:{' '}
              <strong className="text-[#8D441F]">{formatCOP(debtPaymentModal.pendingBalance || 0)}</strong>
            </p>

            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monto a abonar hoy ($):
            </label>
            <input
              type="number"
              placeholder="Ej: 10000"
              value={debtPaymentAmount}
              onChange={(e) => setDebtPaymentAmount(e.target.value ? Number(e.target.value) : '')}
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7EE] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setDebtPaymentModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleRegisterDebtPayment}
                className="flex-1 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#23481E] text-xs font-bold text-white shadow-xs"
              >
                Guardar Abono
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
