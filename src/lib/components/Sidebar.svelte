<script>
  let isDataManagementOpen = false;
  let isMobileMenuOpen = false;

  function toggleDataManagement() {
    isDataManagementOpen = !isDataManagementOpen;
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
</script>

<aside class="sidebar fixed top-0 left-0 h-full text-white z-50 transition-transform duration-300 ease-in-out" style="width: 328px;" class:mobile-open={isMobileMenuOpen}>
  <div class="sidebar-header flex items-center justify-between p-5 border-b border-white/20 bg-black/10" style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.3) 0%, rgba(202, 138, 4, 0.3) 100%);">
    <div class="logo text-3xl font-bold text-center px-4 hidden text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Autopulse</div>
    <div class="logo-icon text-3xl font-bold text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">AP</div>
    <button class="mobile-menu-toggle bg-none border-none text-white text-2xl cursor-pointer p-3 rounded-lg hover:bg-white/20 hidden" aria-label={isMobileMenuOpen ? 'Close Sidebar' : 'Open Sidebar'} on:click={toggleMobileMenu}>
      <i class="fas fa-{isMobileMenuOpen ? 'times' : 'bars'}"></i>
    </button>
  </div>

  <ul class="nav-menu list-none p-0 m-0 flex-1 overflow-y-auto" class:mobile-open={isMobileMenuOpen}>
    <li class="nav-item my-2 mx-3">
      <a href="/Dashboard" class="nav-link flex items-center p-4 text-white/95 no-underline transition-all rounded-xl hover:bg-white/20 hover:text-white hover:translate-x-2" style="font-size: 1.1rem;">
        <i class="fas fa-tachometer-alt mr-4 text-yellow-200 w-6 text-center text-xl"></i> Dashboard
      </a>
    </li>

    <!-- Data Management dengan Dropdown -->
    <li class="nav-item my-2 mx-3">
      <button
        class="dropdown-toggle flex justify-between items-center w-full bg-none border-none text-left cursor-pointer p-4 text-white/95 rounded-xl hover:bg-white/20 hover:text-white transition-all"
        class:open={isDataManagementOpen}
        on:click={toggleDataManagement}
        style="font-size: 1.1rem;"
      >
        <span><i class="fas fa-folder mr-4 text-yellow-200 w-6 text-center text-xl"></i> Data Management</span>
        <i class="fas fa-chevron-down text-yellow-200 transition-transform duration-300 text-xl" class:rotate={isDataManagementOpen}></i>
      </button>

      {#if isDataManagementOpen}
        <ul class="dropdown-menu animate-slideDown pl-0 list-none">
          <li class="nav-item my-1 mx-0">
            <a href="/Workshop" class="nav-link submenu pl-14 text-base text-white/90 hover:bg-white/20 rounded-lg py-3">
              <i class="fas fa-info-circle mr-4 text-yellow-200 w-5 text-center"></i> Workshop Information
            </a>
          </li>
          <li class="nav-item my-1 mx-0">
            <a href="/Member" class="nav-link submenu pl-14 text-base text-white/90 hover:bg-white/20 rounded-lg py-3">
              <i class="fas fa-users mr-4 text-yellow-200 w-5 text-center"></i> Member
            </a>
          </li>
          <li class="nav-item my-1 mx-0">
            <a href="/Captain" class="nav-link submenu pl-14 text-base text-white/90 hover:bg-white/20 rounded-lg py-3">
              <i class="fas fa-user-tie mr-4 text-yellow-200 w-5 text-center"></i> Captain
            </a>
          </li>
          <li class="nav-item my-1 mx-0">
            <a href="/Brand" class="nav-link submenu pl-14 text-base text-white/90 hover:bg-white/20 rounded-lg py-3">
              <i class="fas fa-car mr-4 text-yellow-200 w-5 text-center"></i> Available Brand
            </a>
          </li>
          <li class="nav-item my-1 mx-0">
            <a href="/Sparepart" class="nav-link submenu pl-14 text-base text-white/90 hover:bg-white/20 rounded-lg py-3">
              <i class="fas fa-cog mr-4 text-yellow-200 w-5 text-center"></i> Spare Part
            </a>
          </li>
          <li class="nav-item my-1 mx-0">
            <a href="/Cars" class="nav-link submenu pl-14 text-base text-white/90 hover:bg-white/20 rounded-lg py-3">
              <i class="fas fa-list mr-4 text-yellow-200 w-5 text-center"></i> Car List
            </a>
          </li>
        </ul>
      {/if}
    </li>

    <li class="nav-item my-2 mx-3">
      <a href="/service" class="nav-link flex items-center p-4 text-white/95 no-underline transition-all rounded-xl hover:bg-white/20 hover:text-white hover:translate-x-2" style="font-size: 1.1rem;">
        <i class="fas fa-wrench mr-4 text-yellow-200 w-6 text-center text-xl"></i> Service
      </a>
    </li>
    <li class="nav-item my-2 mx-3">
      <a href="/Service-activity" class="nav-link flex items-center p-4 text-white/95 no-underline transition-all rounded-xl hover:bg-white/20 hover:text-white hover:translate-x-2" style="font-size: 1.1rem;">
        <i class="fas fa-clipboard-list mr-4 text-yellow-200 w-6 text-center text-xl"></i> Service Activity
      </a>
    </li>
    <li class="nav-item my-2 mx-3">
      <a href="/Logbook" class="nav-link flex items-center p-4 text-white/95 no-underline transition-all rounded-xl hover:bg-white/20 hover:text-white hover:translate-x-2" style="font-size: 1.1rem;">
        <i class="fas fa-book mr-4 text-yellow-200 w-6 text-center text-xl"></i> Logbook
      </a>
    </li>
    <li class="nav-item my-2 mx-3">
      <a href="/Finance" class="nav-link flex items-center p-4 text-white/95 no-underline transition-all rounded-xl hover:bg-white/20 hover:text-white hover:translate-x-2" style="font-size: 1.1rem;">
        <i class="fas fa-dollar-sign mr-4 text-yellow-200 w-6 text-center text-xl"></i> Finance
      </a>
    </li>
    <li class="nav-item my-2 mx-3">
      <a href="/promotion" class="nav-link flex items-center p-4 text-white/95 no-underline transition-all rounded-xl hover:bg-white/20 hover:text-white hover:translate-x-2" style="font-size: 1.1rem;">
        <i class="fas fa-percent mr-4 text-yellow-200 w-6 text-center text-xl"></i> Promotion
      </a>
    </li>
    <li class="nav-item my-2 mx-3">
      <a href="/change-role" class="nav-link flex items-center p-4 text-white/95 no-underline transition-all rounded-xl hover:bg-white/20 hover:text-white hover:translate-x-2" style="font-size: 1.1rem;">
        <i class="fas fa-user-cog mr-4 text-yellow-200 w-6 text-center text-xl"></i> Change Role
      </a>
    </li>
  </ul>
</aside>

<style>
  .sidebar {
    background: linear-gradient(180deg, #ca8a04 0%, #eab308 50%, #facc15 100%);
    box-shadow: 4px 0 20px rgba(234, 179, 8, 0.3);
  }

  .sidebar::-webkit-scrollbar {
    width: 8px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .dropdown-toggle.open {
    background-color: rgba(255, 255, 255, 0.15);
    color: #fef3c7;
  }

  .dropdown-toggle i.fa-chevron-down.rotate {
    transform: rotate(180deg);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 800px;
    }
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease;
  }

  @media (max-width: 1024px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .sidebar.mobile-open {
      transform: translateX(0);
      box-shadow: 4px 0 30px rgba(0, 0, 0, 0.4);
    }

    .mobile-menu-toggle {
      display: block;
    }

    .logo {
      display: block;
    }

    .logo-icon {
      display: none;
    }

    .nav-menu {
      display: none;
    }

    .nav-menu.mobile-open {
      display: block;
    }
  }
</style>
