<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>{page.status} - Error</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
  <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
    <div class="mb-6">
      <i class="fas fa-exclamation-triangle text-6xl text-blue-500"></i>
    </div>

    <h1 class="text-4xl font-bold text-gray-800 mb-2">
      {#if page.status === 404}
        404
      {:else if page.status === 500}
        500
      {:else if page.status === 403}
        403
      {:else if page.status === 401}
        401
      {:else}
        Error
      {/if}
    </h1>

    <p class="text-gray-600 mb-6">
      {#if page.status === 404}
        Halaman yang Anda cari tidak ditemukan.
      {:else if page.status === 500}
        Terjadi kesalahan pada server. Silakan coba lagi nanti.
      {:else if page.status === 403}
        Anda tidak memiliki akses ke halaman ini.
      {:else if page.status === 401}
        Silakan login untuk melanjutkan.
      {:else}
        Terjadi kesalahan yang tidak terduga.
      {/if}
    </p>

    <div class="flex gap-4 justify-center">
      <a
        href="/"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
      >
        <i class="fas fa-home mr-2"></i> Kembali ke Home
      </a>
      <button
        on:click={() => window.history.back()}
        class="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
      >
        <i class="fas fa-arrow-left mr-2"></i> Kembali
      </button>
    </div>

    {#if page.error?.message}
      <div class="mt-6 p-4 bg-gray-50 rounded-lg text-left">
        <p class="text-sm text-gray-600 font-semibold mb-2">Error Details:</p>
        <pre class="text-xs text-gray-500 whitespace-pre-wrap">{page.error.message}</pre>
      </div>
    {/if}

    <div class="mt-6 pt-6 border-t border-gray-200">
      <p class="text-sm text-gray-500">
        Jika masalah berlanjut, hubungi support dengan kode error:
        <span class="font-mono bg-gray-100 px-2 py-1 rounded">{page.status}-{Date.now().toString(36).toUpperCase()}</span>
      </p>
    </div>
  </div>
</div>
