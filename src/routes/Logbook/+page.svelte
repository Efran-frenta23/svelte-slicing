<script>
    import { onMount } from 'svelte';
  
    // Data dan State Management
    let logs = [
      { id: 1, date: '2024-12-22', customer: 'Anne', vin: '123456789', brand: 'Toyota', service: 'Tire Replacement', status: 'Confirmed' },
      { id: 2, date: '2024-12-20', customer: 'Budi', vin: '987654321', brand: 'Honda', service: 'Oil Change', status: 'Pending' }
      // ... lainnya
    ];
  
    // Filter dan Search State
    let searchTerm = '';
    let selectedBrand = '';
    let selectedService = '';
    
    // Pagination State
    let currentPage = 1;
    let itemsPerPage = 4;
  
    // Animation State
    let isAnimating = false;
    let contentLoaded = false;
  
    // Reactive Data untuk Filtering
    $: filteredLogs = logs.filter(function(log) {
      const matchesSearch = searchTerm === '' || 
        log.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === '' || log.brand === selectedBrand;
      const matchesService = selectedService === '' || log.service === selectedService;
      return matchesSearch && matchesBrand && matchesService;
    });
  
    $: paginatedLogs = filteredLogs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    $: actualTotalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  
    // Functions
    function changePage(page) {
      if (isAnimating) return;
      isAnimating = true;
      if (page === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (page === 'next' && currentPage < actualTotalPages) {
        currentPage++;
      } else if (typeof page === 'number' && page >= 1 && page <= actualTotalPages) {
        currentPage = page;
      }
      setTimeout(function() {
        isAnimating = false;
      }, 300);
    }
  
    function handleRippleEffect(event) {
      const button = event.currentTarget;
      const existingRipple = button.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }
      
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      setTimeout(function() {
        ripple.remove();
      }, 600);
    }
  
    function isValidDate(dateString) {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    }
  
    function resetFilters() {
      searchTerm = '';
      selectedBrand = '';
      selectedService = '';
      currentPage = 1;
    }
  
    function handleKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
          searchInput.focus();
        }
      }
      if (event.key === 'Escape') {
        resetFilters();
      }
    }
  
    onMount(function() {
      setTimeout(function() {
        contentLoaded = true;
      }, 100);
      document.addEventListener('keydown', handleKeydown);
      return function() {
        document.removeEventListener('keydown', handleKeydown);
      };
    });
  
    $: uniqueBrands = [...new Set(logs.map(function(log) { return log.brand; }))];
    $: uniqueServices = [...new Set(logs.map(function(log) { return log.service; }))];
  </script>
  
  <main>
    <div>
      <h1>Service History</h1>
      <div>
        <div>
          <h2>Service Logbook</h2>
          <div>Total Records: {filteredLogs.length}</div>
        </div>
        
        <div>
          <select bind:value={selectedBrand} aria-label="Filter by Brand">
            <option value="">All Brands</option>
            {#each uniqueBrands as brand}
              <option value={brand}>{brand}</option>
            {/each}
          </select>
          
          <select bind:value={selectedService} aria-label="Filter by Service Type">
            <option value="">All Services</option>
            {#each uniqueServices as service}
              <option value={service}>{service}</option>
            {/each}
          </select>
          
          <div>
            <input 
              type="text" 
              id="searchInput"
              bind:value={searchTerm}
              placeholder="Search by VIN, Customer, or Service... (Ctrl+K)" 
              aria-label="Search Logs">
          </div>
          
          {#if searchTerm || selectedBrand || selectedService}
            <button on:click={resetFilters}>
              Clear Filters
            </button>
          {/if}
        </div>
  
        <div>
          <table aria-label="Service Logbook Table">
            <thead>
              <tr>
                <th>No</th>
                <th>Service Date</th>
                <th>Customer</th>
                <th>VIN</th>
                <th>Brand</th>
                <th>Service Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {#each paginatedLogs as log, index (log.id)}
                <tr
                    role="button"
                    tabindex="0"
                    on:click={() => console.log('Selected log:', log)}
                    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') console.log('Selected log:', log) }}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    {#if isValidDate(log.date)}
                      {new Date(log.date).toLocaleDateString('id-ID', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    {:else}
                      <span>Invalid Date</span>
                    {/if}
                  </td>
                  <td>{log.customer}</td>
                  <td>{log.vin}</td>
                  <td>{log.brand}</td>
                  <td>{log.service}</td>
                  <td>{log.status}</td>
                </tr>
              {:else}
                <tr>
                  <td colspan="7">
                    <div>
                      <p>No records found matching your criteria</p>
                      <button on:click={resetFilters}>
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
  
        {#if actualTotalPages > 1}
          <div role="navigation" aria-label="Pagination">
            <button 
              on:click={(e) => { handleRippleEffect(e); changePage('prev') }}
              disabled={currentPage === 1}
              aria-label="Previous Page">
              Prev
            </button>
            
            {#if actualTotalPages <= 7}
              {#each Array(actualTotalPages) as _, i}
                <button 
                  on:click={(e) => { handleRippleEffect(e); changePage(i + 1) }}>
                  {i + 1}
                </button>
              {/each}
            {:else}
              <button 
                on:click={(e) => { handleRippleEffect(e); changePage(1) }}>
                1
              </button>
              
              {#if currentPage > 3}
                <span>...</span>
              {/if}
              
              {#each Array(3) as _, i}
                {#if currentPage - 1 + i > 1 && currentPage - 1 + i < actualTotalPages}
                  <button 
                    on:click={(e) => { handleRippleEffect(e); changePage(currentPage - 1 + i) }}>
                    {currentPage - 1 + i}
                  </button>
                {/if}
              {/each}
              
              {#if currentPage < actualTotalPages - 2}
                <span>...</span>
              {/if}
              
              <button 
                on:click={(e) => { handleRippleEffect(e); changePage(actualTotalPages) }}>
                {actualTotalPages}
              </button>
            {/if}
            
            <button 
              on:click={(e) => { handleRippleEffect(e); changePage('next') }}
              disabled={currentPage === actualTotalPages}
              aria-label="Next Page">
              Next
            </button>
          </div>
        {/if}
  
        <div>
          <div>
            <span>Total:</span>
            <span>{filteredLogs.length}</span>
          </div>
          <div>
            <span>Confirmed:</span>
            <span>{filteredLogs.filter(log => log.status === 'Confirmed').length}</span>
          </div>
          <div>
            <span>Pending:</span>
            <span>{filteredLogs.filter(log => log.status === 'Pending').length}</span>
          </div>
          <div>
            <span>Page:</span>
            <span>{currentPage} of {actualTotalPages}</span>
          </div>
        </div>
      </div>
    </div>
  </main>