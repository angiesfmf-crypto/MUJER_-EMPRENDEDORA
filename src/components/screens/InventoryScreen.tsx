import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Check,
  Tag,
  PlusCircle,
  MinusCircle,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { storage, formatCOP } from '../../services/storage';
import { Product, ProductCategory, UserProfile } from '../../types';
import { ModuleGuideBanner } from '../common/ModuleGuideBanner';
import { EmptyState } from '../common/EmptyState';

interface InventoryScreenProps {
  currentUser: UserProfile;
}

const CATEGORIES: ProductCategory[] = [
  'Alimentos y Conservas',
  'Artesanías y Textiles',
  'Plantas y Vivero',
  'Lácteos y Derivados',
  'Café y Panela',
  'Otros Emprendimientos'
];

const UNITS: Product['unit'][] = [
  'unidad',
  'frasco',
  'paquete',
  'kg',
  'libra',
  'manojo',
  'litro'
];

export const InventoryScreen: React.FC<InventoryScreenProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formStock, setFormStock] = useState<number | ''>('');
  const [formUnit, setFormUnit] = useState<Product['unit']>('unidad');
  const [formCategory, setFormCategory] = useState<ProductCategory>(currentUser.businessCategory);
  const [formMinAlert, setFormMinAlert] = useState<number>(4);

  // Products belonging strictly to the current user
  const products = storage.getProducts(currentUser.id);

  // Metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);
  const totalValuation = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  // Filtered List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormStock('');
    setFormUnit('unidad');
    setFormCategory(currentUser.businessCategory);
    setFormMinAlert(4);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormUnit(p.unit);
    setFormCategory(p.category);
    setFormMinAlert(p.minStockAlert);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string, name: string) => {
    if (confirm(`¿Estás segura de retirar "${name}" de tu lista de inventario?`)) {
      storage.deleteProduct(productId);
    }
  };

  const handleQuickStockChange = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    storage.saveProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: newStock,
      unit: product.unit,
      category: product.category,
      minStockAlert: product.minStockAlert
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice === '' || formStock === '') {
      alert('Por favor completa el nombre del producto, el precio y la cantidad disponible.');
      return;
    }

    try {
      storage.saveProduct({
        id: editingProduct ? editingProduct.id : undefined,
        name: formName.trim(),
        description: formDescription.trim(),
        price: Number(formPrice),
        stock: Number(formStock),
        unit: formUnit,
        category: formCategory,
        minStockAlert: Number(formMinAlert)
      });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error al guardar el producto');
    }
  };

  return (
    <div className="flex-1 bg-[#FAF7EE] flex flex-col p-3 sm:p-6 max-w-5xl mx-auto w-full">
      
      {/* Onboarding Guide Banner */}
      <ModuleGuideBanner
        moduleKey="inventory"
        title="¿Cómo funciona tu inventario rural?"
        description="Aquí tienes la lista de todo lo que elaboras o cosechas en tu vereda. Cada vez que registras una venta, la aplicación descuenta solita las unidades para que nunca te equivoques de cuenta."
        tips={[
          'Mantén tus precios actualizados teniendo en cuenta tus gastos de transporte a Palmira.',
          'Si un producto tiene el borde en color naranja, significa que te quedan poquitas unidades para la feria.'
        ]}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center shrink-0 border border-[#BED6B8]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] tracking-tight">
                Inventario de Productos
              </h2>
              <p className="text-xs text-[#8D5B4C] font-medium">
                {currentUser.businessName} • {currentUser.location}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#3E7B32] hover:from-[#255020] hover:to-[#34692A] text-white font-bold text-xs shadow-md shadow-[#2D5A27]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nuevo Producto</span>
        </button>
      </div>

      {/* Warm KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        
        <div className="p-3.5 bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Variedad de Productos
          </span>
          <span className="text-xl font-serif font-black text-[#1F3D1B] mt-0.5 block">
            {totalProducts} productos
          </span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Existencias Totales
          </span>
          <span className="text-xl font-serif font-black text-[#2D5A27] mt-0.5 block">
            {totalStock} unidades
          </span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Por Agotarse
          </span>
          <span className={`text-xl font-serif font-black mt-0.5 block ${lowStockProducts.length > 0 ? 'text-[#C2673B]' : 'text-slate-600'}`}>
            {lowStockProducts.length} productos
          </span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] rounded-3xl border border-[#DFEBDC] shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Valor en Mercancía
          </span>
          <span className="text-base sm:text-lg font-serif font-black text-[#7E56A0] mt-0.5 block truncate">
            {formatCOP(totalValuation)}
          </span>
        </div>

      </div>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 mb-4 bg-[#FAF0E6] border border-[#E8C2AC] rounded-3xl flex items-start gap-3 text-[#78391A] text-xs shadow-2xs">
          <div className="p-2 rounded-2xl bg-[#F3D5C3] text-[#8D441F] shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-sm block mb-0.5">
              ¡Alerta de pocas existencias!
            </span>
            <span>
              Tienes {lowStockProducts.length} producto(s) a punto de agotarse:{' '}
              <strong>
                {lowStockProducts.map((p) => `${p.name} (${p.stock} ${p.unit})`).join(', ')}
              </strong>
              . Prepara o elabora más cantidad para tus clientas.
            </span>
          </div>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción de tus productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-3 bg-[#FFFDF8] border border-[#DFEBDC] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] shadow-2xs"
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
            Todos ({products.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
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

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          illustrationType={searchQuery ? 'search' : 'inventory'}
          title={searchQuery ? 'No encontramos productos con ese nombre' : 'Tu canasta de productos está vacía'}
          description={
            searchQuery
              ? 'Prueba buscando con otra palabra o selecciona "Todos" para ver tu catálogo completo.'
              : 'Agrega tu primer dulce, conserva, tejido o planta medicinal para llevar tus cuentas claras.'
          }
          actionText={searchQuery ? 'Limpiar búsqueda' : 'Agregar Mi Primer Producto'}
          onAction={searchQuery ? () => setSearchQuery('') : openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = !isOutOfStock && product.stock <= product.minStockAlert;
            const totalItemValuation = product.price * product.stock;

            return (
              <div
                key={product.id}
                className={`p-4 sm:p-5 rounded-3xl bg-[#FFFDF8] border transition-all flex flex-col justify-between ${
                  isOutOfStock
                    ? 'border-red-300 bg-gradient-to-br from-[#FFFDF8] to-[#FFF5F5] shadow-2xs ring-1 ring-red-200'
                    : isLowStock
                    ? 'border-[#E8C2AC] bg-gradient-to-br from-[#FFFDF8] to-[#FCF6EE] shadow-2xs ring-1 ring-[#E8C2AC]'
                    : 'border-[#DFEBDC] hover:border-[#BED6B8] hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Bar: Category, Alert Badge & Name */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div>
                      <span className="text-[11px] font-bold text-[#7E56A0] bg-[#F3ECF8] px-2.5 py-1 rounded-lg border border-[#E4D5ED] uppercase tracking-wider inline-block mb-1.5">
                        {product.category}
                      </span>
                      <h3 className="font-serif font-black text-slate-900 text-lg leading-snug">
                        {product.name}
                      </h3>
                    </div>

                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-100 text-red-800 border border-red-200 shrink-0">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>¡Agotado!</span>
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FAF0E6] text-[#8D441F] border border-[#E8C2AC] shrink-0">
                        <AlertTriangle className="w-4 h-4 text-[#C47C56]" />
                        <span>Pocas existencias</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#EAF4E8] text-[#1E4D1A] border border-[#C5DEC1] shrink-0">
                        Disponible
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-slate-700 line-clamp-2 mb-3.5 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Financial & Stock Details Card Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] mb-3.5 text-center">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-500 block tracking-wider">
                        Precio Venta
                      </span>
                      <span className="text-sm sm:text-base font-serif font-black text-[#1F3D1B] mt-1 block truncate">
                        {formatCOP(product.price)}
                      </span>
                      <span className="text-xs text-slate-600">por {product.unit}</span>
                    </div>

                    <div className="border-x border-[#DFEBDC] px-1">
                      <span className="text-[11px] uppercase font-bold text-slate-500 block tracking-wider">
                        Existencias
                      </span>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <button
                          onClick={() => handleQuickStockChange(product, -1)}
                          disabled={product.stock <= 0}
                          className="w-8 h-8 rounded-xl bg-white border border-[#DFEBDC] text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center cursor-pointer shadow-2xs"
                          title="Restar 1 unidad"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                        <span className={`text-base font-serif font-black px-1 min-w-[28px] ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-[#C2673B]' : 'text-[#2D5A27]'}`}>
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleQuickStockChange(product, 1)}
                          className="w-8 h-8 rounded-xl bg-white border border-[#BED6B8] text-[#2D5A27] hover:text-[#1E441A] hover:bg-[#EAF4E8] flex items-center justify-center cursor-pointer shadow-2xs"
                          title="Sumar 1 unidad"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">{product.unit}(s)</span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-500 block tracking-wider">
                        Total Stock
                      </span>
                      <span className="text-sm sm:text-base font-serif font-black text-[#7E56A0] mt-1 block truncate">
                        {formatCOP(totalItemValuation)}
                      </span>
                      <span className="text-xs text-slate-600">en mercancía</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-[#DFEBDC] flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Alerta cuando queden {product.minStockAlert} o menos
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="px-3.5 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#EAF4E8] text-slate-800 hover:text-[#2D5A27] text-xs font-bold border border-[#DFEBDC] flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Editar datos del producto"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#3E7B32]" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 rounded-xl bg-[#FAF6ED] hover:bg-[#FDF2F2] text-slate-400 hover:text-[#DC2626] border border-[#DFEBDC] transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create or Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col border border-[#DFEBDC] overflow-hidden max-h-[92vh]">
            
            <div className="px-6 py-4 bg-gradient-to-r from-[#2D5A27] to-[#366E3A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Boxes className="w-5 h-5 text-[#A7F3D0]" />
                <h3 className="font-serif font-bold text-base">
                  {editingProduct ? 'Editar Producto Rural' : 'Registrar Nuevo Producto'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
              
              <div>
                <label className="block font-bold text-slate-800 mb-1 text-sm">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Arequipe en Paila de Cobre, Mochila de Fique, Menta Orgánica"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-base text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 text-sm">
                  Descripción y forma de elaboración
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Hecho a fuego lento con fruta fresca de la huerta, sin conservantes."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 text-sm">
                    Precio por Unidad ($ COP) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    placeholder="12000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-base font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 text-sm">
                    Cantidad Disponible *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="15"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-base font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 text-sm">
                    ¿Cómo lo vendes? (Unidad) *
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as Product['unit'])}
                    className="w-full p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-base text-slate-900"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 text-sm">
                    Avisarme si quedan menos de:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formMinAlert}
                    onChange={(e) => setFormMinAlert(Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-base font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 text-sm">
                  Categoría del Emprendimiento *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                  className="w-full p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-base text-slate-900"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#366E3A] hover:from-[#255020] hover:to-[#34692A] text-white font-bold shadow-md cursor-pointer text-sm"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Registrar en Inventario'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
