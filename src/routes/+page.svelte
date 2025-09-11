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
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
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
		Search,
		Settings,
		Table,
		X,
		ChevronDown,
		Import,
	} from 'lucide-svelte';

	let rdfText = $state('');
	let fileInput: HTMLInputElement;
	let downloadDropdownOpen = $state(false);

	const columns: Column[] = [
		{ key: 'qname', title: 'QName', width: 120, sortable: true },
		{ key: 'description', title: 'Description', width: 600 },
		{ key: 'prefix', title: 'Prefix', width: 80 },
		{ key: 'namespaceURI', title: 'Namespace', width: 280 },
		{ key: 'category', title: 'Category', width: 140, sortable: true },
		{ key: 'valueType', title: 'Value Type', width: 180 },
		{ key: 'valueForm', title: 'Value Form', width: 140 },
		{ key: 'mediaTags', title: 'Media', width: 180 },
		{ key: 'structFields', title: 'Struct Fields', width: 280 },
		{ key: 'mapSequence', title: 'Map → Sequence', width: 200 },
		{ key: 'notes', title: 'Notes', width: 200 },
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
		if (!rdfText.trim()) return;
		const count = addFromRdf(rdfText);
		if (count > 0) {
			rdfText = '';
			// Show success message
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.download-dropdown')) {
			downloadDropdownOpen = false;
		}
	}
</script>

<div
	class="min-h-screen bg-background text-foreground"
	onclick={handleClickOutside}
>
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
							<p class="text-xs text-muted-foreground/80">
								created by <a
									href="https://www.parker.mov"
									target="_blank"
									rel="noopener noreferrer"
									class="text-primary hover:underline font-medium"
									>parker.mov</a
								>
								• based on the
								<a
									href="https://developer.adobe.com/xmp/docs/"
									target="_blank"
									rel="noopener noreferrer"
									class="text-primary hover:underline font-medium"
									>Adobe XMP Specification</a
								>
							</p>
						</div>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<div class="relative download-dropdown">
						<Button
							variant="outline"
							size="sm"
							onclick={() =>
								(downloadDropdownOpen = !downloadDropdownOpen)}
						>
							<Download class="h-4 w-4 mr-2" />
							Download
							<ChevronDown class="h-4 w-4 ml-2" />
						</Button>
						{#if downloadDropdownOpen}
							<div
								class="absolute right-0 mt-2 w-40 bg-popover border rounded-md shadow-lg z-50"
							>
								<div class="py-1">
									<button
										class="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
										onclick={() => {
											handleExportCSV();
											downloadDropdownOpen = false;
										}}
									>
										<FileText class="h-4 w-4 mr-2" />
										Export CSV
									</button>
									<button
										class="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
										onclick={() => {
											handleExportJSON();
											downloadDropdownOpen = false;
										}}
									>
										<Download class="h-4 w-4 mr-2" />
										Export JSON
									</button>
								</div>
							</div>
						{/if}
					</div>
					<ThemeToggle />
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto p-6">
		<!-- Desktop: Sidebar + Table Layout | Mobile: Vertical Stack -->
		<div class="lg:grid lg:grid-cols-12 lg:gap-8 space-y-6 lg:space-y-0">
			<!-- Sidebar: Stats + Search (Desktop) | Stacked (Mobile) -->
			<div class="lg:col-span-4 xl:col-span-3 space-y-6">
				<!-- Stats Cards -->
				<div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
					<Card>
						<CardContent class="p-4 lg:p-6">
							<div class="flex items-center space-x-2">
								<Table class="h-4 w-4 text-muted-foreground" />
								<div>
									<p
										class="text-xs lg:text-sm font-medium text-muted-foreground"
									>
										Total Properties
									</p>
									<p class="text-lg lg:text-2xl font-bold">
										{$xmpStore.properties.length}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent class="p-4 lg:p-6">
							<div class="flex items-center space-x-2">
								<Filter class="h-4 w-4 text-muted-foreground" />
								<div>
									<p
										class="text-xs lg:text-sm font-medium text-muted-foreground"
									>
										Filtered Results
									</p>
									<p class="text-lg lg:text-2xl font-bold">
										{$filteredProperties.length}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent class="p-4 lg:p-6">
							<div class="flex items-center space-x-2">
								<Database
									class="h-4 w-4 text-muted-foreground"
								/>
								<div>
									<p
										class="text-xs lg:text-sm font-medium text-muted-foreground"
									>
										Namespaces
									</p>
									<p class="text-lg lg:text-2xl font-bold">
										{new Set(
											$xmpStore.properties.map(
												(p) => p.prefix
											)
										).size}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent class="p-4 lg:p-6">
							<div class="flex items-center space-x-2">
								<Settings
									class="h-4 w-4 text-muted-foreground"
								/>
								<div>
									<p
										class="text-xs lg:text-sm font-medium text-muted-foreground"
									>
										Categories
									</p>
									<p class="text-lg lg:text-2xl font-bold">
										{new Set(
											$xmpStore.properties.map(
												(p) => p.category
											)
										).size}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<!-- Filters Section -->
				<Card>
					<CardHeader class="pb-3">
						<div class="flex items-center space-x-2">
							<Search class="h-4 w-4" />
							<CardTitle class="text-base"
								>Search & Filters</CardTitle
							>
						</div>
						<CardDescription class="text-xs">
							Filter properties by category, type, and more
						</CardDescription>
					</CardHeader>
					<CardContent>
						<PropertyFilters />
					</CardContent>
				</Card>
			</div>

			<!-- Main Table Area -->
			<div class="lg:col-span-8 xl:col-span-9">
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
						<div class="h-[600px] lg:h-[700px] overflow-auto">
							<DataTable
								{columns}
								data={$filteredProperties}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- RDF Import Section -->
		<Card class="mt-6">
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
						class={!rdfText.trim()
							? 'opacity-50 cursor-not-allowed'
							: ''}
					>
						<Import class="h-4 w-4 mr-2" />
						Extract & Add Properties
					</Button>
					<p class="text-xs text-muted-foreground">
						Automatically extracts QNames from RDF/XML content
					</p>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
