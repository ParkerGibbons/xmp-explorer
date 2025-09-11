export interface XmpProperty {
  qname: string;
  prefix: string;
  namespaceURI: string;
  category: 'Core' | 'Standard' | 'Specialized';
  valueType: string;
  valueForm: 'simple' | 'struct' | 'array-bag' | 'array-seq' | 'array-alt';
  description: string;
  mediaTags: string[];
  structFields?: Array<{
    name: string;
    type: string;
  }>;
  mapSequence?: string;
  notes?: string;
}

export interface FilterState {
  namespace: string;
  category: string;
  valueForm: string;
  media: string;
}

export interface Column {
  key: keyof XmpProperty;
  title: string;
  width?: number;
  sortable?: boolean;
}

export interface XmpStore {
  properties: XmpProperty[];
  filters: FilterState;
  searchQuery: string;
  addProperty: (property: XmpProperty) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setSearchQuery: (query: string) => void;
  exportToCSV: () => string;
  exportToJSON: () => string;
}
