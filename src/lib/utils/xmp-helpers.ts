import type { XmpProperty, FilterState } from '$lib/types/xmp';

export function matchesFilters(
  property: XmpProperty,
  filters: FilterState,
  searchQuery: string
): boolean {
  // Search query filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const searchableFields = [
      property.qname,
      property.prefix,
      property.namespaceURI,
      property.description,
      property.valueType,
      property.notes || ''
    ].join(' ').toLowerCase();
    
    if (!searchableFields.includes(query)) {
      return false;
    }
  }

  // Namespace filter
  if (filters.namespace !== 'all' && property.prefix !== filters.namespace) {
    return false;
  }

  // Category filter
  if (filters.category !== 'all' && property.category !== filters.category) {
    return false;
  }

  // Value form filter
  if (filters.valueForm !== 'all' && property.valueForm !== filters.valueForm) {
    return false;
  }

  // Media filter
  if (filters.media !== 'any') {
    if (!property.mediaTags.includes(filters.media)) {
      return false;
    }
  }

  return true;
}

export function exportToCSV(properties: XmpProperty[]): string {
  const headers = [
    'QName',
    'Prefix',
    'Namespace URI',
    'Category',
    'Value Type',
    'Value Form',
    'Description',
    'Media Tags',
    'Struct Fields',
    'Map Sequence',
    'Notes'
  ];

  const rows = properties.map(property => [
    property.qname,
    property.prefix,
    property.namespaceURI,
    property.category,
    property.valueType,
    property.valueForm,
    property.description,
    property.mediaTags.join(', '),
    property.structFields?.map(f => `${f.name} — ${f.type}`).join('; ') || '',
    property.mapSequence || '',
    property.notes || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
}

export function exportToJSON(properties: XmpProperty[]): string {
  return JSON.stringify(properties, null, 2);
}

export function addFromRdf(rdfText: string): number {
  // Basic RDF/XML parsing to extract QNames
  // This is a simplified implementation
  const qnameRegex = /<([^:>]+):([^>]+)>/g;
  const matches = rdfText.match(qnameRegex);
  
  if (!matches) return 0;

  const extractedProperties: XmpProperty[] = [];
  const seen = new Set<string>();

  matches.forEach(match => {
    const qname = match.slice(1, -1); // Remove < and >
    if (seen.has(qname)) return;
    seen.add(qname);

    const [prefix, localName] = qname.split(':');
    if (!prefix || !localName) return;

    extractedProperties.push({
      qname,
      prefix,
      namespaceURI: `http://example.org/${prefix}/`,
      category: 'Standard',
      valueType: 'Text',
      valueForm: 'simple',
      description: `Extracted from RDF: ${qname}`,
      mediaTags: ['any'],
      notes: 'Auto-extracted from RDF/XML'
    });
  });

  return extractedProperties.length;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
