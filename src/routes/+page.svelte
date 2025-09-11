<script lang="ts">
	import { onMount } from 'svelte';
	import { xmpStore, filteredProperties } from '$lib/stores/xmp-store';
	import { themeStore } from '$lib/stores/theme-store';
	import DataTable from '$lib/components/data-table.svelte';
	import PropertyFilters from '$lib/components/property-filters.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import {
		Alert,
		AlertDescription,
		AlertTitle,
		Badge,
		Button,
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
		Separator,
		Textarea,
		Tooltip,
	} from '$lib/components/ui';
	import {
		exportToCSV,
		exportToJSON,
		addFromRdf,
		downloadFile,
	} from '$lib/utils/xmp-helpers';
	import { seedData } from '$lib/data/xmp-properties';
	import type { Column } from '$lib/types/xmp';
	import {
		Database,
		Download,
		FileText,
		Filter,
		Import,
		Search,
		Settings,
		Table,
		Upload,
		X,
	} from 'lucide-svelte';

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
		{ key: 'notes', title: 'Notes', width: 220 },
	];

	onMount(() => {
		// Initialize with seed data
		xmpStore.update((store) => ({
			...store,
			properties: seedData,
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
					xmpStore.update((store) => ({
						...store,
						properties: [...store.properties, ...data],
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
	<!-- Header Section -->
	<div class="border-b bg-card">
		<div class="container mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div class="flex items-center space-x-2">
						<Database class="h-8 w-8 text-primary" />
						<div>
							<h1 class="text-2xl font-bold tracking-tight">
								XMP Property Explorer
							</h1>
							<p class="text-sm text-muted-foreground">
								Explore and manage XMP properties with advanced
								filtering
							</p>
						</div>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<Tooltip content="Export to CSV">
						<Button
							variant="outline"
							size="sm"
							onclick={handleExportCSV}
						>
							<Download class="h-4 w-4 mr-2" />
							CSV
						</Button>
					</Tooltip>
					<Tooltip content="Export to JSON">
						<Button
							variant="outline"
							size="sm"
							onclick={handleExportJSON}
						>
							<FileText class="h-4 w-4 mr-2" />
							JSON
						</Button>
					</Tooltip>
					<input
						bind:this={fileInput}
						type="file"
						accept="application/json"
						class="hidden"
						onchange={handleImportJSON}
					/>
					<Tooltip content="Import JSON file">
						<Button
							variant="outline"
							size="sm"
							onclick={() => fileInput.click()}
						>
							<Upload class="h-4 w-4 mr-2" />
							Import
						</Button>
					</Tooltip>
					<Separator
						orientation="vertical"
						class="h-6"
					/>
					<ThemeToggle />
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto p-6 space-y-6">
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center space-x-2">
						<Table class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Total Properties
							</p>
							<p class="text-2xl font-bold">
								{$xmpStore.properties.length}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center space-x-2">
						<Filter class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Filtered Results
							</p>
							<p class="text-2xl font-bold">
								{$filteredProperties.length}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center space-x-2">
						<Database class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Namespaces
							</p>
							<p class="text-2xl font-bold">
								{new Set(
									$xmpStore.properties.map((p) => p.prefix)
								).size}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center space-x-2">
						<Settings class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Categories
							</p>
							<p class="text-2xl font-bold">
								{new Set(
									$xmpStore.properties.map((p) => p.category)
								).size}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Filters Section -->
		<Card>
			<CardHeader>
				<div class="flex items-center space-x-2">
					<Search class="h-5 w-5" />
					<CardTitle>Search & Filters</CardTitle>
				</div>
				<CardDescription>
					Use the filters below to narrow down your search results
				</CardDescription>
			</CardHeader>
			<CardContent>
				<PropertyFilters />
			</CardContent>
		</Card>

		<!-- Data Table Section -->
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<Table class="h-5 w-5" />
						<CardTitle>Properties</CardTitle>
						<Badge variant="secondary"
							>{$filteredProperties.length} results</Badge
						>
					</div>
					<div class="flex items-center space-x-2">
						{#if $xmpStore.searchQuery || $xmpStore.filters.namespace !== 'all' || $xmpStore.filters.category !== 'all' || $xmpStore.filters.valueForm !== 'all' || $xmpStore.filters.media !== 'any'}
							<Button
								variant="ghost"
								size="sm"
								onclick={() => {
									xmpStore.update((store) => ({
										...store,
										searchQuery: '',
										filters: {
											namespace: 'all',
											category: 'all',
											valueForm: 'all',
											media: 'any',
										},
									}));
								}}
							>
								<X class="h-4 w-4 mr-2" />
								Clear Filters
							</Button>
						{/if}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div class="h-[600px] overflow-auto">
					<DataTable
						{columns}
						data={$filteredProperties}
					/>
				</div>
			</CardContent>
		</Card>

		<!-- RDF Import Section -->
		<Card>
			<CardHeader>
				<div class="flex items-center space-x-2">
					<Import class="h-5 w-5" />
					<CardTitle>RDF/XML Import</CardTitle>
				</div>
				<CardDescription>
					Paste RDF/XML content to automatically extract and add
					QNames
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<Alert>
					<AlertTitle>How it works</AlertTitle>
					<AlertDescription>
						Paste RDF/XML content below and click "Extract & Add" to
						automatically extract QNames and add them to your
						property collection. This is useful for importing
						properties from existing XMP metadata.
					</AlertDescription>
				</Alert>
				<Textarea
					bind:value={rdfText}
					placeholder="Paste your RDF/XML content here..."
					class="min-h-[160px] font-mono text-sm"
				/>
				<div class="flex items-center justify-between">
					<Button
						onclick={handleRdfExtract}
						disabled={!rdfText.trim()}
					>
						<Import class="h-4 w-4 mr-2" />
						Extract & Add Properties
					</Button>
					<p class="text-xs text-muted-foreground">
						Reference: Adobe XMP Specification
					</p>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
