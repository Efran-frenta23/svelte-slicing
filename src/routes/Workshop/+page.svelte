<script>
    import { onMount } from 'svelte';

    // State for sidebar, modals, and data
    let isSidebarCollapsed = false;
    let isAnimating = false;
    let showAddModal = false;
    let showEditModal = false;
    let editingWorkshop = null;
    let searchTerm = '';
    let currentPage = 1;
    const itemsPerPage = 5;
    let isLoading = true;

    // Workshop data
    let workshops = [
        { id: 1, name: 'Jakarta Branch', location: 'Jakarta', contact: '+62 21 1234 5678', captain: 'Maryadi' },
        { id: 2, name: 'Bandung Branch', location: 'Bandung', contact: '+62 22 8765 4321', captain: 'Slamet' },
        { id: 3, name: 'Surabaya Branch', location: 'Surabaya', contact: '+62 31 5678 1234', captain: 'Yanto' },
    ];

    // Form data for add/edit
    let formData = { name: '', location: '', contact: '', captain: '' };
    let formErrors = {};

    // Reactive: Filtered workshops based on search
    $: filteredWorkshops = workshops.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.captain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredWorkshops.length / itemsPerPage);
    $: paginatedWorkshops = filteredWorkshops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Sidebar toggle
    function toggleSidebar() {
        if (isAnimating) return;
        isAnimating = true;
        isSidebarCollapsed = !isSidebarCollapsed;
        setTimeout(() => { isAnimating = false; }, 300);
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

    // Form submission
    function handleAddWorkshop() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        workshops = [...workshops, {
            id: workshops.length + 1,
            name: formData.name,
            location: formData.location,
            contact: formData.contact,
            captain: formData.captain
        }];
        console.log('Workshop added successfully!');
        hideModal();
        resetForm();
    }

    function handleEditWorkshop() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        workshops = workshops.map(w =>
            w.id === editingWorkshop.id ? { ...w, ...formData } : w
        );
        console.log('Workshop updated successfully!');
        hideModal();
    }

    function deleteWorkshop(id) {
        if (confirm('Are you sure you want to delete this workshop?')) {
            workshops = workshops.filter(w => w.id !== id);
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
        formData = { ...workshop };
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
            if (e.key === 'Enter' && (showAddModal || showEditModal)) {
                if (showAddModal) handleAddWorkshop();
                if (showEditModal) handleEditWorkshop();
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
            <i class="fas fa-info-circle"></i> Workshop Information
        </div>
        <button class="btn btn-primary" on:click={() => showModal('add')} aria-label="Add New Workshop">
            <i class="fas fa-plus"></i> Add Workshop
        </button>
    </div>

    <h1 class="section-header">Workshop Management</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Workshops</h2>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search workshops..." aria-label="Search Workshops" bind:value={searchTerm}>
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>
        <div class="card-body">
            {#if isLoading}
                <div class="loading-spinner">Loading...</div>
            {:else}
                <div class="table-container">
                    <table class="data-table" aria-label="Workshops Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Workshop Name</th>
                                <th>Location</th>
                                <th>Contact</th>
                                <th>Captain</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="workshopsTable">
                            {#each paginatedWorkshops as workshop}
                                <tr>
                                    <td>{workshop.id}</td>
                                    <td>{workshop.name}</td>
                                    <td>{workshop.location}</td>
                                    <td>{workshop.contact}</td>
                                    <td>{workshop.captain}</td>
                                    <td>
                                        <button class="action-btn" on:click={() => handleEdit(workshop)} aria-label="Edit Workshop">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn error" on:click={() => deleteWorkshop(workshop.id)} aria-label="Delete Workshop">
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
                        <button class:active={page === currentPage} on:click={() => changePage(page)} aria-current={page === currentPage ? 'page' : null}>
                            {page}
                        </button>
                    {/each}
                    <button on:click={() => changePage(currentPage + 1)} aria-label="Next Page">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
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
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" aria-invalid={formErrors.name ? 'true' : 'false'} />
                            {#if formErrors.name}
                                <small style="color: red;">{formErrors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="location">Location</label>
                            <input type="text" id="location" bind:value={formData.location} aria-required="true" aria-invalid={formErrors.location ? 'true' : 'false'} />
                            {#if formErrors.location}
                                <small style="color: red;">{formErrors.location}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="contact">Contact</label>
                            <input type="text" id="contact" bind:value={formData.contact} aria-required="true" aria-invalid={formErrors.contact ? 'true' : 'false'} />
                            {#if formErrors.contact}
                                <small style="color: red;">{formErrors.contact}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="captain">Captain</label>
                            <input type="text" id="captain" bind:value={formData.captain} aria-required="true" aria-invalid={formErrors.captain ? 'true' : 'false'} />
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
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" aria-invalid={formErrors.name ? 'true' : 'false'} />
                            {#if formErrors.name}
                                <small style="color: red;">{formErrors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="location">Location</label>
                            <input type="text" id="location" bind:value={formData.location} aria-required="true" aria-invalid={formErrors.location ? 'true' : 'false'} />
                            {#if formErrors.location}
                                <small style="color: red;">{formErrors.location}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="contact">Contact</label>
                            <input type="text" id="contact" bind:value={formData.contact} aria-required="true" aria-invalid={formErrors.contact ? 'true' : 'false'} />
                            {#if formErrors.contact}
                                <small style="color: red;">{formErrors.contact}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="captain">Captain</label>
                            <input type="text" id="captain" bind:value={formData.captain} aria-required="true" aria-invalid={formErrors.captain ? 'true' : 'false'} />
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
    #sidebar {
        transition: width 0.3s ease;
    }
    #sidebar.collapsed {
        width: 60px;
    }
    #sidebar.collapsed ul li a {
        display: none;
    }
</style>