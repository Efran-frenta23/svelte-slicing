<script>
    import { onMount } from 'svelte';
  
    // State variables
    let promotions = [
      { id: 1, name: 'Oil Change Discount', discount: 20, startDate: '2025-05-01', endDate: '2025-05-31', status: 'Active' },
      { id: 2, name: 'Tire Replacement Promo', discount: 15, startDate: '2025-04-15', endDate: '2025-05-15', status: 'Expired' },
      { id: 3, name: 'Full Service Package', discount: 25, startDate: '2025-05-10', endDate: '2025-06-10', status: 'Active' }
    ];
  
    let currentPage = 1;
    let itemsPerPage = 5;
    let sortColumn = 'id';
    let sortDirection = 'asc';
    let searchTerm = '';
    let searchDebounceTimer;
  
    // Modal states
    let showAddModal = false;
    let showEditModal = false;
    let editingPromotion = null;
  
    // Form data
    let addForm = {
      name: '',
      discount: '',
      startDate: '',
      endDate: '',
      status: 'Active'
    };
  
    let editForm = {
      name: '',
      discount: '',
      startDate: '',
      endDate: '',
      status: 'Active'
    };
  
    // Form validation errors
    let addErrors = {};
    let editErrors = {};
  
    // Reactive statements
    $: totalPromotions = promotions.length;
  
    $: filteredPromotions = promotions.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    $: sortedPromotions = [...filteredPromotions].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      
      if (sortColumn === 'discount') {
        valA = parseInt(valA);
        valB = parseInt(valB);
      } else if (sortColumn.includes('Date')) {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      const result = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDirection === 'asc' ? result : -result;
    });
  
    $: totalPages = Math.ceil(sortedPromotions.length / itemsPerPage);
  
    $: paginatedPromotions = sortedPromotions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    // Auto-adjust current page if it exceeds total pages
    $: if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }
  
    // Functions
    function handleSearch(event) {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        searchTerm = event.target.value;
        currentPage = 1;
      }, 300);
    }
  
    function handleSort(column) {
      if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = column;
        sortDirection = 'asc';
      }
    }
  
    function validateForm(formData) {
      const errors = {};
      
      if (!formData.name.trim()) {
        errors.name = 'Promotion name is required';
      }
      
      const discount = parseInt(formData.discount);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        errors.discount = 'Discount must be between 0 and 100';
      }
      
      if (!formData.startDate) {
        errors.startDate = 'Start date is required';
      }
      
      if (!formData.endDate) {
        errors.endDate = 'End date is required';
      }
      
      if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
        errors.endDate = 'End date must be after start date';
      }
      
      if (!formData.status) {
        errors.status = 'Status is required';
      }
      
      return errors;
    }
  
    function resetAddForm() {
      addForm = {
        name: '',
        discount: '',
        startDate: '',
        endDate: '',
        status: 'Active'
      };
      addErrors = {};
    }
  
    function resetEditForm() {
      editForm = {
        name: '',
        discount: '',
        startDate: '',
        endDate: '',
        status: 'Active'
      };
      editErrors = {};
    }
  
    function openAddModal() {
      resetAddForm();
      showAddModal = true;
    }
  
    function closeAddModal() {
      showAddModal = false;
      resetAddForm();
    }
  
    function openEditModal(promotion) {
      editingPromotion = promotion;
      editForm = {
        name: promotion.name,
        discount: promotion.discount.toString(),
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        status: promotion.status
      };
      editErrors = {};
      showEditModal = true;
    }
  
    function closeEditModal() {
      showEditModal = false;
      editingPromotion = null;
      resetEditForm();
    }
  
    function addPromotion() {
      addErrors = validateForm(addForm);
      
      if (Object.keys(addErrors).length === 0) {
        const newPromotion = {
          id: promotions.length ? Math.max(...promotions.map(p => p.id)) + 1 : 1,
          name: addForm.name.trim(),
          discount: parseInt(addForm.discount),
          startDate: addForm.startDate,
          endDate: addForm.endDate,
          status: addForm.status
        };
        
        promotions = [...promotions, newPromotion];
        closeAddModal();
        console.log('Promotion added:', newPromotion);
      }
    }
  
    function updatePromotion() {
      editErrors = validateForm(editForm);
      
      if (Object.keys(editErrors).length === 0) {
        promotions = promotions.map(p => 
          p.id === editingPromotion.id 
            ? {
                ...p,
                name: editForm.name.trim(),
                discount: parseInt(editForm.discount),
                startDate: editForm.startDate,
                endDate: editForm.endDate,
                status: editForm.status
              }
            : p
        );
        closeEditModal();
        console.log('Promotion updated:', editingPromotion.id);
      }
    }
  
    function deletePromotion(id) {
      if (confirm('Are you sure you want to delete this promotion?')) {
        promotions = promotions.filter(p => p.id !== id);
        console.log('Promotion deleted:', id);
      }
    }
  
    function changePage(page) {
      if (page === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (page === 'next' && currentPage < totalPages) {
        currentPage++;
      } else if (typeof page === 'number' && page >= 1 && page <= totalPages) {
        currentPage = page;
      }
    }
  
    function generatePaginationButtons() {
      const buttons = [];
      const maxButtons = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }
  
      return buttons;
    }
  
    function handleKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        openAddModal();
      }
      
      if (event.key === 'Escape') {
        if (showAddModal) closeAddModal();
        if (showEditModal) closeEditModal();
      }
      
      if (event.key === 'Enter') {
        if (showAddModal) addPromotion();
        if (showEditModal) updatePromotion();
      }
    }
  
    onMount(() => {
      document.addEventListener('keydown', handleKeydown);
      
      return () => {
        document.removeEventListener('keydown', handleKeydown);
      };
    });
</script>

<div>
    <!-- Promotions Card -->
    <div>
      <div>
        <h2>Promotions</h2>
        <div>
          <div>Total Promotions: <span>{totalPromotions}</span></div>
          <button on:click={openAddModal} aria-label="Add New Promotion">Add Promotion</button>
        </div>
      </div>
      
      <div>
        <div>
          <input 
            type="text" 
            placeholder="Search by Promotion Name or Status..." 
            on:input={handleSearch}
            aria-label="Search Promotions"
          >
        </div>
        
        <div>
          <table aria-label="Promotions Table">
            <thead>
              <tr>
                <th on:click={() => handleSort('id')}>
                  No
                </th>
                <th on:click={() => handleSort('name')}>
                  Promotion Name
                </th>
                <th on:click={() => handleSort('discount')}>
                  Discount
                </th>
                <th on:click={() => handleSort('startDate')}>
                  Start Date
                </th>
                <th on:click={() => handleSort('endDate')}>
                  End Date
                </th>
                <th on:click={() => handleSort('status')}>
                  Status
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each paginatedPromotions as promotion, index}
                <tr>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{promotion.name}</td>
                  <td>{promotion.discount}%</td>
                  <td>{promotion.startDate}</td>
                  <td>{promotion.endDate}</td>
                  <td>
                    <span>{promotion.status}</span>
                  </td>
                  <td>
                    <button 
                      on:click={() => openEditModal(promotion)} 
                      aria-label="Edit Promotion"
                    >
                      Edit
                    </button>
                    <button 
                      on:click={() => deletePromotion(promotion.id)} 
                      aria-label="Delete Promotion"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              {/each}
              
              {#if paginatedPromotions.length === 0}
                <tr>
                  <td colspan="7">
                    No promotions found
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
        
        {#if totalPages > 1}
          <div role="navigation" aria-label="Pagination">
            <button 
              on:click={() => changePage('prev')} 
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              Prev
            </button>
            
            <span>
              {#each generatePaginationButtons() as page}
                <button 
                  on:click={() => changePage(page)}
                  style={page === currentPage ? 'font-weight: bold;' : ''}
                >
                  {page}
                </button>
              {/each}
            </span>
            
            <button 
              on:click={() => changePage('next')} 
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        {/if}
      </div>
    </div>
</div>

<!-- Add Promotion Modal -->
{#if showAddModal}
  <div on:click={closeAddModal}>
    <div on:click|stopPropagation role="dialog" aria-labelledby="addPromotionTitle">
      <div>
        <h2 id="addPromotionTitle">Add Promotion</h2>
        <button on:click={closeAddModal} aria-label="Close Modal">×</button>
      </div>
      
      <div>
        <div>
          <label for="addName">Promotion Name</label>
          <input 
            type="text" 
            id="addName"
            bind:value={addForm.name}
            placeholder="Enter promotion name" 
          >
          {#if addErrors.name}
            <span>{addErrors.name}</span>
          {/if}
        </div>
        
        <div>
          <label for="addDiscount">Discount (%)</label>
          <input 
            type="number" 
            id="addDiscount"
            bind:value={addForm.discount}
            placeholder="Enter discount percentage" 
            min="0" 
            max="100"
          >
          {#if addErrors.discount}
            <span>{addErrors.discount}</span>
          {/if}
        </div>
        
        <div>
          <label for="addStartDate">Start Date</label>
          <input 
            type="date" 
            id="addStartDate"
            bind:value={addForm.startDate}
          >
          {#if addErrors.startDate}
            <span>{addErrors.startDate}</span>
          {/if}
        </div>
        
        <div>
          <label for="addEndDate">End Date</label>
          <input 
            type="date" 
            id="addEndDate"
            bind:value={addForm.endDate}
          >
          {#if addErrors.endDate}
            <span>{addErrors.endDate}</span>
          {/if}
        </div>
        
        <div>
          <label for="addStatus">Status</label>
          <select 
            id="addStatus"
            bind:value={addForm.status}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {#if addErrors.status}
            <span>{addErrors.status}</span>
          {/if}
        </div>
      </div>
      
      <div>
        <button on:click={closeAddModal}>Cancel</button>
        <button on:click={addPromotion}>Save</button>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Promotion Modal -->
{#if showEditModal}
  <div on:click={closeEditModal}>
    <div on:click|stopPropagation role="dialog" aria-labelledby="editPromotionTitle">
      <div>
        <h2 id="editPromotionTitle">Edit Promotion</h2>
        <button on:click={closeEditModal} aria-label="Close Modal">×</button>
      </div>
      
      <div>
        <div>
          <label for="editName">Promotion Name</label>
          <input 
            type="text" 
            id="editName"
            bind:value={editForm.name}
          >
          {#if editErrors.name}
            <span>{editErrors.name}</span>
          {/if}
        </div>
        
        <div>
          <label for="editDiscount">Discount (%)</label>
          <input 
            type="number" 
            id="editDiscount"
            bind:value={editForm.discount}
            min="0" 
            max="100"
          >
          {#if editErrors.discount}
            <span>{editErrors.discount}</span>
          {/if}
        </div>
        
        <div>
          <label for="editStartDate">Start Date</label>
          <input 
            type="date" 
            id="editStartDate"
            bind:value={editForm.startDate}
          >
          {#if editErrors.startDate}
            <span>{editErrors.startDate}</span>
          {/if}
        </div>
        
        <div>
          <label for="editEndDate">End Date</label>
          <input 
            type="date" 
            id="editEndDate"
            bind:value={editForm.endDate}
          >
          {#if editErrors.endDate}
            <span>{editErrors.endDate}</span>
          {/if}
        </div>
        
        <div>
          <label for="editStatus">Status</label>
          <select 
            id="editStatus"
            bind:value={editForm.status}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {#if editErrors.status}
            <span>{editErrors.status}</span>
          {/if}
        </div>
      </div>
      
      <div>
        <button on:click={closeEditModal}>Cancel</button>
        <button on:click={updatePromotion}>Update</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Modal styles */
  .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
  }
  
  .modal-content {
      background: white;
      padding: 20px;
      border-radius: var(--radius-md);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
  }
  
  .modal-content form {
      display: flex;
      flex-direction: column;
      gap: 15px;
  }
  
  .modal-content h3 {
      margin: 0 0 10px 0;
      color: var(--text-primary);
  }
  
  .modal-content label {
      font-weight: 500;
      color: var(--text-primary);
  }
  
  .modal-content input {
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
  }
  
  .modal-content input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
  
  .button-group {
      display: flex;
      gap: 10px;
      margin-top: 10px;
  }
  
  .modal-content button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
  }
  
  .modal-content button[type="submit"] {
      background: var(--primary-gradient);
      color: white;
  }
  
  .modal-content button[type="submit"]:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
  }
  
  .modal-content button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
  }
  
  .modal-content button[type="button"] {
      background: var(--text-secondary);
      color: white;
  }
  
  .modal-content button[type="button"]:hover {
      background: var(--text-primary);
  }
  
  .active {
      font-weight: bold;
      background: var(--primary-gradient);
      color: white;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
      .content-card {
          padding: 10px;
      }
      
      .table-container {
          overflow-x: auto;
      }
      
      .modal-content {
          margin: 20px;
          width: calc(100% - 40px);
      }
      
      .button-group {
          flex-direction: column;
      }
  }
</style>