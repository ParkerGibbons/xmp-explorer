<script lang="ts">
	import { Badge, Tooltip } from '$lib/components/ui';
	import type { XmpProperty, Column } from '$lib/types/xmp';
	import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-svelte';

	interface Props {
		columns: Column[];
		data: XmpProperty[];
		sortable?: boolean;
	}

	let { columns, data, sortable = true }: Props = $props();
	let sortColumn: keyof XmpProperty | null = $state(null);
	let sortDirection: 'asc' | 'desc' = $state('asc');

	const sortedData = $derived(
		(() => {
			if (!data || !Array.isArray(data)) return [];
			return sortable && sortColumn
				? [...data].sort((a, b) => {
						const aVal = a[sortColumn!];
						const bVal = b[sortColumn!];
						const modifier = sortDirection === 'asc' ? 1 : -1;
						return (aVal ?? '') < (bVal ?? '')
							? -1 * modifier
							: (aVal ?? '') > (bVal ?? '')
								? 1 * modifier
								: 0;
					})
				: data;
		})()
	);

	function handleSort(column: Column) {
		if (!column.sortable) return;

		if (sortColumn === column.key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column.key;
			sortDirection = 'asc';
		}
	}

	function formatCellValue(
		property: XmpProperty,
		key: keyof XmpProperty
	): string {
		const value = property[key];

		switch (key) {
			case 'mediaTags':
				return Array.isArray(value) ? value.join(', ') : String(value);
			case 'structFields':
				return Array.isArray(value)
					? value
							.map((f) =>
								typeof f === 'object'
									? `${f.name} — ${f.type}`
									: f
							)
							.join('; ')
					: '—';
			default:
				return String(value || '');
		}
	}

	function getCategoryVariant(
		category: string
	): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (category) {
			case 'Dublin Core':
				return 'default';
			case 'Dublin Core Terms':
				return 'secondary';
			case 'XMP Core':
				return 'outline';
			case 'XMP Media Management':
				return 'destructive';
			case 'XMP Job Ticket':
				return 'outline';
			case 'XMP Paged-Text':
				return 'secondary';
			case 'XMP Dynamic Media':
				return 'destructive';
			case 'XMP Rights Management':
				return 'outline';
			case 'EXIF':
				return 'secondary';
			default:
				return 'secondary';
		}
	}

	function getValueFormVariant(
		valueForm: string
	): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (valueForm) {
			case 'simple':
				return 'default';
			case 'struct':
				return 'secondary';
			case 'array-bag':
			case 'array-seq':
			case 'array-alt':
				return 'outline';
			default:
				return 'secondary';
		}
	}
</script>

<div class="rounded-md border overflow-hidden">
	<!-- Fixed Header -->
	<div class="bg-background/95 backdrop-blur-sm border-b-2 shadow-sm">
		<table
			class="w-full border-collapse"
			style="table-layout: fixed;"
		>
			<thead>
				<tr>
					{#each columns as column}
						<th
							class="text-left font-semibold text-foreground py-3 px-2.5 {column.sortable
								? 'cursor-pointer hover:bg-muted/60'
								: ''}"
							style="width: {column.width}px;"
						>
							{#if column.sortable}
								<button
									class="flex w-full items-center space-x-2 text-left"
									onclick={() => handleSort(column)}
								>
									<span>{column.title}</span>
									{#if sortColumn === column.key}
										{#if sortDirection === 'asc'}
											<ArrowUp class="h-4 w-4" />
										{:else}
											<ArrowDown class="h-4 w-4" />
										{/if}
									{:else}
										<ArrowUpDown
											class="h-4 w-4 text-muted-foreground"
										/>
									{/if}
								</button>
							{:else}
								{column.title}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
		</table>
	</div>

	<!-- Scrollable Body -->
	<div
		class="overflow-auto"
		style="max-height: calc(100vh - 400px); min-height: 400px;"
	>
		<table
			class="w-full border-collapse"
			style="table-layout: fixed;"
		>
			<tbody>
				{#if sortedData && sortedData.length > 0}
					{#each sortedData as property, index (`${property?.qname || 'item'}-${index}`)}
						<tr
							class="{index % 2 === 0
								? 'bg-background'
								: 'bg-muted/20'} hover:bg-muted/40 transition-colors"
						>
							{#each columns as column}
								<td
									class="text-sm py-2.5 px-2.5 border-b "
									style="width: {column.width}px;"
								>
									{#if column.key === 'qname'}
										<div
											class="font-mono font-bold text-primary text-xs"
										>
											{property.qname}
										</div>
									{:else if column.key === 'category'}
										<div class="whitespace-nowrap">
											<Badge
												variant={getCategoryVariant(
													property.category
												)}
											>
												{property.category}
											</Badge>
										</div>
									{:else if column.key === 'valueForm'}
										<div class="whitespace-nowrap">
											<Badge
												variant={getValueFormVariant(
													property.valueForm
												)}
											>
												{property.valueForm}
											</Badge>
										</div>
									{:else if column.key === 'mediaTags'}
										<div
											class="flex flex-nowrap gap-1 overflow-x-auto"
										>
											{#each property.mediaTags as tag}
												<Badge
													variant="outline"
													class="text-xs whitespace-nowrap flex-shrink-0"
												>
													{tag}
												</Badge>
											{/each}
										</div>
									{:else if column.key === 'description'}
										<div
											class="text-muted-foreground leading-snug text-xs max-w-[300px] break-words"
											style="word-wrap: break-word; hyphens: auto;"
										>
											{property.description}
										</div>
									{:else if column.key === 'namespaceURI'}
										<Tooltip
											content={property.namespaceURI}
										>
											<div
												class="max-w-xs truncate font-mono text-xs text-muted-foreground"
											>
												{property.namespaceURI}
											</div>
										</Tooltip>
									{:else if column.key === 'structFields'}
										{#if property.structFields && property.structFields.length > 0}
											<div class="space-y-0.5">
												{#each property.structFields as field}
													<div
														class="text-xs leading-tight"
													>
														<span
															class="font-medium"
															>{field.name}</span
														>
														<span
															class="text-muted-foreground"
														>
															— {field.type}</span
														>
													</div>
												{/each}
											</div>
										{:else}
											<span class="text-muted-foreground"
												>—</span
											>
										{/if}
									{:else}
										<div
											class="max-w-xs truncate"
											title={formatCellValue(
												property,
												column.key
											)}
										>
											{formatCellValue(
												property,
												column.key
											)}
										</div>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{:else}
					<tr>
						<td
							colspan={columns.length}
							class="text-center py-8 text-muted-foreground px-2.5 border-b"
						>
							No data available
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
