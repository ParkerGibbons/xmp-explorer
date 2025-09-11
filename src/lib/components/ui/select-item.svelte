<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		value: string;
		onclick?: () => void;
	}

	let { class: className, value, onclick, ...rest }: Props = $props();
</script>

<button
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
		className
	)}
	{onclick}
	{...rest}
>
	<slot />
</button>
