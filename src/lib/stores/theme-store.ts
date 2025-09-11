import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | 'system';

const getSystemTheme = (): 'light' | 'dark' => {
  if (!browser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const themeStore = writable<Theme>('system');

export const effectiveTheme = writable<'light' | 'dark'>('light');

themeStore.subscribe((theme) => {
  if (!browser) return;
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme);
    effectiveTheme.set(systemTheme);
  } else {
    root.classList.add(theme);
    effectiveTheme.set(theme);
  }
  
  localStorage.setItem('theme', theme);
});

// Initialize theme from localStorage
if (browser) {
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) {
    themeStore.set(stored);
  }
}
