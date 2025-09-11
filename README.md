# XMP Property Explorer

A modern web application for exploring and managing XMP (Extensible Metadata Platform) properties. Built with SvelteKit, this tool provides an intuitive interface for browsing, filtering, and analyzing XMP metadata properties across different namespaces and categories.

## Features

- **Comprehensive Property Database**: Pre-loaded with 100+ XMP properties from major schemas including:
  - Dublin Core Elements & Terms
  - XMP Core, Media Management, Job Ticket
  - XMP Paged-Text, Dynamic Media, Rights Management
  - EXIF properties

- **Advanced Filtering & Search**:
  - Search by QName, description, or any text field
  - Filter by namespace, category, value form, and media type
  - Real-time filtering with instant results

- **Interactive Data Table**:
  - Sortable columns for easy organization
  - Detailed property information including QNames, namespaces, descriptions
  - Support for complex data types (structs, arrays, sequences)

- **Import & Export**:
  - Export filtered results to CSV or JSON
  - Import custom property sets from JSON files
  - RDF/XML import for extracting QNames from existing metadata

- **Modern UI**:
  - Clean, responsive design with Tailwind CSS
  - Dark/light theme toggle
  - shadcn-svelte components for consistent styling
  - Real-time statistics and property counts

## Tech Stack

- **Framework**: SvelteKit 2.x
- **Styling**: Tailwind CSS with shadcn-svelte components
- **Language**: TypeScript
- **Icons**: Lucide Svelte
- **State Management**: Svelte stores
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd xmp-explorer
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Browsing Properties

The main interface displays all XMP properties in a sortable table. Use the search bar to find specific properties by name or description.

### Filtering

Use the filter panel to narrow down results by:
- **Namespace**: Filter by property prefix (dc, dcterms, xmp, etc.)
- **Category**: Filter by schema category (Dublin Core, XMP Core, etc.)
- **Value Form**: Filter by data structure (simple, struct, array-bag, etc.)
- **Media Type**: Filter by applicable media (any, image, video, audio, document)

### Importing Data

1. **JSON Import**: Click the "Import" button to upload a JSON file containing XMP property definitions
2. **RDF/XML Import**: Paste RDF/XML content in the import section to automatically extract QNames

### Exporting Data

- **CSV Export**: Download filtered results as a CSV file
- **JSON Export**: Download filtered results as a JSON file

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── data-table.svelte
│   │   ├── property-filters.svelte
│   │   └── ui/             # shadcn-svelte components
│   ├── data/
│   │   └── xmp-properties.ts # Seed data with 100+ properties
│   ├── stores/             # Svelte stores for state management
│   │   ├── theme-store.ts
│   │   └── xmp-store.ts
│   ├── types/
│   │   └── xmp.ts          # TypeScript type definitions
│   └── utils/
│       ├── cn.ts           # Class name utility
│       └── xmp-helpers.ts  # XMP-specific utilities
└── routes/
    ├── +layout.svelte      # Root layout
    └── +page.svelte        # Main application page
```

## Building for Production

```bash
pnpm build
# or
npm run build
```

Preview the production build:
```bash
pnpm preview
# or
npm run preview
```

## Contributing

This project is designed for exploring and managing XMP properties. Contributions are welcome for:
- Adding new XMP property definitions
- Improving the filtering and search functionality
- Enhancing the import/export capabilities
- UI/UX improvements

## License

This project is open source and available under the MIT License.
