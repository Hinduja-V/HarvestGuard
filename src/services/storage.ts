import { InventoryItem, ScanHistoryRecord } from '../types';

const STORAGE_KEY_INVENTORY = 'harvestguard_inventory_v1';
const STORAGE_KEY_SCANS = 'harvestguard_scans_v1';

// Initial realistic baseline demo records for small produce vendors
const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    produce: 'Tomato',
    variety: 'Roma / Saladette',
    quantity: 12,
    unit: 'kg',
    condition: 'Aging',
    priority: 'HIGH',
    action: 'SELL_FIRST',
    confidence_percentage: 87,
    scanned_at: '2026-10-08T07:15:00Z',
    notes: 'Softening skin noted. Position in front display crate.'
  },
  {
    id: 'inv-2',
    produce: 'Tomato',
    variety: 'Local Vine-Ripened',
    quantity: 28,
    unit: 'kg',
    condition: 'Fresh',
    priority: 'NORMAL',
    action: 'REGULAR_STOCK',
    confidence_percentage: 95,
    scanned_at: '2026-10-08T06:30:00Z',
    notes: 'Firm texture, green calyx attached. Keep in standard shelf stock.'
  },
  {
    id: 'inv-3',
    produce: 'Tomato',
    variety: 'Round Red',
    quantity: 6,
    unit: 'kg',
    condition: 'Aging',
    priority: 'HIGH',
    action: 'SELL_FIRST',
    confidence_percentage: 84,
    scanned_at: '2026-10-07T16:20:00Z',
    notes: 'Mild wrinkling around shoulder. Apply bundle discount or quick sale.'
  },
  {
    id: 'inv-4',
    produce: 'Tomato',
    variety: 'Standard Salad',
    quantity: 3,
    unit: 'kg',
    condition: 'Spoiled',
    priority: 'REMOVE',
    action: 'SEPARATE_STOCK',
    confidence_percentage: 92,
    scanned_at: '2026-10-07T14:45:00Z',
    notes: 'Localized fungal lesions detected. Segregated for organic composting.'
  },
  {
    id: 'inv-5',
    produce: 'Tomato',
    variety: 'Cherry Cluster',
    quantity: 15,
    unit: 'kg',
    condition: 'Fresh',
    priority: 'NORMAL',
    action: 'REGULAR_STOCK',
    confidence_percentage: 93,
    scanned_at: '2026-10-08T06:40:00Z',
    notes: 'Crisp and lustrous skin. Standard retail selling.'
  }
];

const INITIAL_SCANS: ScanHistoryRecord[] = [
  {
    id: 'scan-1',
    date: '08 Oct 2026',
    produce: 'Tomato',
    prediction: 'Aging',
    confidence_percentage: 87,
    action: 'Sell First',
    priority: 'HIGH',
    recommendation: 'SELL FIRST',
    is_low_confidence: false
  },
  {
    id: 'scan-2',
    date: '08 Oct 2026',
    produce: 'Tomato',
    prediction: 'Fresh',
    confidence_percentage: 94,
    action: 'Normal',
    priority: 'NORMAL',
    recommendation: 'Regular Selling',
    is_low_confidence: false
  },
  {
    id: 'scan-3',
    date: '07 Oct 2026',
    produce: 'Tomato',
    prediction: 'Spoiled',
    confidence_percentage: 91,
    action: 'Remove',
    priority: 'REMOVE',
    recommendation: 'Remove from sellable stock',
    is_low_confidence: false
  },
  {
    id: 'scan-4',
    date: '07 Oct 2026',
    produce: 'Tomato',
    prediction: 'Aging',
    confidence_percentage: 82,
    action: 'Sell First',
    priority: 'HIGH',
    recommendation: 'SELL FIRST',
    is_low_confidence: false
  },
  {
    id: 'scan-5',
    date: '07 Oct 2026',
    produce: 'Tomato',
    prediction: 'Fresh',
    confidence_percentage: 96,
    action: 'Normal',
    priority: 'NORMAL',
    recommendation: 'Regular Selling',
    is_low_confidence: false
  }
];

export function getInventory(): InventoryItem[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVENTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read inventory from local storage:', err);
    return INITIAL_INVENTORY;
  }
}

export function saveInventoryItem(item: InventoryItem): InventoryItem[] {
  const current = getInventory();
  const updated = [item, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist inventory item:', err);
  }
  return updated;
}

export function deleteInventoryItem(id: string): InventoryItem[] {
  const current = getInventory();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete inventory item:', err);
  }
  return updated;
}

export function resetInventoryToDemo(): InventoryItem[] {
  try {
    localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(INITIAL_INVENTORY));
  } catch (err) {
    console.error('Failed to reset inventory:', err);
  }
  return INITIAL_INVENTORY;
}

export function getScanHistory(): ScanHistoryRecord[] {
  if (typeof window === 'undefined') return INITIAL_SCANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SCANS, JSON.stringify(INITIAL_SCANS));
      return INITIAL_SCANS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read scans from local storage:', err);
    return INITIAL_SCANS;
  }
}

export function addScanRecord(scan: ScanHistoryRecord): ScanHistoryRecord[] {
  const current = getScanHistory();
  const updated = [scan, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_SCANS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save scan record:', err);
  }
  return updated;
}

export function clearScanHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY_SCANS, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear scan history:', err);
  }
}
