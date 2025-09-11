<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-md',
		className
	)}
	{...rest}
>
	<slot />
</div>
