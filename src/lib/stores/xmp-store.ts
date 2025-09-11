import { writable, derived } from 'svelte/store';
import type { XmpProperty, FilterState, XmpStore } from '$lib/types/xmp';
import { matchesFilters, exportToCSV, exportToJSON } from '$lib/utils/xmp-helpers';

const initialStore: XmpStore = {
  properties: [],
  filters: {
    namespace: 'all',
    category: 'all',
    valueForm: 'all',
    media: 'any'
  },
  searchQuery: '',
  addProperty: () => {},
  updateFilters: () => {},
  setSearchQuery: () => {},
  exportToCSV: () => '',
  exportToJSON: () => ''
};

export const xmpStore = writable<XmpStore>(initialStore);

// Derived store for filtered properties
export const filteredProperties = derived(
  xmpStore,
  ($store) => {
    return $store.properties.filter(property => 
      matchesFilters(property, $store.filters, $store.searchQuery)
    );
  }
);

// Store methods
export function addProperty(property: XmpProperty) {
  xmpStore.update(store => ({
    ...store,
    properties: [...store.properties, property]
  }));
}

export function updateFilters(filters: Partial<FilterState>) {
  xmpStore.update(store => ({
    ...store,
    filters: { ...store.filters, ...filters }
  }));
}

export function setSearchQuery(query: string) {
  xmpStore.update(store => ({
    ...store,
    searchQuery: query
  }));
}

export function exportToCSVFromStore() {
  return exportToCSV($xmpStore.properties);
}

export function exportToJSONFromStore() {
  return exportToJSON($xmpStore.properties);
}

// Update the store with methods
xmpStore.update(store => ({
  ...store,
  addProperty,
  updateFilters,
  setSearchQuery,
  exportToCSV: exportToCSVFromStore,
  exportToJSON: exportToJSONFromStore
}));
