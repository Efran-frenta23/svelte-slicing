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



