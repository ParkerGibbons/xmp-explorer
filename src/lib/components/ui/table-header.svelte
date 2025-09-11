<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<thead
	class={cn('[&_tr]:border-b', className)}
	{...rest}
>
	<slot />
</thead>
