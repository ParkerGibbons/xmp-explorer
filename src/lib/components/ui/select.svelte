<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		onValueChange?: (value: string) => void;
	}

	let { class: className, onValueChange, ...rest }: Props = $props();
	let isOpen = $state(false);
	let selectedValue = $state('');
	let triggerElement: HTMLButtonElement;

	function handleTriggerClick() {
		isOpen = !isOpen;
	}

	function handleItemClick(value: string) {
		selectedValue = value;
		isOpen = false;
		onValueChange?.(value);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<div
	class={cn('relative', className)}
	{...rest}
>
	<button
		bind:this={triggerElement}
		class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		onclick={handleTriggerClick}
		onkeydown={handleKeydown}
	>
		<span>{selectedValue || 'Select...'}</span>
		<span class="ml-2">{isOpen ? '↑' : '↓'}</span>
	</button>

	{#if isOpen}
		<div
			class="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-md"
		>
			<slot />
		</div>
	{/if}
</div>
