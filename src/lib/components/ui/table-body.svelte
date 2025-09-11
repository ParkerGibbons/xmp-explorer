<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<tbody
	class={cn('[&_tr:last-child]:border-0', className)}
	{...rest}
>
	<slot />
</tbody>
