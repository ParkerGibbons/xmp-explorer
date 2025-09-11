<script lang="ts">
	import {
		Badge,
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
		Tooltip,
	} from '$lib/components/ui';
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
		sortable && sortColumn
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
			: data
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
			case 'Core':
				return 'default';
			case 'Standard':
				return 'secondary';
			case 'Specialized':
				return 'outline';
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

<div class="rounded-md border">
	<Table>
		<TableHeader>
			<TableRow>
				{#each columns as column}
					<TableHead
						class="font-medium {column.sortable
							? 'cursor-pointer hover:bg-muted/50'
							: ''}"
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
					</TableHead>
				{/each}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each sortedData as property, index (property.qname)}
				<TableRow>
					{#each columns as column}
						<TableCell class="text-sm">
							{#if column.key === 'qname'}
								<div class="font-mono font-medium text-primary">
									{property.qname}
								</div>
							{:else if column.key === 'category'}
								<Badge
									variant={getCategoryVariant(
										property.category
									)}
								>
									{property.category}
								</Badge>
							{:else if column.key === 'valueForm'}
								<Badge
									variant={getValueFormVariant(
										property.valueForm
									)}
								>
									{property.valueForm}
								</Badge>
							{:else if column.key === 'mediaTags'}
								<div class="flex flex-wrap gap-1">
									{#each property.mediaTags as tag}
										<Badge
											variant="outline"
											class="text-xs"
										>
											{tag}
										</Badge>
									{/each}
								</div>
							{:else if column.key === 'description'}
								<Tooltip content={property.description}>
									<div
										class="max-w-xs truncate text-muted-foreground"
									>
										{property.description}
									</div>
								</Tooltip>
							{:else if column.key === 'namespaceURI'}
								<Tooltip content={property.namespaceURI}>
									<div
										class="max-w-xs truncate font-mono text-xs text-muted-foreground"
									>
										{property.namespaceURI}
									</div>
								</Tooltip>
							{:else if column.key === 'structFields'}
								{#if property.structFields && property.structFields.length > 0}
									<div class="space-y-1">
										{#each property.structFields as field}
											<div class="text-xs">
												<span class="font-medium"
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
									<span class="text-muted-foreground">—</span>
								{/if}
							{:else}
								<div
									class="max-w-xs truncate"
									title={formatCellValue(
										property,
										column.key
									)}
								>
									{formatCellValue(property, column.key)}
								</div>
							{/if}
						</TableCell>
					{/each}
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
