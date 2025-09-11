<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<div
	class={cn('relative w-full overflow-auto', className)}
	{...rest}
>
	<table class="w-full caption-bottom text-sm">
		<slot />
	</table>
</div>
