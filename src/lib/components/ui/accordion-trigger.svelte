<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { ChevronDown } from 'lucide-svelte';

	interface Props {
		class?: string;
		isOpen?: boolean;
		onclick?: () => void;
	}

	let {
		class: className,
		isOpen = false,
		onclick,
		...rest
	}: Props = $props();
</script>

<button
	class={cn(
		'flex w-full items-center justify-between p-4 text-left font-medium transition-all hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180',
		className
	)}
	data-state={isOpen ? 'open' : 'closed'}
	{onclick}
	{...rest}
>
	<slot />
	<ChevronDown class="h-4 w-4 transition-transform duration-200" />
</button>
