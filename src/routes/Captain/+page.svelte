```svelte
<script>
    import { onMount } from 'svelte';

    // State management & data
    let captains = [
        { id: 1, name: 'Maryadi', employeeID: 'EMP-001', phone: '+6281211112222', workshop: 'Jakarta Branch' },
        { id: 2, name: 'Slamet', employeeID: 'EMP-002', phone: '+6282133334444', workshop: 'Bandung Branch' },
        { id: 3, name: 'Yanto', employeeID: 'EMP-003', phone: '+6283155556666', workshop: 'Surabaya Branch' }
    ];
    let currentPage = 1;
    let searchTerm = '';
    let showAddModal = false;
    let showEditModal = false;
    let editingCaptain = null;
    let isLoading = false;
    let formData = { name: '', employeeID: '', phone: '', workshop: '' };
    let formErrors = {};
    let successMessage = '';
    const itemsPerPage = 10;

    // Workshop options
    const workshopOptions = ['Jakarta Branch', 'Bandung Branch', 'Surabaya Branch'];

    // Reactive: Search & filter
    $: filteredCaptains = captains.filter(captain =>
        captain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        captain.employeeID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        captain.phone.includes(searchTerm) ||
        captain.workshop.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredCaptains.length / itemsPerPage);
    $: paginatedCaptains = filteredCaptains.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Modal management
    function openAddModal() {
        resetForm();
        showAddModal = true;
        focusModal();
    }

    function openEditModal(captain) {
        editingCaptain = { ...captain };
        formData = { ...captain };
        showEditModal = true;
        focusModal();
    }

    function closeModal() {
        showAddModal = false;
        showEditModal = false;
        editingCaptain = null;
        formErrors = {};
        successMessage = '';
    }

    // Form validation
    const validationRules = {
        name: /^[A-Za-z\s]{2,50}$/,
        employeeID: /^EMP-[0-9]{3}$/,
        phone: /^\+628[0-9]{8,12}$/
    };

    function validateForm(formData) {
        const errors = {};
        if (!formData.name?.trim()) errors.name = 'Name is required';
        else if (!validationRules.name.test(formData.name)) {
            errors.name = 'Name must be 2-50 characters, letters only';
        }
        if (!formData.employeeID?.trim()) errors.employeeID = 'Employee ID is required';
        else if (!validationRules.employeeID.test(formData.employeeID)) {
            errors.employeeID = 'Employee ID format: EMP-XXX';
        }
        else if (captains.some(c => c.employeeID === formData.employeeID && c.id !== (editingCaptain?.id || 0))) {
            errors.employeeID = 'Employee ID must be unique';
        }
        if (!formData.phone?.trim()) errors.phone = 'Phone is required';
        else if (!validationRules.phone.test(formData.phone)) {
            errors.phone = 'Phone format: +628XXXXXXXX';
        }
        if (!formData.workshop) errors.workshop = 'Workshop is required';
        return errors;
    }

    // CRUD Operations
    async function addCaptain() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            const id = captains.length ? Math.max(...captains.map(c => c.id)) + 1 : 1;
            captains = [...captains, { ...formData, id }];
            showSuccess('Captain added successfully!');
            closeModal();
        } catch (err) {
            formErrors = { general: 'Failed to add captain: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    async function updateCaptain() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            captains = captains.map(captain =>
                captain.id === editingCaptain.id ? { ...formData, id: captain.id } : captain
            );
            showSuccess('Captain updated successfully!');
            closeModal();
        } catch (err) {
            formErrors = { general: 'Failed to update captain: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    function deleteCaptain(id) {
        if (confirm('Are you sure you want to delete this captain?')) {
            captains = captains.filter(captain => captain.id !== id);
            showSuccess('Captain deleted successfully!');
        }
    }

    // Success message
    function showSuccess(message) {
        successMessage = message;
        setTimeout(() => successMessage = '', 3000);
    }

    // Reset form
    function resetForm() {
        formData = { name: '', employeeID: '', phone: '', workshop: '' };
        formErrors = {};
    }

    // Pagination
    function changePage(page) {
        if (page === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (page === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (typeof page === 'number') {
            currentPage = page;
        }
    }

    // Focus management
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
                document.querySelector('#searchInput')?.focus();
            }
            if (e.key === 'Escape') {
                closeModal();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                openAddModal();
            }
            if (e.key === 'Enter' && (showAddModal || showEditModal)) {
                if (showAddModal) addCaptain();
                if (showEditModal) updateCaptain();
            }
        }
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });
</script>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-user-tie"></i> Captain Management
        </div>
        <button class="btn btn-primary" on:click={openAddModal} aria-label="Add New Captain">
            <i class="fas fa-plus"></i> Add Captain
        </button>
    </div>

    <h1 class="section-header">Captain Overview</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Captains</h2>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search captains..." aria-label="Search Captains" bind:value={searchTerm}>
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>
        <div class="card-body">
            {#if isLoading}
                <div class="loading-spinner">Loading...</div>
            {:else}
                <div class="table-container">
                    <table class="data-table" aria-label="Captains Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Employee ID</th>
                                <th>Phone</th>
                                <th>Workshop</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="captainsTable">
                            {#each paginatedCaptains as captain}
                                <tr>
                                    <td>{captain.id}</td>
                                    <td>{captain.name}</td>
                                    <td>{captain.employeeID}</td>
                                    <td>{captain.phone}</td>
                                    <td>{captain.workshop}</td>
                                    <td>
                                        <button class="action-btn" on:click={() => openEditModal(captain)} aria-label="Edit Captain">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn error" on:click={() => deleteCaptain(captain.id)} aria-label="Delete Captain">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="pagination" role="navigation" aria-label="Pagination">
                    <button on:click={() => changePage('prev')} aria-label="Previous Page" disabled={currentPage === 1}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                        <button class:active={page === currentPage} on:click={() => changePage(page)} aria-current={page === currentPage ? 'page' : null}>
                            {page}
                        </button>
                    {/each}
                    <button on:click={() => changePage('next')} aria-label="Next Page" disabled={currentPage === totalPages}>
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

    <!-- Add Captain Modal -->
    {#if showAddModal}
        <div class="modal" role="dialog" aria-labelledby="addModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="addModalTitle">Add New Captain</h2>
                    <button on:click={closeModal} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={addCaptain}>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" aria-invalid={formErrors.name ? 'true' : 'false'} />
                            {#if formErrors.name}
                                <small style="color: red;">{formErrors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="employeeID">Employee ID</label>
                            <input type="text" id="employeeID" bind:value={formData.employeeID} aria-required="true" aria-invalid={formErrors.employeeID ? 'true' : 'false'} placeholder="EMP-XXX" />
                            {#if formErrors.employeeID}
                                <small style="color: red;">{formErrors.employeeID}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="text" id="phone" bind:value={formData.phone} aria-required="true" aria-invalid={formErrors.phone ? 'true' : 'false'} placeholder="+628XXXXXXXX" />
                            {#if formErrors.phone}
                                <small style="color: red;">{formErrors.phone}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="workshop">Workshop</label>
                            <select id="workshop" bind:value={formData.workshop} aria-required="true" aria-invalid={formErrors.workshop ? 'true' : 'false'}>
                                <option value="">Select Workshop</option>
                                {#each workshopOptions as workshop}
                                    <option value={workshop}>{workshop}</option>
                                {/each}
                            </select>
                            {#if formErrors.workshop}
                                <small style="color: red;">{formErrors.workshop}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Captain'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    {/if}

    <!-- Edit Captain Modal -->
    {#if showEditModal}
        <div class="modal" role="dialog" aria-labelledby="editModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="editModalTitle">Edit Captain</h2>
                    <button on:click={closeModal} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={updateCaptain}>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" aria-invalid={formErrors.name ? 'true' : 'false'} />
                            {#if formErrors.name}
                                <small style="color: red;">{formErrors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="employeeID">Employee ID</label>
                            <input type="text" id="employeeID" bind:value={formData.employeeID} aria-required="true" aria-invalid={formErrors.employeeID ? 'true' : 'false'} placeholder="EMP-XXX" />
                            {#if formErrors.employeeID}
                                <small style="color: red;">{formErrors.employeeID}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="text" id="phone" bind:value={formData.phone} aria-required="true" aria-invalid={formErrors.phone ? 'true' : 'false'} placeholder="+628XXXXXXXX" />
                            {#if formErrors.phone}
                                <small style="color: red;">{formErrors.phone}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="workshop">Workshop</label>
                            <select id="workshop" bind:value={formData.workshop} aria-required="true" aria-invalid={formErrors.workshop ? 'true' : 'false'}>
                                <option value="">Select Workshop</option>
                                {#each workshopOptions as workshop}
                                    <option value={workshop}>{workshop}</option>
                                {/each}
                            </select>
                            {#if formErrors.workshop}
                                <small style="color: red;">{formErrors.workshop}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Captain'}
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
    .form-group input, .form-group select {
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