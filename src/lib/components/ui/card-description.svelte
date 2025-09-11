<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<p
	class={cn('text-sm text-muted-foreground', className)}
	{...rest}
>
	<slot />
</p>
