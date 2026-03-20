<script>
    import { writable } from 'svelte/store';
    import { invalidateAll } from '$app/navigation';

    let spareparts = [];
    let searchTerm = '';
    let currentPage = 1;
    const itemsPerPage = 10;
    let modalStore = writable({ visible: false, modalId: '', selectedSparepart: null });
    let isLoading = true;
    let successMessage = '';
    let errorMessage = '';

    // Load spareparts on mount
    async function loadSpareparts() {
        isLoading = true;
        try {
            const response = await fetch('/api/spareparts');
            if (response.ok) {
                spareparts = await response.json();
            }
        } catch (error) {
            errorMessage = 'Failed to load spareparts: ' + error.message;
        } finally {
            isLoading = false;
        }
    }

    // Reactive filtered and paginated spareparts
    $: filteredSpareparts = spareparts.filter(sparepart =>
        sparepart.sparepart_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sparepart.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sparepart.sparepart_brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    $: paginatedSpareparts = filteredSpareparts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    $: totalPages = Math.ceil(filteredSpareparts.length / itemsPerPage) || 1;

    // Add new sparepart
    async function handleAddSparepart(event) {
        event.preventDefault();
        const form = event.target;
        const newSparepart = {
            service_type: form.serviceType.value,
            sparepart_name: form.sparepartName.value,
            sparepart_brand: form.sparepartBrand.value
        };
        const response = await fetch('/api/spareparts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSparepart)
        });
        if (response.ok) {
            successMessage = 'Sparepart added successfully!';
            setTimeout(() => successMessage = '', 3000);
            await loadSpareparts();
            closeModal();
            form.reset();
        } else {
            errorMessage = 'Error adding sparepart';
            setTimeout(() => errorMessage = '', 3000);
        }
    }

    // Edit sparepart
    async function handleEditSparepart(event) {
        event.preventDefault();
        const form = event.target;
        const updatedSparepart = {
            service_type: form.serviceType.value,
            sparepart_name: form.sparepartName.value,
            sparepart_brand: form.sparepartBrand.value
        };
        const response = await fetch(`/api/spareparts/${$modalStore.selectedSparepart.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSparepart)
        });
        if (response.ok) {
            successMessage = 'Sparepart updated successfully!';
            setTimeout(() => successMessage = '', 3000);
            await loadSpareparts();
            closeModal();
            form.reset();
        } else {
            errorMessage = 'Error updating sparepart';
            setTimeout(() => errorMessage = '', 3000);
        }
    }

    // Delete sparepart
    async function handleDeleteSparepart(sparepart) {
        if (!confirm('Are you sure you want to delete this sparepart?')) return;
        
        const response = await fetch(`/api/spareparts/${sparepart.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            successMessage = 'Sparepart deleted successfully!';
            setTimeout(() => successMessage = '', 3000);
            await loadSpareparts();
        } else {
            errorMessage = 'Error deleting sparepart';
            setTimeout(() => errorMessage = '', 3000);
        }
    }

    // Modal management
    function showModal(modalId, sparepart = null) {
        modalStore.set({ visible: true, modalId, selectedSparepart: sparepart });
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalStore.set({ visible: false, modalId: '', selectedSparepart: null });
        document.body.style.overflow = '';
    }

    // Pagination
    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    // Handle search
    function handleSearch(event) {
        searchTerm = event.target.value;
        currentPage = 1;
    }

    // Initialize
    import { onMount } from 'svelte';
    onMount(() => {
        loadSpareparts();
    });
</script>

<svelte:head>
    <title>Autopulse - Spareparts Management</title>
    <meta name="description" content="Autopulse Dashboard - Spareparts Management" />
</svelte:head>

<div class="content-card">
    <div class="card-header">
        <h2>Spareparts Management</h2>
        <div class="search-container">
            <div class="search-box">
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search spareparts..."
                    aria-label="Search Spareparts"
                    bind:value={searchTerm}
                    on:input={handleSearch}
                />
                <i class="fas fa-search"></i>
            </div>
            <button class="btn btn-primary" on:click={() => showModal('addSparepartModal')}>
                <i class="fas fa-plus"></i> Add Sparepart
            </button>
        </div>
    </div>
    <div class="card-body">
        {#if successMessage}
            <div class="alert alert-success">{successMessage}</div>
        {/if}
        {#if errorMessage}
            <div class="alert alert-error">{errorMessage}</div>
        {/if}
        
        {#if isLoading}
            <div class="loading-spinner">Loading...</div>
        {:else if !spareparts.length}
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>No spareparts found. Add your first sparepart!</p>
            </div>
        {:else}
            <div class="table-container">
                <table class="data-table" aria-label="Spareparts Table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Service Type</th>
                            <th>Sparepart Name</th>
                            <th>Sparepart Brand</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each paginatedSpareparts as sparepart, index}
                            <tr>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{sparepart.service_type || '-'}</td>
                                <td>{sparepart.sparepart_name || '-'}</td>
                                <td>{sparepart.sparepart_brand || '-'}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button
                                            class="action-btn edit"
                                            aria-label="Edit Sparepart"
                                            on:click={() => showModal('editSparepartModal', sparepart)}
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button
                                            class="action-btn delete"
                                            aria-label="Delete Sparepart"
                                            on:click={() => handleDeleteSparepart(sparepart)}
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            {#if totalPages > 1}
                <div class="pagination" role="navigation" aria-label="Pagination">
                    <button
                        aria-label="Previous Page"
                        on:click={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    {#each Array(totalPages) as _, i}
                        <button
                            class:active={currentPage === i + 1}
                            aria-current={currentPage === i + 1 ? 'page' : undefined}
                            on:click={() => goToPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    {/each}
                    <button
                        aria-label="Next Page"
                        on:click={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>

<!-- Add Sparepart Modal -->
{#if $modalStore.visible && $modalStore.modalId === 'addSparepartModal'}
    <div class="modal" role="dialog" aria-modal="true" on:click={() => closeModal()}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h3>Add New Sparepart</h3>
                <button class="close-btn" on:click={closeModal}>&times;</button>
            </div>
            <form on:submit|preventDefault={handleAddSparepart}>
                <div class="form-group">
                    <label for="serviceType">Service Type</label>
                    <input type="text" id="serviceType" name="serviceType" placeholder="Enter service type" required />
                </div>
                <div class="form-group">
                    <label for="sparepartName">Sparepart Name</label>
                    <input type="text" id="sparepartName" name="sparepartName" placeholder="Enter sparepart name" required />
                </div>
                <div class="form-group">
                    <label for="sparepartBrand">Sparepart Brand</label>
                    <input type="text" id="sparepartBrand" name="sparepartBrand" placeholder="Enter sparepart brand" required />
                </div>
                <div class="button-group">
                    <button type="button" class="btn-secondary" on:click={closeModal}>Cancel</button>
                    <button type="submit" class="btn-primary">Add Sparepart</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Edit Sparepart Modal -->
{#if $modalStore.visible && $modalStore.modalId === 'editSparepartModal'}
    <div class="modal" role="dialog" aria-modal="true" on:click={() => closeModal()}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h3>Edit Sparepart</h3>
                <button class="close-btn" on:click={closeModal}>&times;</button>
            </div>
            <form on:submit|preventDefault={handleEditSparepart}>
                <div class="form-group">
                    <label for="serviceType">Service Type</label>
                    <input
                        type="text"
                        id="serviceType"
                        name="serviceType"
                        value={$modalStore.selectedSparepart.service_type || ''}
                        placeholder="Enter service type"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="sparepartName">Sparepart Name</label>
                    <input
                        type="text"
                        id="sparepartName"
                        name="sparepartName"
                        value={$modalStore.selectedSparepart.sparepart_name || ''}
                        placeholder="Enter sparepart name"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="sparepartBrand">Sparepart Brand</label>
                    <input
                        type="text"
                        id="sparepartBrand"
                        name="sparepartBrand"
                        value={$modalStore.selectedSparepart.sparepart_brand || ''}
                        placeholder="Enter sparepart brand"
                        required
                    />
                </div>
                <div class="button-group">
                    <button type="button" class="btn-secondary" on:click={closeModal}>Cancel</button>
                    <button type="submit" class="btn-primary">Update Sparepart</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .content-card {
        padding: 24px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(30, 58, 138, 0.1);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
    }

    .card-header h2 {
        color: #1e3a8a;
        font-size: 1.5rem;
        margin: 0;
    }

    .search-container {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    }

    .search-box {
        position: relative;
    }

    .search-box input {
        padding: 10px 40px 10px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.875rem;
        transition: border-color 0.2s;
        min-width: 250px;
    }

    .search-box input:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .search-box i {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
    }

    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
    }

    .btn-primary {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
    }

    .btn-secondary {
        background-color: #e2e8f0;
        color: #334155;
    }

    .btn-secondary:hover {
        background-color: #cbd5e1;
    }

    .alert {
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
    }

    .alert-success {
        background-color: #f0fdf4;
        color: #16a34a;
        border-left: 3px solid #16a34a;
    }

    .alert-error {
        background-color: #fef2f2;
        color: #dc2626;
        border-left: 3px solid #dc2626;
    }

    .table-container {
        overflow-x: auto;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
        padding: 14px 16px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }

    .data-table th {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        color: white;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
    }

    .data-table tr:hover {
        background-color: #f8fafc;
    }

    .data-table tr:last-child td {
        border-bottom: none;
    }

    .action-buttons {
        display: flex;
        gap: 8px;
    }

    .action-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .action-btn.edit {
        background-color: #fbbf24;
        color: white;
    }

    .action-btn.edit:hover {
        background-color: #f59e0b;
    }

    .action-btn.delete {
        background-color: #dc2626;
        color: white;
    }

    .action-btn.delete:hover {
        background-color: #b91c1c;
    }

    .pagination {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 24px;
    }

    .pagination button {
        padding: 8px 14px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        font-weight: 600;
        color: #334155;
        transition: all 0.2s;
    }

    .pagination button:hover:not(:disabled) {
        border-color: #3b82f6;
        color: #3b82f6;
    }

    .pagination button.active {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        color: white;
        border-color: transparent;
    }

    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

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
        padding: 24px;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h3 {
        color: #1e3a8a;
        margin: 0;
        font-size: 1.25rem;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #64748b;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: background-color 0.2s;
    }

    .close-btn:hover {
        background-color: #f1f5f9;
    }

    .form-group {
        margin-bottom: 16px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #334155;
    }

    .form-group input {
        width: 100%;
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.875rem;
        transition: border-color 0.2s;
        box-sizing: border-box;
    }

    .form-group input:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .button-group {
        display: flex;
        gap: 12px;
        margin-top: 24px;
    }

    .button-group button {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.875rem;
        transition: all 0.2s;
    }

    .button-group .btn-primary {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        color: white;
    }

    .button-group .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
    }

    .loading-spinner {
        text-align: center;
        padding: 40px;
        color: #64748b;
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #64748b;
    }

    .empty-state i {
        font-size: 4rem;
        color: #cbd5e1;
        margin-bottom: 16px;
    }

    @media (max-width: 768px) {
        .content-card {
            padding: 16px;
        }

        .card-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .search-container {
            width: 100%;
        }

        .search-box input {
            width: 100%;
            min-width: auto;
        }

        .table-container {
            overflow-x: auto;
        }

        .data-table {
            min-width: 600px;
        }

        .modal-content {
            margin: 20px;
            width: calc(100% - 40px);
        }

        .button-group {
            flex-direction: column-reverse;
        }
    }
</style>
