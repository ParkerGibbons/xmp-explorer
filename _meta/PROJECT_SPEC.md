# XMP Property Explorer - Product Requirements Document

## Overview

The XMP Property Explorer is a modern web application for exploring, filtering, and managing XMP (Extensible Metadata Platform) properties. This document outlines the complete reconstruction of the application using TypeScript, Svelte 5, and modern interaction patterns.

## Technical Stack

### Core Technologies
- **Framework**: Svelte 5 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn-svelte components
- **State Management**: Svelte stores with runes
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + Testing Library

### Key Dependencies
```json
{
  "dependencies": {
    "svelte": "^5.0.0",
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "tailwindcss": "^3.4.0",
    "shadcn-svelte": "^0.0.1",
    "lucide-svelte": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/svelte": "^4.0.0"
  }
}
```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/                 # shadcn-svelte components
│   │   │   ├── button.svelte
│   │   │   ├── card.svelte
│   │   │   ├── input.svelte
│   │   │   ├── select.svelte
│   │   │   ├── table.svelte
│   │   │   └── textarea.svelte
│   │   ├── data-table.svelte   # Main data table component
│   │   ├── theme-toggle.svelte # Dark/light mode toggle
│   │   └── property-filters.svelte
│   ├── stores/
│   │   ├── xmp-store.ts        # Main application state
│   │   └── theme-store.ts      # Theme management
│   ├── types/
│   │   └── xmp.ts              # TypeScript definitions
│   ├── utils/
│   │   ├── cn.ts               # Class name utility
│   │   └── xmp-helpers.ts      # XMP data processing
│   └── data/
│       └── xmp-properties.ts   # Seed data
├── routes/
│   └── +page.svelte            # Main application page
├── app.html
└── app.css
```

## Core Features & Implementation

### 1. Data Management with Svelte 5 Runes

```typescript
// lib/stores/xmp-store.ts
import { writable, derived } from 'svelte/store';
import type { XmpProperty, FilterState } from '$lib/types/xmp';

interface XmpStore {
  properties: XmpProperty[];
  filters: FilterState;
  searchQuery: string;
  addProperty: (property: XmpProperty) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setSearchQuery: (query: string) => void;
  exportToCSV: () => string;
  exportToJSON: () => string;
}

export const xmpStore = writable<XmpStore>({
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
});

// Derived store for filtered properties
export const filteredProperties = derived(
  xmpStore,
  ($store) => {
    return $store.properties.filter(property => {
      // Filter logic implementation
      return matchesFilters(property, $store.filters, $store.searchQuery);
    });
  }
);
```

### 2. TypeScript Definitions

```typescript
// lib/types/xmp.ts
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
```

### 3. Main Application Component

```svelte
<!-- routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { xmpStore, filteredProperties } from '$lib/stores/xmp-store';
  import { themeStore } from '$lib/stores/theme-store';
  import DataTable from '$lib/components/data-table.svelte';
  import PropertyFilters from '$lib/components/property-filters.svelte';
  import ThemeToggle from '$lib/components/theme-toggle.svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card.svelte';
  import { Button } from '$lib/components/ui/button.svelte';
  import { Textarea } from '$lib/components/ui/textarea.svelte';
  import { exportToCSV, exportToJSON, addFromRdf } from '$lib/utils/xmp-helpers';
  
  let rdfText = $state('');
  let fileInput: HTMLInputElement;
  
  const columns: Column[] = [
    { key: 'qname', title: 'QName', width: 200, sortable: true },
    { key: 'prefix', title: 'Prefix', width: 90 },
    { key: 'namespaceURI', title: 'Namespace', width: 320 },
    { key: 'category', title: 'Category', width: 120, sortable: true },
    { key: 'valueType', title: 'Value Type', width: 200 },
    { key: 'valueForm', title: 'Value Form', width: 120 },
    { key: 'description', title: 'Description', width: 420 },
    { key: 'mediaTags', title: 'Media', width: 150 },
    { key: 'structFields', title: 'Struct Fields', width: 300 },
    { key: 'mapSequence', title: 'Map → Sequence', width: 220 },
    { key: 'notes', title: 'Notes', width: 220 }
  ];
  
  onMount(() => {
    // Initialize with seed data
    xmpStore.update(store => ({
      ...store,
      properties: seedData
    }));
  });
  
  function handleExportCSV() {
    const csv = exportToCSV($filteredProperties);
    downloadFile('xmp-properties.csv', csv, 'text/csv');
  }
  
  function handleExportJSON() {
    const json = exportToJSON($filteredProperties);
    downloadFile('xmp-properties.json', json, 'application/json');
  }
  
  function handleImportJSON(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          xmpStore.update(store => ({
            ...store,
            properties: [...store.properties, ...data]
          }));
        }
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  }
  
  function handleRdfExtract() {
    const count = addFromRdf(rdfText);
    if (count > 0) {
      rdfText = '';
      // Show success message
    }
  }
</script>

<div class="min-h-screen bg-background text-foreground">
  <div class="container mx-auto p-6 space-y-6">
    <!-- Header Card -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>XMP Property Explorer</CardTitle>
            <CardDescription>
              Explore and manage XMP properties with advanced filtering
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" onclick={handleExportCSV}>
              Export CSV
            </Button>
            <Button variant="outline" onclick={handleExportJSON}>
              Export JSON
            </Button>
            <input 
              bind:this={fileInput}
              type="file" 
              accept="application/json" 
              class="hidden" 
              onchange={handleImportJSON}
            />
            <Button variant="outline" onclick={() => fileInput.click()}>
              Import JSON
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- Filters Card -->
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <PropertyFilters />
      </CardContent>
    </Card>

    <!-- Data Table Card -->
    <Card>
      <CardHeader>
        <CardTitle>Properties ({$filteredProperties.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="h-[600px] overflow-auto">
          <DataTable {columns} data={$filteredProperties} />
        </div>
      </CardContent>
    </Card>

    <!-- RDF Import Card -->
    <Card>
      <CardHeader>
        <CardTitle>RDF/XML Import</CardTitle>
        <CardDescription>
          Paste RDF/XML to extract and add QNames
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Textarea
          bind:value={rdfText}
          placeholder="Paste RDF/XML…"
          class="min-h-[160px]"
        />
        <Button onclick={handleRdfExtract}>
          Extract & Add
        </Button>
        <p class="text-sm text-muted-foreground">
          Reference: Adobe XMP Spec and XMP Toolkit SDK.
        </p>
      </CardContent>
    </Card>
  </div>
</div>
```

### 4. Data Table Component with Svelte 5

```svelte
<!-- lib/components/data-table.svelte -->
<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table.svelte';
  import type { XmpProperty, Column } from '$lib/types/xmp';
  
  interface Props {
    columns: Column[];
    data: XmpProperty[];
    sortable?: boolean;
  }
  
  let { columns, data, sortable = true }: Props = $props();
  let sortColumn: keyof XmpProperty | null = $state(null);
  let sortDirection: 'asc' | 'desc' = $state('asc');
  
  $: sortedData = sortable && sortColumn 
    ? [...data].sort((a, b) => {
        const aVal = a[sortColumn!];
        const bVal = b[sortColumn!];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return aVal < bVal ? -1 * modifier : aVal > bVal ? 1 * modifier : 0;
      })
    : data;
  
  function handleSort(column: Column) {
    if (!column.sortable) return;
    
    if (sortColumn === column.key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column.key;
      sortDirection = 'asc';
    }
  }
  
  function formatCellValue(property: XmpProperty, key: keyof XmpProperty): string {
    const value = property[key];
    
    switch (key) {
      case 'mediaTags':
        return Array.isArray(value) ? value.join(', ') : String(value);
      case 'structFields':
        return Array.isArray(value) 
          ? value.map(f => `${f.name} — ${f.type}`).join('; ')
          : '—';
      default:
        return String(value || '');
    }
  }
</script>

<div class="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        {#each columns as column}
          <TableHead 
            class="font-medium {column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}"
            onclick={() => handleSort(column)}
          >
            {column.title}
            {#if sortColumn === column.key}
              <span class="ml-2">
                {sortDirection === 'asc' ? '↑' : '↓'}
              </span>
            {/if}
          </TableHead>
        {/each}
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each sortedData as property, index (property.qname)}
        <TableRow>
          {#each columns as column}
            <TableCell class="font-mono text-sm">
              <div 
                class="max-w-xs truncate" 
                title={formatCellValue(property, column.key)}
              >
                {formatCellValue(property, column.key)}
              </div>
            </TableCell>
          {/each}
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>
```

### 5. Theme Management

```typescript
// lib/stores/theme-store.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | 'system';

const getSystemTheme = (): 'light' | 'dark' => {
  if (!browser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const themeStore = writable<Theme>('system');

export const effectiveTheme = writable<'light' | 'dark'>('light');

themeStore.subscribe((theme) => {
  if (!browser) return;
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme);
    effectiveTheme.set(systemTheme);
  } else {
    root.classList.add(theme);
    effectiveTheme.set(theme);
  }
  
  localStorage.setItem('theme', theme);
});

// Initialize theme from localStorage
if (browser) {
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) {
    themeStore.set(stored);
  }
}
```

### 6. Property Filters Component

```svelte
<!-- lib/components/property-filters.svelte -->
<script lang="ts">
  import { xmpStore } from '$lib/stores/xmp-store';
  import { Input } from '$lib/components/ui/input.svelte';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select.svelte';
  import { debounce } from '$lib/utils/xmp-helpers';
  
  let searchQuery = $state('');
  
  const debouncedSearch = debounce((query: string) => {
    xmpStore.update(store => ({
      ...store,
      searchQuery: query
    }));
  }, 300);
  
  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
    debouncedSearch(target.value);
  }
  
  function handleFilterChange(filterType: string, value: string) {
    xmpStore.update(store => ({
      ...store,
      filters: {
        ...store.filters,
        [filterType]: value
      }
    }));
  }
  
  // Get unique values for filter options
  $: uniqueNamespaces = [...new Set($xmpStore.properties.map(p => p.prefix))].sort();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <div class="space-y-2">
    <label for="search-input" class="text-sm font-medium">
      Search
    </label>
    <Input
      id="search-input"
      placeholder="Search properties..."
      value={searchQuery}
      oninput={handleSearch}
    />
  </div>
  
  <div class="space-y-2">
    <label for="ns-filter" class="text-sm font-medium">
      Namespace
    </label>
    <Select onValueChange={(value) => handleFilterChange('namespace', value)}>
      <SelectTrigger>
        <SelectValue placeholder="All namespaces" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All namespaces</SelectItem>
        {#each uniqueNamespaces as namespace}
          <SelectItem value={namespace}>{namespace}</SelectItem>
        {/each}
      </SelectContent>
    </Select>
  </div>
  
  <div class="space-y-2">
    <label for="cat-filter" class="text-sm font-medium">
      Category
    </label>
    <Select onValueChange={(value) => handleFilterChange('category', value)}>
      <SelectTrigger>
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        <SelectItem value="Core">Core</SelectItem>
        <SelectItem value="Standard">Standard</SelectItem>
        <SelectItem value="Specialized">Specialized</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  <div class="space-y-2">
    <label for="form-filter" class="text-sm font-medium">
      Value Form
    </label>
    <Select onValueChange={(value) => handleFilterChange('valueForm', value)}>
      <SelectTrigger>
        <SelectValue placeholder="All value forms" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All value forms</SelectItem>
        <SelectItem value="simple">simple</SelectItem>
        <SelectItem value="struct">struct</SelectItem>
        <SelectItem value="array-bag">array-bag</SelectItem>
        <SelectItem value="array-seq">array-seq</SelectItem>
        <SelectItem value="array-alt">array-alt</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  <div class="space-y-2">
    <label for="media-filter" class="text-sm font-medium">
      Media
    </label>
    <Select onValueChange={(value) => handleFilterChange('media', value)}>
      <SelectTrigger>
        <SelectValue placeholder="Any media" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="any">Any media</SelectItem>
        <SelectItem value="video">Video</SelectItem>
        <SelectItem value="audio">Audio</SelectItem>
        <SelectItem value="image">Image</SelectItem>
        <SelectItem value="doc">Document</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

## Development Workflow

### 1. Project Setup
```bash
# Create SvelteKit project
npm create svelte@latest xmp-explorer
cd xmp-explorer

# Install dependencies
pnpm install

# Add Tailwind CSS
npx svelte-add@latest tailwindcss

# Add shadcn-svelte
npx shadcn-svelte@latest init

# Install additional dependencies
pnpm add lucide-svelte class-variance-authority clsx tailwind-merge
```

### 2. Configuration Files

**tailwind.config.js**
```javascript
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other colors
      },
      fontFamily: {
        sans: [...fontFamily.sans],
        mono: [...fontFamily.mono],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**vite.config.js**
```javascript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
```

### 3. Testing Strategy

```typescript
// src/lib/components/__tests__/data-table.test.ts
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import DataTable from '../data-table.svelte';
import type { XmpProperty } from '$lib/types/xmp';

const mockData: XmpProperty[] = [
  {
    qname: 'ex:test',
    prefix: 'ex',
    namespaceURI: 'http://example.org/',
    category: 'Core',
    valueType: 'Text',
    valueForm: 'simple',
    description: 'Test property',
    mediaTags: ['image'],
    structFields: [],
    mapSequence: '',
    notes: ''
  }
];

test('renders data table with properties', () => {
  render(DataTable, {
    props: {
      columns: [
        { key: 'qname', title: 'QName' },
        { key: 'prefix', title: 'Prefix' }
      ],
      data: mockData
    }
  });
  
  expect(screen.getByText('QName')).toBeInTheDocument();
  expect(screen.getByText('ex:test')).toBeInTheDocument();
});
```

## Performance Optimizations

### 1. Virtual Scrolling for Large Datasets
```svelte
<!-- lib/components/virtual-table.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  let { data, itemHeight = 40, containerHeight = 400 } = $props();
  let container: HTMLDivElement;
  let scrollTop = $state(0);
  
  $: visibleStart = Math.floor(scrollTop / itemHeight);
  $: visibleEnd = Math.min(visibleStart + Math.ceil(containerHeight / itemHeight), data.length);
  $: visibleData = data.slice(visibleStart, visibleEnd);
  
  function handleScroll(event: Event) {
    scrollTop = (event.target as HTMLDivElement).scrollTop;
  }
</script>

<div 
  bind:this={container}
  class="overflow-auto"
  style="height: {containerHeight}px"
  onscroll={handleScroll}
>
  <div style="height: {data.length * itemHeight}px; position: relative;">
    {#each visibleData as item, index (item.id)}
      <div 
        style="position: absolute; top: {(visibleStart + index) * itemHeight}px; height: {itemHeight}px; width: 100%;"
      >
        <!-- Item content -->
      </div>
    {/each}
  </div>
</div>
```

### 2. Debounced Search
```typescript
// lib/utils/debounce.ts
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
```

## Accessibility Features

### 1. Keyboard Navigation
- Full keyboard support for all interactive elements
- Tab order follows logical flow
- Escape key closes dropdowns and modals
- Arrow keys for table sorting

### 2. Screen Reader Support
- Proper ARIA labels and descriptions
- Table headers with scope attributes
- Live regions for dynamic content updates
- Focus management for modal interactions

### 3. Color Contrast
- WCAG AA compliant color schemes
- High contrast mode support
- Color-blind friendly palette

## Deployment

### 1. Build Configuration
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      handleHttpError: 'warn'
    }
  }
};

export default config;
```

### 2. Environment Variables
```bash
# .env
VITE_APP_TITLE=XMP Property Explorer
VITE_APP_VERSION=1.0.0
```

### 3. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - uses: actions/deploy-pages@v2
```

## Success Metrics

### 1. Performance
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3s

### 2. Accessibility
- Lighthouse accessibility score > 95
- All interactive elements keyboard accessible
- Screen reader compatibility verified

### 3. User Experience
- Responsive design on all device sizes
- Smooth theme transitions
- Intuitive filtering and search
- Fast data table rendering

This PRD provides a comprehensive blueprint for reconstructing the XMP Property Explorer using modern Svelte 5 patterns, TypeScript best practices, and excellent user experience design.