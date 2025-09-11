<script lang="ts">
	import { themeStore, effectiveTheme } from '$lib/stores/theme-store';
	import { Button } from '$lib/components/ui';
	import { Sun, Moon, Monitor } from 'lucide-svelte';

	function cycleTheme() {
		const current = $themeStore;
		if (current === 'light') {
			themeStore.set('dark');
		} else if (current === 'dark') {
			themeStore.set('system');
		} else {
			themeStore.set('light');
		}
	}

	function getIcon() {
		const current = $themeStore;
		if (current === 'light') return Sun;
		if (current === 'dark') return Moon;
		return Monitor;
	}
</script>

<Button
	variant="outline"
	size="icon"
	onclick={cycleTheme}
>
	<svelte:component
		this={getIcon()}
		class="h-4 w-4"
	/>
</Button>
