<script>
    let isDataManagementOpen = false;
    
    function toggleDataManagement() {
      isDataManagementOpen = !isDataManagementOpen;
    }
  </script>
  
  <aside class="sidebar" id="sidebar" role="navigation">
      <div class="sidebar">
          <div class="logo">Autopulse</div>
      </div>
      <div class="sidebar-header">
          <div class="logo-icon">AP</div>
          <button class="mobile-menu-toggle" aria-label="Close Sidebar">
              <i class="fas fa-times"></i>
          </button>
      </div>
      
      <ul class="nav-menu" id="navMenu">
          <li class="nav-item">
              <a href="/Dashboard" class="nav-link">
                  <i class="fas fa-tachometer-alt"></i> Dashboard
              </a>
          </li>
          
          <!-- Data Management dengan Dropdown -->
          <li class="nav-item">
              <button 
                  class="nav-link dropdown-toggle" 
                  class:open={isDataManagementOpen}
                  on:click={toggleDataManagement}
              >
                  <span><i class="fas fa-folder"></i> Data Management</span>
                  <i class="fas fa-chevron-down" class:rotate={isDataManagementOpen}></i>
              </button>
              
              {#if isDataManagementOpen}
                  <ul class="dropdown-menu">
                      <li class="nav-item">
                          <a href="/Workshop" class="nav-link submenu">
                              <i class="fas fa-info-circle"></i> Workshop Information
                          </a>
                      </li>
                      <li class="nav-item">
                          <a href="/Member" class="nav-link submenu">
                              <i class="fas fa-users"></i> Member
                          </a>
                      </li>
                      <li class="nav-item">
                          <a href="/Captain" class="nav-link submenu">
                              <i class="fas fa-user-tie"></i> Captain
                          </a>
                      </li>
                      <li class="nav-item">
                          <a href="/Brand" class="nav-link submenu">
                              <i class="fas fa-car"></i> Available Brand
                          </a>
                      </li>
                      <li class="nav-item">
                          <a href="/Sparepart" class="nav-link submenu">
                              <i class="fas fa-cog"></i> Spare Part
                          </a>
                      </li>
                      <li class="nav-item">
                          <a href="/Carlist" class="nav-link submenu">
                              <i class="fas fa-list"></i> Car List
                          </a>
                      </li>
                  </ul>
              {/if}
          </li>
          
          <li class="nav-item">
              <a href="/service" class="nav-link">
                  <i class="fas fa-wrench"></i> Service
              </a>
          </li>
          <li class="nav-item">
              <a href="/Service-activity" class="nav-link">
                  <i class="fas fa-clipboard-list"></i> Service Activity
              </a>
          </li>
          <li class="nav-item">
              <a href="/Logbook" class="nav-link">
                  <i class="fas fa-book"></i> Logbook
              </a>
          </li>
          <li class="nav-item">
              <a href="/Service-detail" class="nav-link">
                  <i class="fas fa-tools"></i> Service Detail
              </a>
          </li>
          <li class="nav-item">
              <a href="/Finance" class="nav-link">
                  <i class="fas fa-dollar-sign"></i> Finance
              </a>
          </li>
          <li class="nav-item">
              <a href="/promotion" class="nav-link">
                  <i class="fas fa-percent"></i> Promotion
              </a>
          </li>
          <li class="nav-item">
              <a href="/Admin" class="nav-link">
                  <i class="fas fa-user-plus"></i> Admin Registration
              </a>
          </li>
      </ul>
  </aside>
  
  <style>
    .dropdown-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
    }
    
    .dropdown-toggle i.fa-chevron-down {
      transition: transform 0.3s ease;
    }
    
    .dropdown-toggle i.fa-chevron-down.rotate {
      transform: rotate(180deg);
    }
    
    .dropdown-menu {
      animation: slideDown 0.3s ease;
      padding-left: 1rem;
    }
    
    .submenu {
      padding-left: 2rem !important;
      font-size: 0.9rem;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 300px;
      }
    }
  </style>