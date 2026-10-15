import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Filter,
  ArrowRight
} from 'lucide-react';

import { 
  getInventory, 
  deleteInventoryItem, 
  resetInventoryToDemo, 
  saveInventoryItem 
} from '../services/storage';
import { InventoryItem, TomatoCondition } from '../types';
import DecisionBadge from '../components/DecisionBadge';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'SELL_FIRST' | 'REGULAR' | 'REMOVE'>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form state
  const [newVariety, setNewVariety] = useState<string>('Standard Red');
  const [newQuantity, setNewQuantity] = useState<number>(10);
  const [newUnit, setNewUnit] = useState<string>('kg');
  const [newCondition, setNewCondition] = useState<TomatoCondition>('Aging');
  const [newNotes, setNewNotes] = useState<string>('Prioritize for morning display');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    setItems(getInventory());
  };

  const handleDelete = (id: string) => {
    const updated = deleteInventoryItem(id);
    setItems(updated);
  };

  const handleReset = () => {
    const reset = resetInventoryToDemo();
    setItems(reset);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priority = newCondition === 'Aging' ? 'HIGH' : newCondition === 'Spoiled' ? 'REMOVE' : 'NORMAL';
    const action = newCondition === 'Aging' ? 'SELL_FIRST' : newCondition === 'Spoiled' ? 'SEPARATE_STOCK' : 'REGULAR_STOCK';

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      produce: 'Tomato',
      variety: newVariety,
      quantity: Number(newQuantity) || 1,
      unit: newUnit,
      condition: newCondition,
      priority,
      action,
      confidence_percentage: 90,
      scanned_at: new Date().toISOString(),
      notes: newNotes
    };

    saveInventoryItem(newItem);
    loadItems();
    setShowAddModal(false);
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'SELL_FIRST') return item.action === 'SELL_FIRST';
    if (filter === 'REGULAR') return item.action === 'REGULAR_STOCK';
    if (filter === 'REMOVE') return item.action === 'SEPARATE_STOCK';
    return true;
  });

  const sellFirstCount = items.filter(i => i.action === 'SELL_FIRST').length;
  const regularCount = items.filter(i => i.action === 'REGULAR_STOCK').length;
  const removeCount = items.filter(i => i.action === 'SEPARATE_STOCK').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 font-display tracking-tight">
            Sell-First Inventory
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            “HarvestGuard helps you prioritize aging produce before it becomes unsellable.”
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Batch</span>
          </button>

          <Link
            to="/scanner"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Scan Produce</span>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            title="Reset to sample demo records"
            className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Lots ({items.length})
        </button>

        <button
          onClick={() => setFilter('SELL_FIRST')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            filter === 'SELL_FIRST'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Sell First ({sellFirstCount})</span>
        </button>

        <button
          onClick={() => setFilter('REGULAR')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            filter === 'REGULAR'
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Regular Stock ({regularCount})</span>
        </button>

        <button
          onClick={() => setFilter('REMOVE')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            filter === 'REMOVE'
              ? 'bg-rose-700 text-white'
              : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Remove ({removeCount})</span>
        </button>
      </div>

      {/* Cards List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 font-display text-lg">No inventory lots found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Scan new produce with the AI Produce Scanner or add a manual inventory batch.
          </p>
          <div className="pt-2">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
            >
              <Camera className="w-4 h-4" />
              <span>Go to AI Scanner</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                item.action === 'SELL_FIRST'
                  ? 'border-amber-300 ring-1 ring-amber-300/40 bg-gradient-to-b from-amber-50/20 to-white'
                  : item.action === 'SEPARATE_STOCK'
                  ? 'border-rose-300 ring-1 ring-rose-300/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top: Produce & Decision Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">
                        {item.produce === 'Potato' ? '🥔' : '🍅'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base font-display">
                        {item.produce}
                      </h3>
                    </div>
                    {item.variety && (
                      <p className="text-xs text-slate-500">{item.variety}</p>
                    )}
                  </div>
                  <DecisionBadge condition={item.condition} priority={item.priority} size="sm" />
                </div>

                {/* Quantitative Metric */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Batch Quantity</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] uppercase">Model Confidence</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-700">
                      {item.confidence_percentage}%
                    </span>
                  </div>
                </div>

                {/* Sell-First Action Callout */}
                <div className={`p-3 rounded-xl text-xs space-y-1 ${
                  item.action === 'SELL_FIRST'
                    ? 'bg-amber-100/70 text-amber-950 font-medium'
                    : item.action === 'SEPARATE_STOCK'
                    ? 'bg-rose-100/70 text-rose-950 font-medium'
                    : 'bg-emerald-50 text-emerald-950 font-medium'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {item.action === 'SELL_FIRST' && '🟠 Action: Sell First'}
                      {item.action === 'REGULAR_STOCK' && '🟢 Action: Regular Stock'}
                      {item.action === 'SEPARATE_STOCK' && '🔴 Action: Separate Stock'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    {item.notes || 'Prioritize according to AI condition classification.'}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {new Date(item.scanned_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                  title="Remove from inventory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg font-display">
                Add Inventory Batch
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Produce
                </label>
                <input
                  type="text"
                  disabled
                  value="Tomato (MVP Supported)"
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Variety / Lot Label
                </label>
                <input
                  type="text"
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                  placeholder="e.g. Roma, Local Vine, Hybrid"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Unit
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="crates">crates</option>
                    <option value="boxes">boxes</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Visual Condition Classification
                </label>
                <select
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value as TomatoCondition)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
                >
                  <option value="Fresh">🟢 Fresh (Priority: NORMAL)</option>
                  <option value="Aging">🟠 Aging (Priority: HIGH · SELL FIRST)</option>
                  <option value="Spoiled">🔴 Spoiled (Priority: REMOVE)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Vendor Notes / Stall Placement
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Place on front table, discount 15%"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 shadow-sm"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
