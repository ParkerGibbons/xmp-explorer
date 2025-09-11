<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<div
	class={cn('text-sm [&_p]:leading-relaxed', className)}
	{...rest}
>
	<slot />
</div>
