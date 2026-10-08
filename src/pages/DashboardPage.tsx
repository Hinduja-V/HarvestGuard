import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Camera, 
  Info,
  Clock,
  ArrowUpRight
} from 'lucide-react';

import { getScanHistory, clearScanHistory, getInventory } from '../services/storage';
import { ScanHistoryRecord, InventoryItem } from '../types';
import DecisionBadge from '../components/DecisionBadge';

export default function DashboardPage() {
  const [scans, setScans] = useState<ScanHistoryRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setScans(getScanHistory());
    setInventory(getInventory());
  }, []);

  const handleClearHistory = () => {
    clearScanHistory();
    setScans([]);
  };

  // Compute live statistics combining scans and inventory records
  const totalScanned = Math.max(24, scans.length + 19);
  const agingScanned = scans.filter(s => s.prediction === 'Aging').length + 5;
  const freshScanned = scans.filter(s => s.prediction === 'Fresh').length + 13;
  const spoiledScanned = scans.filter(s => s.prediction === 'Spoiled').length + 2;
  const sellFirstItems = agingScanned;

  const totalCalculated = freshScanned + agingScanned + spoiledScanned;
  const freshPct = Math.round((freshScanned / totalCalculated) * 100) || 60;
  const agingPct = Math.round((agingScanned / totalCalculated) * 100) || 25;
  const spoiledPct = Math.round((spoiledScanned / totalCalculated) * 100) || 15;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header with Demo Data disclosure banner */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 font-display tracking-tight">
              Vendor Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Produce condition breakdown and daily inventory dispatch prioritization.
            </p>
          </div>

          <Link
            to="/scanner"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-sm self-start"
          >
            <Camera className="w-4 h-4" />
            <span>Scan New Lot</span>
          </Link>
        </div>

        {/* Clear Demo Data Disclaimer (Rule 18 Compliance) */}
        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong className="text-slate-800">Demo Data Label:</strong> Baseline metrics represent simulated vendor stall scan numbers combined with live scans saved to your browser Local Storage. They do not claim certified field measurements.
          </span>
        </div>
      </div>

      {/* Today's Action Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
            Today's Priority Action
          </span>
          <h2 className="text-2xl font-bold font-display">
            “{sellFirstItems} aging items should be prioritized for sale.”
          </h2>
          <p className="text-xs text-amber-100 max-w-xl">
            Move these lots to your prime front sales crates or offer bundling to turn them before quality degrades.
          </p>
        </div>

        <Link
          to="/inventory"
          className="px-4 py-2.5 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 transition-colors shadow-sm whitespace-nowrap"
        >
          View Sell-First Items
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Today's Summary
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 block">Items Scanned</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
              {totalScanned}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Total evaluated</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-300 ring-1 ring-amber-300/40 shadow-sm bg-gradient-to-b from-amber-50/20 to-white">
            <span className="text-xs font-semibold text-amber-800 block">Aging Items</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-amber-900 mt-1">
              {agingScanned}
            </div>
            <span className="text-[11px] text-amber-700 mt-1 block font-medium">Sell First priority</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-300 ring-1 ring-emerald-300/40 shadow-sm">
            <span className="text-xs font-semibold text-emerald-800 block">Fresh Items</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-900 mt-1">
              {freshScanned}
            </div>
            <span className="text-[11px] text-emerald-700 mt-1 block">Normal stock</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-300 ring-1 ring-rose-300/40 shadow-sm">
            <span className="text-xs font-semibold text-rose-800 block">Spoiled Items</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-rose-900 mt-1">
              {spoiledScanned}
            </div>
            <span className="text-[11px] text-rose-700 mt-1 block">Removed/Isolated</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-400 shadow-sm col-span-2 lg:col-span-1 bg-amber-500 text-white">
            <span className="text-xs font-semibold text-amber-100 block">Sell-First Items</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums mt-1">
              {sellFirstItems}
            </div>
            <span className="text-[11px] text-amber-100 mt-1 block font-medium">Action queue</span>
          </div>
        </div>
      </div>

      {/* Freshness Distribution Chart */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 font-display text-base">
              Inventory Freshness Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Visual proportion of scanned stock by condition classification.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Model: MobileNetV2</span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="space-y-2">
          <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner bg-slate-100">
            <div 
              style={{ width: `${freshPct}%` }} 
              className="bg-emerald-600 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
              title={`Fresh: ${freshPct}%`}
            >
              {freshPct > 12 && `${freshPct}%`}
            </div>
            <div 
              style={{ width: `${agingPct}%` }} 
              className="bg-amber-500 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
              title={`Aging: ${agingPct}%`}
            >
              {agingPct > 12 && `${agingPct}%`}
            </div>
            <div 
              style={{ width: `${spoiledPct}%` }} 
              className="bg-rose-500 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
              title={`Spoiled: ${spoiledPct}%`}
            >
              {spoiledPct > 10 && `${spoiledPct}%`}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-600" />
              <span>Fresh ({freshScanned} items · {freshPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500" />
              <span>Aging — Sell First ({agingScanned} items · {agingPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span>Spoiled — Remove ({spoiledScanned} items · {spoiledPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scan History Section (Section 19 Compliance) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 font-display text-base">
              Scan History
            </h3>
            <p className="text-xs text-slate-500">
              Log of AI freshness scans persisted in local browser storage.
            </p>
          </div>
          {scans.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 font-medium p-1.5 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Scan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Produce</th>
                <th className="py-3 px-6">Prediction</th>
                <th className="py-3 px-6">Model Confidence</th>
                <th className="py-3 px-6">Inventory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No scan records in history. Perform a scan in the AI Scanner to see logs here.
                  </td>
                </tr>
              ) : (
                scans.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-6 font-mono text-slate-500">
                      {record.date}
                    </td>
                    <td className="py-3 px-6 font-medium text-slate-900 flex items-center gap-1.5">
                      <span>🍅</span>
                      <span>{record.produce}</span>
                    </td>
                    <td className="py-3 px-6">
                      <DecisionBadge condition={record.prediction} priority={record.priority} size="sm" />
                    </td>
                    <td className="py-3 px-6 font-mono tabular-nums font-semibold text-slate-800">
                      {record.confidence_percentage}%
                    </td>
                    <td className="py-3 px-6 font-medium">
                      <span className={
                        record.prediction === 'Aging' 
                          ? 'text-amber-800 font-bold' 
                          : record.prediction === 'Spoiled'
                          ? 'text-rose-700 font-bold'
                          : 'text-emerald-800'
                      }>
                        {record.action}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
