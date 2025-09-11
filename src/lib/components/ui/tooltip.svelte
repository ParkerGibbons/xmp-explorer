<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		content: string;
		side?: 'top' | 'right' | 'bottom' | 'left';
		align?: 'start' | 'center' | 'end';
	}

	let {
		class: className,
		content,
		side = 'top',
		align = 'center',
		...rest
	}: Props = $props();

	let showTooltip = $state(false);
	let triggerElement: HTMLElement;

	function handleMouseEnter() {
		showTooltip = true;
	}

	function handleMouseLeave() {
		showTooltip = false;
	}
</script>

<div
	bind:this={triggerElement}
	class="relative inline-block"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...rest}
>
	<slot />
	{#if showTooltip}
		<div
			class={cn(
				'absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
				{
					'bottom-full left-1/2 -translate-x-1/2 mb-2':
						side === 'top',
					'top-1/2 left-full -translate-y-1/2 ml-2': side === 'right',
					'top-full left-1/2 -translate-x-1/2 mt-2':
						side === 'bottom',
					'top-1/2 right-full -translate-y-1/2 mr-2': side === 'left',
				},
				className
			)}
		>
			{content}
		</div>
	{/if}
</div>
