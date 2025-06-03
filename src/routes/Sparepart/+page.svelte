<script>
    import { onMount } from 'svelte';

    // State management & data
    let spareParts = [
        { id: 1, name: 'Oil Filter', code: 'OF-12345', brand: 'Toyota', stock: 50, price: 150000 },
        { id: 2, name: 'Brake Pad', code: 'BP-67890', brand: 'Honda', stock: 30, price: 300000 },
        { id: 3, name: 'Air Filter', code: 'AF-11223', brand: 'Chery', stock: 20, price: 100000 },
    ];
    let currentPage = 1;
    let sortColumn = 'id';
    let sortDirection = 'asc';
    let searchTerm = '';
    let showAddModal = false;
    let showEditModal = false;
    let editingItem = null;
    let formData = { name: '', code: '', brand: '', stock: 0, price: 0 };
    let formErrors = {};
    let isLoading = true;
    const itemsPerPage = 10;

    // Reactive: Search & filter
    $: filteredSpareParts = spareParts.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Sorting
    $: sortedSpareParts = filteredSpareParts.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        if (sortColumn === 'stock' || sortColumn === 'price') {
            valA = parseInt(valA);
            valB = parseInt(valB);
        }
        return sortDirection === 'asc' ? 
            (valA < valB ? -1 : 1) : 
            (valA > valB ? -1 : 1);
    });

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredSpareParts.length / itemsPerPage);
    $: paginatedData = sortedSpareParts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Modal functions
    function showModal(type) {
        if (type === 'add') {
            resetForm();
            showAddModal = true;
        } else if (type === 'edit') {
            showEditModal = true;
        }
    }

    function hideModal() {
        showAddModal = false;
        showEditModal = false;
        editingItem = null;
        formErrors = {};
    }

    // CRUD Operations
    function addSparePart() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        const newSparePart = {
            id: spareParts.length + 1,
            name: formData.name,
            code: formData.code,
            brand: formData.brand,
            stock: parseInt(formData.stock),
            price: parseInt(formData.price)
        };
        spareParts = [...spareParts, newSparePart];
        hideModal();
    }

    function updateSparePart() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        spareParts = spareParts.map(part =>
            part.id === editingItem.id ? { ...part, ...formData } : part
        );
        hideModal();
    }

    function deleteSparePart(id) {
        if (confirm('Are you sure you want to delete this spare part?')) {
            spareParts = spareParts.filter(part => part.id !== id);
        }
    }

    // Form validation
    function validateForm(data) {
        const errors = {};
        if (!data.name?.trim()) errors.name = 'Part name is required';
        if (!data.code?.trim()) errors.code = 'Part code is required';
        if (!data.brand) errors.brand = 'Brand is required';
        if (!data.stock || data.stock < 0) errors.stock = 'Valid stock quantity is required';
        if (!data.price || data.price < 0) errors.price = 'Valid price is required';
        return errors;
    }

    // Table sorting
    function sortTable(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
    }

    // Pagination
    function changePage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    // Event handlers
    function handleEdit(part) {
        editingItem = part;
        formData = { ...part };
        showModal('edit');
    }

    function handleSearch(event) {
        searchTerm = event.target.value;
        currentPage = 1; // Reset to first page
    }

    // Reset form
    function resetForm() {
        formData = { name: '', code: '', brand: '', stock: 0, price: 0 };
        formErrors = {};
    }

    // Keyboard shortcuts
    onMount(() => {
        function handleKeydown(event) {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                showModal('add');
            }
            if (event.key === 'Escape') {
                hideModal();
            }
            if (event.key === 'Enter' && (showAddModal || showEditModal)) {
                if (showAddModal) addSparePart();
                if (showEditModal) updateSparePart();
            }
        }

        // Simulate loading
        setTimeout(() => {
            isLoading = false;
        }, 1000);

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });
</script>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-cog"></i> Spare Part
        </div>
        <div class="user-info">
            <div class="user-avatar">A</div>
            <div>
                <div style="font-size: var(--font-size-sm); font-weight: 600;">Autopulse</div>
                <div style="font-size: var(--font-size-xs); opacity: 0.8;">Super Admin</div>
            </div>
            <i class="fas fa-chevron-down" style="font-size: 10px; opacity: 0.8;"></i>
        </div>
    </div>

    <h1 class="section-header">Spare Part Inventory</h1>

    <div class="content-body" class:loading={isLoading}>
        {#if isLoading}
            <div class="loading-spinner">Loading...</div>
        {:else}
            <div class="content-card">
                <div class="card-header">
                    <h2 class="card-title">Spare Parts</h2>
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div style="color: rgba(255,255,255,0.8); font-size: var(--font-size-sm);">
                            Total Parts: {filteredSpareParts.length}
                        </div>
                        <button class="btn btn-primary" on:click={() => showModal('add')} aria-label="Add New Spare Part">
                            <i class="fas fa-plus"></i> Add Spare Part
                        </button>
register
                    </div>
                </div>
                <div class="card-body">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                        <div class="search-box">
                            <input type="text" id="searchInput" placeholder="Search by Part Name, Code, or Brand..." aria-label="Search Spare Parts" on:input={handleSearch}>
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="data-table" aria-label="Spare Parts Table">
                            <thead>
                                <tr>
                                    <th data-sort="id" on:click={() => sortTable('id')}>No <i class="fas fa-sort"></i></th>
                                    <th data-sort="name" on:click={() => sortTable('name')}>Part Name <i class="fas fa-sort"></i></th>
                                    <th data-sort="code" on:click={() => sortTable('code')}>Part Code <i class="fas fa-sort"></i></th>
                                    <th data-sort="brand" on:click={() => sortTable('brand')}>Brand <i class="fas fa-sort"></i></th>
                                    <th data-sort="stock" on:click={() => sortTable('stock')}>Stock <i class="fas fa-sort"></i></th>
                                    <th data-sort="price" on:click={() => sortTable('price')}>Price <i class="fas fa-sort"></i></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="sparePartTable">
                                {#each paginatedData as part}
                                    <tr>
                                        <td>{part.id}</td>
                                        <td>{part.name}</td>
                                        <td>{part.code}</td>
                                        <td>{part.brand}</td>
                                        <td>{part.stock}</td>
                                        <td>Rp {part.price.toLocaleString()}</td>
                                        <td>
                                            <button class="action-btn edit" on:click={() => handleEdit(part)} aria-label="Edit Spare Part">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" on:click={() => deleteSparePart(part.id)} aria-label="Delete Spare Part">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination" role="navigation" aria-label="Pagination">
                        <button on:click={() => changePage(currentPage - 1)} aria-label="Previous Page">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                            <button class:active={page === currentPage} on:click={() => changePage(page)}>
                                {page}
                            </button>
                        {/each}
                        <button on:click={() => changePage(currentPage + 1)} aria-label="Next Page">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <!-- Add Modal -->
    {#if showAddModal}
        <div class="modal">
            <div class="modal-content">
                <button class="btn-close" on:click={hideModal} aria-label="Close Modal">X</button>
                <h3>Add Spare Part</h3>
                <form>
                    <div class="form-group">
                        <label for="name">Part Name</label>
                        <input type="text" id="name" bind:value={formData.name} aria-invalid={formErrors.name ? 'true' : 'false'} />
                        {#if formErrors.name}
                            <small style="color: red;">{formErrors.name}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="code">Part Code</label>
                        <input type="text" id="code" bind:value={formData.code} aria-invalid={formErrors.code ? 'true' : 'false'} />
                        {#if formErrors.code}
                            <small style="color: red;">{formErrors.code}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="brand">Brand</label>
                        <input type="text" id="brand" bind:value={formData.brand} aria-invalid={formErrors.brand ? 'true' : 'false'} />
                        {#if formErrors.brand}
                            <small style="color: red;">{formErrors.brand}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="stock">Stock</label>
                        <input type="number" id="stock" bind:value={formData.stock} aria-invalid={formErrors.stock ? 'true' : 'false'} />
                        {#if formErrors.stock}
                            <small style="color: red;">{formErrors.stock}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="number" id="price" bind:value={formData.price} aria-invalid={formErrors.price ? 'true' : 'false'} />
                        {#if formErrors.price}
                            <small style="color: red;">{formErrors.price}</small>
                        {/if}
                    </div>
                    <button type="button" class="btn btn-primary" on:click={addSparePart}>Add</button>
                </form>
            </div>
        </div>
    {/if}

    <!-- Edit Modal -->
    {#if showEditModal}
        <div class="modal">
            <div class="modal-content">
                <button class="btn-close" on:click={hideModal} aria-label="Close Modal">X</button>
                <h3>Edit Spare Part</h3>
                <form>
                    <div class="form-group">
                        <label for="name">Part Name</label>
                        <input type="text" id="name" bind:value={formData.name} aria-invalid={formErrors.name ? 'true' : 'false'} />
                        {#if formErrors.name}
                            <small style="color: red;">{formErrors.name}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="code">Part Code</label>
                        <input type="text" id="code" bind:value={formData.code} aria-invalid={formErrors.code ? 'true' : 'false'} />
                        {#if formErrors.code}
                            <small style="color: red;">{formErrors.code}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="brand">Brand</label>
                        <input type="text" id="brand" bind:value={formData.brand} aria-invalid={formErrors.brand ? 'true' : 'false'} />
                        {#if formErrors.brand}
                            <small style="color: red;">{formErrors.brand}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="stock">Stock</label>
                        <input type="number" id="stock" bind:value={formData.stock} aria-invalid={formErrors.stock ? 'true' : 'false'} />
                        {#if formErrors.stock}
                            <small style="color: red;">{formErrors.stock}</small>
                        {/if}
                    </div>
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="number" id="price" bind:value={formData.price} aria-invalid={formErrors.price ? 'true' : 'false'} />
                        {#if formErrors.price}
                            <small style="color: red;">{formErrors.price}</small>
                        {/if}
                    </div>
                    <button type="button" class="btn btn-primary" on:click={updateSparePart}>Update</button>
                </form>
            </div>
        </div>
    {/if}
</main>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        background: white;
        padding: var(--spacing-lg);
        border-radius: 8px;
        position: relative;
        width: 90%;
        max-width: 500px;
    }
    .btn-close {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .form-group {
        margin-bottom: var(--spacing-md);
    }
    .form-group label {
        display: block;
        margin-bottom: var(--spacing-sm);
    }
    .form-group input {
        width: 100%;
        padding: var(--spacing-sm);
        border: 1px solid var(--border-color);
        border-radius: 4px;
    }
    .loading-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-lg);
    }
</style>