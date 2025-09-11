<script lang="ts">
	import { xmpStore } from '$lib/stores/xmp-store';
	import {
		Input,
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
		Badge,
	} from '$lib/components/ui';
	import { debounce } from '$lib/utils/xmp-helpers';
	import { Search, Filter, X } from 'lucide-svelte';

	let searchQuery = $state('');

	const debouncedSearch = debounce((query: string) => {
		xmpStore.update((store) => ({
			...store,
			searchQuery: query,
		}));
	}, 300);

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		debouncedSearch(target.value);
	}

	function handleFilterChange(filterType: string, value: string) {
		xmpStore.update((store) => ({
			...store,
			filters: {
				...store.filters,
				[filterType]: value,
			},
		}));
	}

	// Get unique values for filter options
	const uniqueNamespaces = $derived(
		[...new Set($xmpStore.properties.map((p) => p.prefix))].sort()
	);

	const uniqueCategories = $derived(
		[...new Set($xmpStore.properties.map((p) => p.category))].sort()
	);

	const uniqueMediaTypes = $derived(
		[...new Set($xmpStore.properties.flatMap((p) => p.mediaTags))].sort()
	);
</script>

<div class="space-y-6">
	<!-- Search Bar -->
	<div class="relative">
		<Search
			class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
		/>
		<Input
			id="search-input"
			placeholder="Search properties by name, description, or namespace..."
			value={searchQuery}
			oninput={handleSearch}
			class="pl-10"
		/>
		{#if searchQuery}
			<button
				onclick={() => {
					searchQuery = '';
					handleSearch({ target: { value: '' } } as unknown as Event);
				}}
				class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
			>
				<X class="h-4 w-4" />
			</button>
		{/if}
	</div>

	<!-- Filter Grid -->
	<div class="grid grid-cols-1 gap-4">
		<div class="space-y-2">
			<div class="flex items-center space-x-2">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<label
					for="ns-filter"
					class="text-sm font-medium"
				>
					Namespace
				</label>
				{#if $xmpStore.filters.namespace !== 'all'}
					<Badge
						variant="secondary"
						class="text-xs"
					>
						{$xmpStore.filters.namespace}
					</Badge>
				{/if}
			</div>
			<Select
				onValueChange={(value: string) =>
					handleFilterChange('namespace', value)}
			>
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
			<div class="flex items-center space-x-2">
				<label
					for="cat-filter"
					class="text-sm font-medium"
				>
					Category
				</label>
				{#if $xmpStore.filters.category !== 'all'}
					<Badge
						variant="secondary"
						class="text-xs"
					>
						{$xmpStore.filters.category}
					</Badge>
				{/if}
			</div>
			<Select
				onValueChange={(value: string) =>
					handleFilterChange('category', value)}
			>
				<SelectTrigger>
					<SelectValue placeholder="All categories" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All categories</SelectItem>
					{#each uniqueCategories as category}
						<SelectItem value={category}>{category}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		</div>

		<div class="space-y-2">
			<div class="flex items-center space-x-2">
				<label
					for="form-filter"
					class="text-sm font-medium"
				>
					Value Form
				</label>
				{#if $xmpStore.filters.valueForm !== 'all'}
					<Badge
						variant="secondary"
						class="text-xs"
					>
						{$xmpStore.filters.valueForm}
					</Badge>
				{/if}
			</div>
			<Select
				onValueChange={(value: string) =>
					handleFilterChange('valueForm', value)}
			>
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
			<div class="flex items-center space-x-2">
				<label
					for="media-filter"
					class="text-sm font-medium"
				>
					Media Type
				</label>
				{#if $xmpStore.filters.media !== 'any'}
					<Badge
						variant="secondary"
						class="text-xs"
					>
						{$xmpStore.filters.media}
					</Badge>
				{/if}
			</div>
			<Select
				onValueChange={(value: string) =>
					handleFilterChange('media', value)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Any media" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="any">Any media</SelectItem>
					{#each uniqueMediaTypes as mediaType}
						<SelectItem value={mediaType}>{mediaType}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		</div>
	</div>
</div>
