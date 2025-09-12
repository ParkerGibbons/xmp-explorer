<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		value: string;
	}

	let { class: className, value, ...rest }: Props = $props();
</script>

<div
	class={cn('border rounded-lg', className)}
	{...rest}
>
	<slot />
</div>
