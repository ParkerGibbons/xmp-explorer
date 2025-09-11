<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<td
	class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
	{...rest}
>
	<slot />
</td>
