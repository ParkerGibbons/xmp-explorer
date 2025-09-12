<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { slide } from 'svelte/transition';

	interface Props {
		class?: string;
		isOpen?: boolean;
	}

	let { class: className, isOpen = false, ...rest }: Props = $props();
</script>

{#if isOpen}
	<div
		class={cn('overflow-hidden text-sm', className)}
		transition:slide={{ duration: 200 }}
		{...rest}
	>
		<div class="px-4 pb-4 pt-0">
			<slot />
		</div>
	</div>
{/if}
