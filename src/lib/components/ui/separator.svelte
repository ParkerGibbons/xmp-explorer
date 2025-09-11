<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		orientation?: 'horizontal' | 'vertical';
		decorative?: boolean;
	}

	let {
		class: className,
		orientation = 'horizontal',
		decorative = true,
		...rest
	}: Props = $props();
</script>

<div
	role={decorative ? 'none' : 'separator'}
	aria-orientation={orientation}
	class={cn(
		'shrink-0 bg-border',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
		className
	)}
	{...rest}
/>
