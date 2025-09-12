<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { xmpStore, filteredProperties } from '$lib/stores/xmp-store';
	import { themeStore } from '$lib/stores/theme-store';
	import DataTable from '$lib/components/data-table.svelte';
	import PropertyFilters from '$lib/components/property-filters.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent,
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
		BookOpen,
		ChevronRight,
	} from 'lucide-svelte';

	let rdfText = $state('');
	let fileInput: HTMLInputElement;
	let downloadDropdownOpen = $state(false);
	let xmpGuideOpen = $state(false);
	let accordionOpen = $state({
		what: false,
		video: false,
		properties: false,
		workflow: false,
	});

	const columns: Column[] = [
		{ key: 'qname', title: 'QName', width: 120, sortable: true },
		{ key: 'description', title: 'Description', width: 320 },
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

	<!-- XMP Crash Course Guide -->
	<div class="border-b bg-background-secondary shadow-sm">
		<div class="container mx-auto px-4">
			<!-- Main Guide Toggle -->
			<button
				class="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:bg-muted/30 rounded-lg px-2"
				onclick={() => (xmpGuideOpen = !xmpGuideOpen)}
			>
				<div class="flex items-center space-x-3">
					<BookOpen class="h-5 w-5 text-primary" />
					<div>
						<h3 class="font-semibold text-base">
							XMP Crash Course
						</h3>
						<p class="text-sm text-muted-foreground">
							Learn how XMP works in video post production
							workflows
						</p>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<Badge
						variant="outline"
						class="text-xs"
					>
						{xmpGuideOpen ? 'Hide Guide' : 'Show Guide'}
					</Badge>
					<ChevronRight
						class="h-4 w-4 transition-transform duration-200 {xmpGuideOpen
							? 'rotate-90'
							: ''}"
					/>
				</div>
			</button>

			<!-- Collapsible Guide Content -->
			{#if xmpGuideOpen}
				<div
					class="pb-4"
					transition:slide={{ duration: 300 }}
				>
					<Accordion>
						<AccordionItem value="what-is-xmp">
							<AccordionTrigger
								isOpen={accordionOpen.what}
								onclick={() =>
									(accordionOpen.what = !accordionOpen.what)}
							>
								<div class="flex items-center space-x-3">
									<div
										class="h-2 w-2 bg-primary rounded-full"
									></div>
									<span class="font-semibold"
										>What is XMP?</span
									>
								</div>
							</AccordionTrigger>
							<AccordionContent isOpen={accordionOpen.what}>
								<div class="prose prose-sm max-w-none">
									<p
										class="text-muted-foreground leading-relaxed"
									>
										<strong
											>XMP (Extensible Metadata Platform)</strong
										> is Adobe's open-source standard for embedding
										metadata directly into media files. Think
										of it as a "digital passport" that travels
										with your content, storing everything from
										camera settings and color profiles to custom
										workflow data and rights management information.
									</p>
									<p
										class="text-muted-foreground leading-relaxed mt-3"
									>
										Unlike traditional metadata that lives
										in separate sidecar files, XMP is
										embedded within the file itself (in
										dedicated metadata sections that don't
										affect the media content), ensuring
										metadata never gets separated from your
										assets.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="video-post">
							<AccordionTrigger
								isOpen={accordionOpen.video}
								onclick={() =>
									(accordionOpen.video =
										!accordionOpen.video)}
							>
								<div class="flex items-center space-x-3">
									<div
										class="h-2 w-2 bg-green-500 rounded-full"
									></div>
									<span class="font-semibold"
										>XMP in Video Post Production</span
									>
								</div>
							</AccordionTrigger>
							<AccordionContent isOpen={accordionOpen.video}>
								<div class="prose prose-sm max-w-none">
									<p
										class="text-muted-foreground leading-relaxed"
									>
										In video post production, XMP becomes
										your <strong>workflow backbone</strong>:
									</p>
									<ul
										class="text-muted-foreground leading-relaxed mt-3 space-y-2 list-disc list-inside"
									>
										<li>
											<strong
												>Timeline Markers & Comments:</strong
											> Store edit points, review notes, and
											approval status
										</li>
										<li>
											<strong>Color Grading Data:</strong>
											Preserve LUT assignments, color correction
											values, and grading notes
										</li>
										<li>
											<strong>Audio Sync Info:</strong> Maintain
											timecode relationships and audio channel
											mappings
										</li>
										<li>
											<strong>Project Context:</strong> Track
											which scenes, takes, and camera angles
											belong together
										</li>
										<li>
											<strong>Delivery Specs:</strong> Embed
											output requirements, codec preferences,
											and client specifications
										</li>
										<li>
											<strong>Rights & Usage:</strong> Document
											licensing terms, usage restrictions,
											and contributor credits
										</li>
									</ul>
									<p
										class="text-muted-foreground leading-relaxed mt-3"
									>
										Tools like <strong
											>Adobe Premiere Pro</strong
										>,
										<strong>DaVinci Resolve</strong>, and
										<strong>Avid Media Composer</strong> all
										read and write XMP data, making it essential
										for collaborative workflows.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="properties-explained">
							<AccordionTrigger
								isOpen={accordionOpen.properties}
								onclick={() =>
									(accordionOpen.properties =
										!accordionOpen.properties)}
							>
								<div class="flex items-center space-x-3">
									<div
										class="h-2 w-2 bg-blue-500 rounded-full"
									></div>
									<span class="font-semibold"
										>Understanding XMP Properties</span
									>
								</div>
							</AccordionTrigger>
							<AccordionContent isOpen={accordionOpen.properties}>
								<div class="prose prose-sm max-w-none">
									<p
										class="text-muted-foreground leading-relaxed"
									>
										XMP properties are organized into <strong
											>namespaces</strong
										> (like dc: for Dublin Core, xmp: for core
										XMP). Each property has:
									</p>
									<div
										class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
									>
										<div
											class="bg-background border rounded-lg p-3"
										>
											<h4
												class="font-semibold text-sm mb-2"
											>
												Property Structure
											</h4>
											<ul
												class="text-xs text-muted-foreground space-y-1 list-disc list-inside"
											>
												<li>
													<strong>QName:</strong> Qualified
													name (e.g., dc:title)
												</li>
												<li>
													<strong>Value Type:</strong>
													Text, Date, Integer, etc.
												</li>
												<li>
													<strong>Value Form:</strong>
													Simple, Array, or Struct
												</li>
												<li>
													<strong>Description:</strong
													> What it stores
												</li>
											</ul>
										</div>
										<div
											class="bg-background border rounded-lg p-3"
										>
											<h4
												class="font-semibold text-sm mb-2"
											>
												Common Video Properties
											</h4>
											<ul
												class="text-xs text-muted-foreground space-y-1 list-disc list-inside"
											>
												<li>
													<strong
														>xmpDM:duration:</strong
													> Clip length
												</li>
												<li>
													<strong
														>xmpDM:videoFrameRate:</strong
													> FPS
												</li>
												<li>
													<strong
														>xmpDM:audioChannelType:</strong
													> Mono/Stereo
												</li>
												<li>
													<strong>xmp:Rating:</strong>
													Star ratings
												</li>
											</ul>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="workflow-integration">
							<AccordionTrigger
								isOpen={accordionOpen.workflow}
								onclick={() =>
									(accordionOpen.workflow =
										!accordionOpen.workflow)}
							>
								<div class="flex items-center space-x-3">
									<div
										class="h-2 w-2 bg-purple-500 rounded-full"
									></div>
									<span class="font-semibold"
										>Workflow Integration</span
									>
								</div>
							</AccordionTrigger>
							<AccordionContent isOpen={accordionOpen.workflow}>
								<div class="prose prose-sm max-w-none">
									<p
										class="text-muted-foreground leading-relaxed"
									>
										<strong>Pro Tip:</strong> Use this explorer
										to understand which XMP properties are available
										for your specific workflow needs. Filter
										by category or media type to find relevant
										properties for your projects.
									</p>
									<div
										class="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4"
									>
										<h4
											class="font-semibold text-sm mb-2 text-primary"
										>
											Quick Workflow Examples
										</h4>
										<div
											class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
										>
											<div>
												<strong>Documentary:</strong><br
												/>
												<span
													class="text-muted-foreground"
													>dc:subject for topics,
													xmp:Rating for selects,
													xmpDM:logComment for notes</span
												>
											</div>
											<div>
												<strong>Commercial:</strong><br
												/>
												<span
													class="text-muted-foreground"
													>xmpRights:UsageTerms for
													licensing, dc:creator for
													credits, xmp:Label for
													approval status</span
												>
											</div>
											<div>
												<strong>Narrative:</strong><br
												/>
												<span
													class="text-muted-foreground"
													>dc:description for scene
													notes, xmpDM:shotLocation
													for continuity, xmp:Rating
													for takes</span
												>
											</div>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			{/if}
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto px-4 py-6">
		<!-- Stats Cards - Now at top -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
			<Card>
				<CardContent class="p-3">
					<div class="flex items-center space-x-2">
						<Table class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-xs font-medium text-muted-foreground"
							>
								Total Properties
							</p>
							<p class="text-lg font-bold">
								{$xmpStore.properties.length}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-3">
					<div class="flex items-center space-x-2">
						<Filter class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-xs font-medium text-muted-foreground"
							>
								Filtered Results
							</p>
							<p class="text-lg font-bold">
								{$filteredProperties.length}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-3">
					<div class="flex items-center space-x-2">
						<Database class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-xs font-medium text-muted-foreground"
							>
								Namespaces
							</p>
							<p class="text-lg font-bold">
								{new Set(
									$xmpStore.properties.map((p) => p.prefix)
								).size}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-3">
					<div class="flex items-center space-x-2">
						<Settings class="h-4 w-4 text-muted-foreground" />
						<div>
							<p
								class="text-xs font-medium text-muted-foreground"
							>
								Categories
							</p>
							<p class="text-lg font-bold">
								{new Set(
									$xmpStore.properties.map((p) => p.category)
								).size}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Desktop: Sidebar + Table Layout | Mobile: Vertical Stack -->
		<div
			class="lg:grid lg:grid-cols-12 lg:gap-4 xl:gap-6 space-y-6 lg:space-y-0"
		>
			<!-- Sidebar: Search & Filters (Desktop) | Stacked (Mobile) -->
			<div class="lg:col-span-4 xl:col-span-3 2xl:col-span-3">
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
					<CardContent class="pb-6">
						<PropertyFilters />
					</CardContent>
				</Card>
			</div>

			<!-- Main Table Area -->
			<div class="lg:col-span-8 xl:col-span-9 2xl:col-span-9">
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
						<div
							class="overflow-auto"
							style="height: calc(100vh - 400px); min-height: 600px;"
						>
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
