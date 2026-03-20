<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleLogout() {
    dispatch('logout');
  }
</script>

<header class="header flex justify-between items-center px-6 h-[70px] bg-white shadow-md sticky top-0 z-40">
  <div class="header-left flex items-center gap-5 flex-1">
    <button class="menu-toggle lg:hidden bg-none border-none text-yellow-700 text-2xl cursor-pointer p-3 rounded-lg hover:bg-yellow-50 transition-colors" aria-label="Toggle Menu" on:click={() => dispatch('toggleMenu')}>
      <i class="fas fa-bars"></i>
    </button>
    <a href="/Dashboard" class="logo-link flex items-center gap-3 text-yellow-700 no-underline font-bold text-2xl hover:text-yellow-600 transition-colors">
      <i class="fas fa-car text-yellow-500 text-3xl"></i>
      <span class="logo-text hidden sm:inline">Autopulse</span>
    </a>
    <nav class="breadcrumb hidden xl:flex items-center gap-3 text-base text-gray-500 ml-6 pl-6 border-l-2 border-gray-200">
      <a href="/Dashboard" class="text-yellow-600 no-underline font-medium flex items-center gap-2 hover:text-yellow-800 transition-colors">
        <i class="fas fa-home"></i> Home
      </a>
      <i class="fas fa-chevron-right text-[10px] text-gray-400"></i>
      <span class="current-page text-yellow-800 font-semibold">Dashboard</span>
    </nav>
  </div>
  <div class="header-right flex items-center gap-4">
    <button class="icon-btn bg-none border-none text-xl text-gray-500 cursor-pointer p-3 rounded-xl relative hover:bg-gray-100 hover:text-yellow-700 transition-all" aria-label="Notifications">
      <i class="fas fa-bell"></i>
      <span class="notification-badge absolute top-1 right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full min-w-[20px] text-center border-2 border-white">3</span>
    </button>
    <div class="user-menu flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-yellow-50 transition-all relative group">
      <div class="user-avatar w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-lg border-2 border-yellow-300 shadow-md">A</div>
      <div class="user-details hidden md:flex flex-col gap-1">
        <div class="user-name text-sm font-bold text-yellow-800">Autopulse</div>
        <div class="user-role text-xs text-gray-500">Super Admin</div>
      </div>
      <i class="fas fa-chevron-down text-sm text-gray-400 group-hover:rotate-180 transition-transform hidden md:block"></i>
      <div class="dropdown-menu absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl min-w-[220px] p-2 opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all border border-gray-100">
        <a href="/profile" class="dropdown-item flex items-center gap-3 px-4 py-3.5 text-gray-700 no-underline rounded-lg text-sm font-medium hover:bg-yellow-50 hover:text-yellow-800 transition-all">
          <i class="fas fa-user text-yellow-600 w-5"></i> Profile
        </a>
        <a href="/settings" class="dropdown-item flex items-center gap-3 px-4 py-3.5 text-gray-700 no-underline rounded-lg text-sm font-medium hover:bg-yellow-50 hover:text-yellow-800 transition-all">
          <i class="fas fa-cog text-yellow-600 w-5"></i> Settings
        </a>
        <button class="dropdown-item flex items-center gap-3 px-4 py-3.5 text-red-600 no-underline rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-700 transition-all w-full text-left bg-none border-none cursor-pointer" on:click={handleLogout}>
          <i class="fas fa-sign-out-alt w-5"></i> Logout
        </button>
      </div>
    </div>
  </div>
</header>

<style>
  @media (max-width: 1024px) {
    .header {
      padding: 0 16px;
      height: 64px;
    }

    .menu-toggle {
      display: block;
    }

    .logo-text {
      display: none;
    }

    .breadcrumb {
      display: none;
    }

    .user-details {
      display: none;
    }

    .user-menu > .fa-chevron-down {
      display: none;
    }

    .header-right {
      gap: 2px;
    }
  }
</style>
