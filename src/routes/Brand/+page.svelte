```svelte
<script>
    import { onMount } from 'svelte';

    // State management
    let brands = [
        { id: 1, brandName: 'Toyota', country: 'Japan', models: 'Corolla, Camry, Yaris' },
        { id: 2, brandName: 'Honda', country: 'Japan', models: 'Civic, Accord, CR-V' },
        { id: 3, brandName: 'Chery', country: 'China', models: 'Tiggo, Arrizo' }
    ];
    let currentPage = 1;
    let searchTerm = '';
    let showAddModal = false;
    let showEditModal = false;
    let editingBrand = null;
    let isLoading = false;
    let formData = { brandName: '', country: '', models: '' };
    let formErrors = {};
    let successMessage = '';
    const itemsPerPage = 10;

    // Reactive: Search & filter
    $: filteredBrands = brands.filter(brand =>
        brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
    $: paginatedBrands = filteredBrands.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Modal handling
    function openAddModal() {
        resetForm();
        showAddModal = true;
        focusModal();
    }

    function openEditModal(brand) {
        editingBrand = { ...brand };
        formData = { ...brand };
        showEditModal = true;
        focusModal();
    }

    function closeModals() {
        showAddModal = false;
        showEditModal = false;
        editingBrand = null;
        formErrors = {};
        successMessage = '';
    }

    // Form validation
    function validateForm(data) {
        const errors = {};
        if (!data.brandName?.trim()) errors.brandName = 'Brand name is required';
        if (!data.country?.trim()) errors.country = 'Country is required';
        if (!data.models?.trim()) errors.models = 'Supported models are required';
        if (brands.some(b => b.brandName === data.brandName && b.id !== (editingBrand?.id || 0))) {
            errors.brandName = 'Brand name must be unique';
        }
        return errors;
    }

    // CRUD Operations
    async function handleAddBrand() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            const newBrand = {
                id: brands.length ? Math.max(...brands.map(b => b.id)) + 1 : 1,
                ...formData
            };
            brands = [...brands, newBrand];
            showSuccess('Brand added successfully!');
            closeModals();
        } catch (err) {
            formErrors = { general: 'Failed to add brand: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    async function handleEditBrand() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            brands = brands.map(brand =>
                brand.id === editingBrand.id ? { ...brand, ...formData } : brand
            );
            showSuccess('Brand updated successfully!');
            closeModals();
        } catch (err) {
            formErrors = { general: 'Failed to update brand: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    function deleteBrand(id) {
        if (confirm('Are you sure you want to delete this brand?')) {
            brands = brands.filter(brand => brand.id !== id);
            showSuccess('Brand deleted successfully!');
        }
    }

    // Success message
    function showSuccess(message) {
        successMessage = message;
        setTimeout(() => successMessage = '', 3000);
    }

    // Reset form
    function resetForm() {
        formData = { brandName: '', country: '', models: '' };
        formErrors = {};
    }

    // Pagination
    function changePage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    // Focus management for modals
    function focusModal() {
        setTimeout(() => {
            const firstInput = document.querySelector('.modal-content input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Keyboard shortcuts
    onMount(() => {
        function handleKeydown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
            if (e.key === 'Escape') {
                closeModals();
            }
            if (e.key === 'Enter' && (showAddModal || showEditModal)) {
                if (showAddModal) handleAddBrand();
                if (showEditModal) handleEditBrand();
            }
        }
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });
</script>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-car"></i> Available Brand
        </div>
    </div>

    <h1 class="section-header">Available Brands</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Car Brands</h2>
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search by Brand Name or Country..." aria-label="Search Brands" bind:value={searchTerm}>
                    <i class="fas fa-search"></i>
                </div>
                <button class="btn btn-primary" on:click={openAddModal} aria-label="Add New Brand">
                    <i class="fas fa-plus"></i> Add Brand
                </button>
            </div>
        </div>
        <div class="card-body">
            {#if isLoading}
                <div class="loading-spinner">Loading...</div>
            {:else}
                <div>Total Brands: {filteredBrands.length}</div>
                <div class="table-container">
                    <table class="data-table" aria-label="Brands Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Brand Name</th>
                                <th>Country</th>
                                <th>Supported Models</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="brandsTable">
                            {#each paginatedBrands as brand}
                                <tr>
                                    <td>{brand.id}</td>
                                    <td>{brand.brandName}</td>
                                    <td>{brand.country}</td>
                                    <td>{brand.models}</td>
                                    <td>
                                        <button class="action-btn" on:click={() => openEditModal(brand)} aria-label="Edit Brand">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn error" on:click={() => deleteBrand(brand.id)} aria-label="Delete Brand">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="pagination" role="navigation" aria-label="Pagination">
                    <button on:click={() => changePage(currentPage - 1)} aria-label="Previous Page" disabled={currentPage === 1}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                        <button class:active={page === currentPage} on:click={() => changePage(page)} aria-current={page === currentPage ? 'page' : null}>
                            {page}
                        </button>
                    {/each}
                    <button on:click={() => changePage(currentPage + 1)} aria-label="Next Page" disabled={currentPage === totalPages}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            {/if}
            {#if successMessage}
                <div class="success-message">{successMessage}</div>
            {/if}
            {#if formErrors.general}
                <div class="error-message">{formErrors.general}</div>
            {/if}
        </div>
    </div>

    <!-- Add Brand Modal -->
    {#if showAddModal}
        <div class="modal" role="dialog" aria-labelledby="addModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="addModalTitle">Add New Brand</h2>
                    <button on:click={closeModals} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleAddBrand}>
                        <div class="form-group">
                            <label for="brandName">Brand Name</label>
                            <input type="text" id="brandName" bind:value={formData.brandName} aria-required="true" aria-invalid={formErrors.brandName ? 'true' : 'false'} />
                            {#if formErrors.brandName}
                                <small style="color: red;">{formErrors.brandName}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="country">Country</label>
                            <input type="text" id="country" bind:value={formData.country} aria-required="true" aria-invalid={formErrors.country ? 'true' : 'false'} />
                            {#if formErrors.country}
                                <small style="color: red;">{formErrors.country}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="models">Supported Models</label>
                            <input type="text" id="models" bind:value={formData.models} aria-required="true" aria-invalid={formErrors.models ? 'true' : 'false'} placeholder="e.g., Corolla, Camry, Yaris" />
                            {#if formErrors.models}
                                <small style="color: red;">{formErrors.models}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Brand'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    {/if}

    <!-- Edit Brand Modal -->
    {#if showEditModal}
        <div class="modal" role="dialog" aria-labelledby="editModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="editModalTitle">Edit Brand</h2>
                    <button on:click={closeModals} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleEditBrand}>
                        <div class="form-group">
                            <label for="brandName">Brand Name</label>
                            <input type="text" id="brandName" bind:value={formData.brandName} aria-required="true" aria-invalid={formErrors.brandName ? 'true' : 'false'} />
                            {#if formErrors.brandName}
                                <small style="color: red;">{formErrors.brandName}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="country">Country</label>
                            <input type="text" id="country" bind:value={formData.country} aria-required="true" aria-invalid={formErrors.country ? 'true' : 'false'} />
                            {#if formErrors.country}
                                <small style="color: red;">{formErrors.country}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="models">Supported Models</label>
                            <input type="text" id="models" bind:value={formData.models} aria-required="true" aria-invalid={formErrors.models ? 'true' : 'false'} placeholder="e.g., Corolla, Camry, Yaris" />
                            {#if formErrors.models}
                                <small style="color: red;">{formErrors.models}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Brand'}
                        </button>
                    </form>
                </div>
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
        width: 90%;
        max-width: 500px;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
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
    .loading-spinner::before {
        content: '';
        width: 24px;
        height: 24px;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--text-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .success-message {
        color: green;
        padding: var(--spacing-md);
        text-align: center;
    }
    .error-message {
        color: red;
        padding: var(--spacing-md);
        text-align: center;
    }
    .table-container {
        overflow-x: auto;
    }
    .data-table {
        width: 100%;
        min-width: 600px;
    }
    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            padding: var(--spacing-md);
        }
        .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
        }
    }
</style>
```