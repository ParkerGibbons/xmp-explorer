<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<h5
	class={cn('mb-1 font-medium leading-none tracking-tight', className)}
	{...rest}
>
	<slot />
</h5>
