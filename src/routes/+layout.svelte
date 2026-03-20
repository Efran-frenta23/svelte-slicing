<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';

  // Session store
  export const session = writable(null);
  let isLoading = true;
  
  // Check if current page is auth page
  const publicRoutes = ['/login', '/contact'];
  $: isAuthPage = publicRoutes.includes($page.url.pathname);
  
  // Initialize on mount (client-side only)
  import { onMount } from 'svelte';
  onMount(() => {
    isLoading = false;
  });

  async function handleLogout() {
    console.log('Logout clicked');
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        console.log('Logged out successfully');
        goto('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      goto('/login');
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="layout flex min-h-screen bg-gray-50">
  {#if isLoading}
    <div class="loading flex justify-center items-center h-screen text-xl text-yellow-700">Memuat...</div>
  {:else if !isAuthPage}
    <Sidebar />
    <div class="main-container flex-1 transition-all duration-300" style="margin-left: 328px; width: calc(100% - 328px);">
      <Header on:logout={handleLogout} />
      <main class="p-5 bg-gray-50 min-h-[calc(100vh-70px)]">
        <slot />
      </main>
    </div>
  {:else}
    <main class="login-page">
      <slot />
    </main>
  {/if}
</div>

<style>
  @media (max-width: 1024px) {
    .main-container {
      margin-left: 0 !important;
      width: 100% !important;
    }
  }
</style>
