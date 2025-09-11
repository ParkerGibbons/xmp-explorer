<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		variant?: 'default' | 'destructive';
	}

	let { class: className, variant = 'default', ...rest }: Props = $props();
</script>

<div
	role="alert"
	class={cn(
		'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
		{
			'bg-background text-foreground': variant === 'default',
			'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive':
				variant === 'destructive',
		},
		className
	)}
	{...rest}
>
	<slot />
</div>
