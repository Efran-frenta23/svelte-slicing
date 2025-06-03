<script>
    import { onMount } from 'svelte';
  
    // Reactive variables
    let sidebarCollapsed = false;
    let mobileMenuShow = false;
    let currentPage = 1;
    let sortColumn = 'id';
    let sortDirection = 'asc';
    let searchTerm = '';
  
    // Sample service activity data
    let serviceActivities = [
      { id: 1, activity: 'Tire Replacement', customer: 'Anne', car: 'Toyota Rush', captain: 'Maryadi', status: 'In Progress' },
      { id: 2, activity: 'Oil Change', customer: 'Budi', car: 'Honda Civic', captain: 'Slamet', status: 'Completed' },
      { id: 3, activity: 'AC Service', customer: 'Citra', car: 'Chery Tiggo', captain: 'Yanto', status: 'In Progress' },
      { id: 4, activity: 'Brake Service', customer: 'Doni', car: 'Toyota Avanza', captain: 'Maryadi', status: 'Pending' },
      { id: 5, activity: 'Engine Check', customer: 'Eka', car: 'Honda Jazz', captain: 'Slamet', status: 'Completed' },
      { id: 6, activity: 'Battery Replacement', customer: 'Fani', car: 'Suzuki Ertiga', captain: 'Yanto', status: 'In Progress' },
      { id: 7, activity: 'Transmission Service', customer: 'Gani', car: 'Nissan March', captain: 'Maryadi', status: 'Pending' },
      { id: 8, activity: 'Wheel Alignment', customer: 'Hani', car: 'Mitsubishi Xpander', captain: 'Slamet', status: 'Completed' }
    ];
  
    // Navigation menu items
    const menuItems = [
      { href: 'index.html', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { href: 'service.html', icon: 'fas fa-wrench', label: 'Service' },
      { href: 'workshop.html', icon: 'fas fa-info-circle', label: 'Workshop Information' },
      { href: 'member.html', icon: 'fas fa-users', label: 'Member' },
      { href: 'captain.html', icon: 'fas fa-user-tie', label: 'Captain' },
      { href: 'brand.html', icon: 'fas fa-car', label: 'Available Brand' },
      { href: 'sparepart.html', icon: 'fas fa-cog', label: 'Spare Part' },
      { href: 'carlist.html', icon: 'fas fa-list', label: 'Car List' },
      { href: 'serviceactivity.html', icon: 'fas fa-clipboard-list', label: 'Service Activity', active: true },
      { href: 'logbook.html', icon: 'fas fa-book', label: 'Logbook' },
      { href: 'servicedetail.html', icon: 'fas fa-tools', label: 'Service Detail' },
      { href: 'finance.html', icon: 'fas fa-dollar-sign', label: 'Finance' },
      { href: 'promotion.html', icon: 'fas fa-percent', label: 'Promotion' },
      { href: 'admin.html', icon: 'fas fa-user-plus', label: 'Admin Registration' }
    ];
  
    // Reactive filtered and sorted activities
    $: filteredActivities = serviceActivities.filter(activity =>
      activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    $: sortedActivities = [...filteredActivities].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      if (sortColumn === 'id') {
        valA = parseInt(valA);
        valB = parseInt(valB);
      }
      const comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
    // Functions
    function toggleSidebar() {
      sidebarCollapsed = !sidebarCollapsed;
    }
  
    function toggleMobileMenu() {
      mobileMenuShow = !mobileMenuShow;
    }
  
    function handleSort(column) {
      if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = column;
        sortDirection = 'asc';
      }
    }
  
    function changePage(page) {
      if (page === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (page === 'next' && currentPage < 10) {
        currentPage++;
      } else if (typeof page === 'number') {
        currentPage = page;
      }
    }
  
    function handleKeydown(event) {
      if (event.key === 'Escape') {
        if (!sidebarCollapsed) {
          toggleSidebar();
        } else if (mobileMenuShow) {
          toggleMobileMenu();
        }
      }
      if (event.key === 'ArrowLeft') {
        changePage('prev');
      }
      if (event.key === 'ArrowRight') {
        changePage('next');
      }
    }
  
    function getSortIcon(column) {
      if (sortColumn !== column) return 'fas fa-sort';
      return sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
  
    function getStatusClass(status) {
      switch(status.toLowerCase()) {
        case 'completed': return 'status-completed';
        case 'in progress': return 'status-inprogress';
        case 'pending': return 'status-pending';
        default: return 'status-default';
      }
    }
  
    onMount(() => {
      // Set initial active page
      currentPage = 1;
    });
  </script>
  
  <svelte:window on:keydown={handleKeydown} />
  
  <svelte:head>
    <meta name="description" content="Autopulse Dashboard - Service Activity">
    <title>Autopulse - Service Activity</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </svelte:head>
  
  <!-- Header -->
  <header class="header">
    <div class="header-left">
      <button on:click={toggleSidebar} aria-label="Toggle Sidebar" class="toggle-btn">
        <i class="fas fa-bars"></i>
      </button>
      <a href="Dashboard" aria-label="Autopulse Dashboard" class="brand">
        <i class="fas fa-car"></i> Autopulse
      </a>
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="Home">Home</a>
        <i class="fas fa-chevron-right"></i>
        <span>Service Activity</span>
      </nav>
    </div>
    <div class="header-right">
      <button aria-label="Notifications" class="notification-btn">
        <i class="fas fa-bell"></i>
      </button>
      <div aria-label="User Profile" class="user-profile">
        <div class="user-avatar">A</div>
        <div class="user-info">
          <div class="user-name">Autopulse</div>
          <div class="user-role">Super Admin</div>
        </div>
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  </header>
  

  
    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <div class="page-title">
          <i class="fas fa-clipboard-list"></i> Service Activity
        </div>
        <div class="user-info">
          <div class="user-avatar">A</div>
          <div>
            <div class="user-name">Autopulse</div>
            <div class="user-role">Super Admin</div>
          </div>
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
  
      <h1 class="section-header">Service Activity</h1>
  
      <div class="content-body">
        <!-- Service Activities Card -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">Service Activities</h2>
            <div class="total-count">
              Total Activities: {serviceActivities.length}
            </div>
          </div>
          <div class="card-body">
            <div class="search-container">
              <div class="search-box">
                <input 
                  type="text" 
                  bind:value={searchTerm}
                  placeholder="Search by Activity, Customer, Car, Captain, or Status..." 
                  aria-label="Search Service Activities"
                >
                <i class="fas fa-search"></i>
              </div>
            </div>
            <div class="table-container">
              <table class="data-table" aria-label="Service Activities Table">
                <thead>
                  <tr>
                    <th on:click={() => handleSort('id')} data-sort="id">
                      No <i class={getSortIcon('id')}></i>
                    </th>
                    <th on:click={() => handleSort('activity')} data-sort="activity">
                      Activity <i class={getSortIcon('activity')}></i>
                    </th>
                    <th on:click={() => handleSort('customer')} data-sort="customer">
                      Customer <i class={getSortIcon('customer')}></i>
                    </th>
                    <th on:click={() => handleSort('car')} data-sort="car">
                      Car <i class={getSortIcon('car')}></i>
                    </th>
                    <th on:click={() => handleSort('captain')} data-sort="captain">
                      Captain <i class={getSortIcon('captain')}></i>
                    </th>
                    <th on:click={() => handleSort('status')} data-sort="status">
                      Status <i class={getSortIcon('status')}></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {#each sortedActivities as activity, index}
                    <tr>
                      <td>{index + 1}</td>
                      <td>{activity.activity}</td>
                      <td>{activity.customer}</td>
                      <td>{activity.car}</td>
                      <td>{activity.captain}</td>
                      <td>
                        <span class="status-badge {getStatusClass(activity.status)}">
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="pagination" role="navigation" aria-label="Pagination">
              <button on:click={() => changePage('prev')} aria-label="Previous Page">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button on:click={() => changePage(1)} class:active={currentPage === 1}>1</button>
              <button on:click={() => changePage(2)} class:active={currentPage === 2}>2</button>
              <button on:click={() => changePage(3)} class:active={currentPage === 3}>3</button>
              <button on:click={() => changePage(4)} class:active={currentPage === 4}>4</button>
              <span>...</span>
              <button on:click={() => changePage(10)} class:active={currentPage === 10}>10</button>
              <button on:click={() => changePage('next')} aria-label="Next Page">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  
  <style>
    :global(*) {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  
    :global(body) {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: white;
    }
  
    /* Header Styles */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
  
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  
    .toggle-btn, .notification-btn, .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: background-color 0.3s;
    }
  
    .toggle-btn:hover, .notification-btn:hover, .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  
    .brand {
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
    }
  
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
  
    .breadcrumb a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
    }
  
    .breadcrumb a:hover {
      color: white;
    }
  
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
  
    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(45deg, #ff6b6b, #ee5a24);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
  
    .user-info .user-name {
      font-size: 0.9rem;
      font-weight: 600;
    }
  
    .user-info .user-role {
      font-size: 0.75rem;
      opacity: 0.8;
    }
  
    /* Dashboard Container */
    .dashboard-container {
      display: flex;
      min-height: calc(100vh - 80px);
    }
  
    /* Sidebar Styles */
    .sidebar {
      width: 280px;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      transition: width 0.3s ease;
    }
  
    .sidebar.collapsed {
      width: 80px;
    }
  
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  
    .sidebar-brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }
  
    .nav-menu {
      list-style: none;
      padding: 1rem 0;
    }
  
    .nav-menu li {
      margin-bottom: 0.5rem;
    }
  
    .nav-menu a {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s;
      margin: 0 0.5rem;
      border-radius: 0.5rem;
    }
  
    .nav-menu a:hover, .nav-menu a.active {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  
    /* Main Content */
    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
  
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
  
    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  
    .section-header {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }
  
    .content-body {
      animation: fadeIn 0.5s ease-in;
    }
  
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  
  </style>