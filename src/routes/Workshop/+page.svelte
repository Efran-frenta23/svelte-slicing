<script>
    import { onMount } from 'svelte';

    export let data;

    // State
    let workshops = data.workshops || [];
    let userRole = data.userRole || 'Member';
    let isSidebarCollapsed = false;
    let isAnimating = false;
    let showAddModal = false;
    let showEditModal = false;
    let editingWorkshop = null;
    let searchTerm = '';
    let currentPage = 1;
    const itemsPerPage = 5;
    let isLoading = false;
    let successMessage = '';
    let errorMessage = '';

    // Form data for add/edit
    let formData = { name: '', location: '', contact: '', captain: '' };
    let formErrors = {};

    // Admin check
    $: isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

    // Reactive: Filtered workshops based on search
    $: filteredWorkshops = workshops.filter(row =>
        (row.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.contact || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.captain || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredWorkshops.length / itemsPerPage) || 1;
    $: paginatedWorkshops = filteredWorkshops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Load workshops from API
    async function loadWorkshops() {
        isLoading = true;
        try {
            const response = await fetch('/api/workshops');
            if (response.ok) {
                workshops = await response.json();
            }
        } catch (error) {
            errorMessage = 'Failed to load workshops: ' + error.message;
        } finally {
            isLoading = false;
        }
    }

    // Modal handling
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
        editingWorkshop = null;
        formErrors = {};
    }

    // Form validation
    function validateForm(data) {
        const errors = {};
        if (!data.name?.trim()) errors.name = 'Workshop name is required';
        if (!data.location?.trim()) errors.location = 'Location is required';
        if (!data.contact?.trim()) errors.contact = 'Contact is required';
        if (!data.captain?.trim()) errors.captain = 'Captain is required';
        return errors;
    }

    // Form submission via API
    async function handleAddWorkshop() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        try {
            const response = await fetch('/api/workshops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                successMessage = 'Workshop added successfully!';
                setTimeout(() => successMessage = '', 3000);
                await loadWorkshops();
                hideModal();
                resetForm();
            } else {
                const result = await response.json();
                errorMessage = result.error || 'Error adding workshop';
                setTimeout(() => errorMessage = '', 3000);
            }
        } catch (error) {
            errorMessage = 'Error adding workshop: ' + error.message;
            setTimeout(() => errorMessage = '', 3000);
        }
    }

    async function handleEditWorkshop() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        try {
            const response = await fetch(`/api/workshops/${editingWorkshop.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                successMessage = 'Workshop updated successfully!';
                setTimeout(() => successMessage = '', 3000);
                await loadWorkshops();
                hideModal();
            } else {
                const result = await response.json();
                errorMessage = result.error || 'Error updating workshop';
                setTimeout(() => errorMessage = '', 3000);
            }
        } catch (error) {
            errorMessage = 'Error updating workshop: ' + error.message;
            setTimeout(() => errorMessage = '', 3000);
        }
    }

    async function deleteWorkshop(id) {
        if (!confirm('Are you sure you want to delete this workshop?')) return;
        try {
            const response = await fetch(`/api/workshops/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                successMessage = 'Workshop deleted successfully!';
                setTimeout(() => successMessage = '', 3000);
                await loadWorkshops();
            } else {
                const result = await response.json();
                errorMessage = result.error || 'Error deleting workshop';
                setTimeout(() => errorMessage = '', 3000);
            }
        } catch (error) {
            errorMessage = 'Error deleting workshop: ' + error.message;
            setTimeout(() => errorMessage = '', 3000);
        }
    }

    // Reset form
    function resetForm() {
        formData = { name: '', location: '', contact: '', captain: '' };
        formErrors = {};
    }

    // Edit handler
    function handleEdit(workshop) {
        editingWorkshop = workshop;
        formData = { name: workshop.name, location: workshop.location, contact: workshop.contact, captain: workshop.captain };
        showModal('edit');
    }

    // Pagination
    function changePage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    // Keyboard shortcuts
    onMount(() => {
        function handleKeydown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('#searchInput');
                if (searchInput) searchInput.focus();
            }
            if (e.key === 'Escape') {
                hideModal();
            }
        }

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });
</script>

<svelte:head>
    <title>Autopulse - Workshop Management</title>
    <meta name="description" content="Autopulse Dashboard - Workshop Management" />
</svelte:head>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-warehouse"></i> Workshop Management
        </div>
        <div class="user-info">
            <div class="user-avatar">A</div>
            <div>
                <div style="font-size: var(--font-size-sm); font-weight: 600;">Autopulse</div>
                <div style="font-size: var(--font-size-xs); opacity: 0.8;">{userRole}</div>
            </div>
            <i class="fas fa-chevron-down" style="font-size: 10px; opacity: 0.8;"></i>
        </div>
    </div>

    <h1 class="section-header">Workshop Overview</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Workshops</h2>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search by Name..." aria-label="Search Workshops" bind:value={searchTerm}>
                    <i class="fas fa-search"></i>
                </div>
                {#if isAdmin}
                    <button class="btn btn-primary" on:click={() => showModal('add')}>
                        <i class="fas fa-plus"></i> Add Workshop
                    </button>
                {/if}
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
            {:else}
                <div>Total Workshops: {filteredWorkshops.length}</div>
                <div class="table-container">
                    <table class="data-table" aria-label="Workshops Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Contact</th>
                                <th>Captain</th>
                                {#if isAdmin}
                                    <th>Actions</th>
                                {/if}
                            </tr>
                        </thead>
                        <tbody>
                            {#each paginatedWorkshops as workshop, i}
                                <tr>
                                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                    <td>{workshop.name || '-'}</td>
                                    <td>{workshop.location || '-'}</td>
                                    <td>{workshop.contact || '-'}</td>
                                    <td>{workshop.captain || '-'}</td>
                                    {#if isAdmin}
                                        <td>
                                            <div class="action-buttons">
                                                <button class="action-btn edit" on:click={() => handleEdit(workshop)} aria-label="Edit Workshop">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-btn delete" on:click={() => deleteWorkshop(workshop.id)} aria-label="Delete Workshop">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    {/if}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                {#if totalPages > 1}
                    <div class="pagination" role="navigation" aria-label="Pagination">
                        <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous Page">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                            <button class:active={page === currentPage} on:click={() => changePage(page)} aria-current={page === currentPage ? 'page' : null}>
                                {page}
                            </button>
                        {/each}
                        <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next Page">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                {/if}
            {/if}
        </div>
    </div>

    <!-- Add Workshop Modal -->
    {#if showAddModal}
        <div class="modal" role="dialog" aria-labelledby="addModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="addModalTitle">Add New Workshop</h2>
                    <button on:click={hideModal} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleAddWorkshop}>
                        <div class="form-group">
                            <label for="name">Workshop Name</label>
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" />
                            {#if formErrors.name}
                                <small style="color: red;">{formErrors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="location">Location</label>
                            <input type="text" id="location" bind:value={formData.location} aria-required="true" />
                            {#if formErrors.location}
                                <small style="color: red;">{formErrors.location}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="contact">Contact</label>
                            <input type="text" id="contact" bind:value={formData.contact} aria-required="true" />
                            {#if formErrors.contact}
                                <small style="color: red;">{formErrors.contact}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="captain">Captain</label>
                            <input type="text" id="captain" bind:value={formData.captain} aria-required="true" />
                            {#if formErrors.captain}
                                <small style="color: red;">{formErrors.captain}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary">Add Workshop</button>
                    </form>
                </div>
            </div>
        </div>
    {/if}

    <!-- Edit Workshop Modal -->
    {#if showEditModal}
        <div class="modal" role="dialog" aria-labelledby="editModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="editModalTitle">Edit Workshop</h2>
                    <button on:click={hideModal} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleEditWorkshop}>
                        <div class="form-group">
                            <label for="name">Workshop Name</label>
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" />
                            {#if formErrors.name}
                                <small style="color: red;">{formErrors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="location">Location</label>
                            <input type="text" id="location" bind:value={formData.location} aria-required="true" />
                            {#if formErrors.location}
                                <small style="color: red;">{formErrors.location}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="contact">Contact</label>
                            <input type="text" id="contact" bind:value={formData.contact} aria-required="true" />
                            {#if formErrors.contact}
                                <small style="color: red;">{formErrors.contact}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="captain">Captain</label>
                            <input type="text" id="captain" bind:value={formData.captain} aria-required="true" />
                            {#if formErrors.captain}
                                <small style="color: red;">{formErrors.captain}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary">Update Workshop</button>
                    </form>
                </div>
            </div>
        </div>
    {/if}
</main>
