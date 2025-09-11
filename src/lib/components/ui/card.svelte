<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'rounded-lg border bg-card text-card-foreground shadow-sm',
		className
	)}
	{...rest}
>
	<slot />
</div>
