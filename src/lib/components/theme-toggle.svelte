<script lang="ts">
	import { themeStore, effectiveTheme } from '$lib/stores/theme-store';
	import { Button } from '$lib/components/ui';
	import { Sun, Moon, Monitor } from 'lucide-svelte';

	function toggleTheme() {
		const current = $effectiveTheme;
		if (current === 'light') {
			themeStore.set('dark');
		} else {
			themeStore.set('light');
		}
	}

	function getIcon() {
		const current = $effectiveTheme;
		if (current === 'light') return Sun;
		return Moon;
	}
</script>

<Button
	variant="outline"
	size="icon"
	onclick={toggleTheme}
>
	<svelte:component
		this={getIcon()}
		class="h-4 w-4"
	/>
</Button>
