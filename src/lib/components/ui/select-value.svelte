<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		placeholder?: string;
	}

	let {
		class: className,
		placeholder = 'Select...',
		...rest
	}: Props = $props();
</script>

<span
	class={cn('', className)}
	{...rest}
>
	<slot>{placeholder}</slot>
</span>
