<script>
    import { onMount } from 'svelte';
    import { fetchAll, update, remove } from '$lib/db';

    // State management
    let admins = [];
    let currentPage = 1;
    let searchTerm = '';
    let showEditModal = false;
    let editingAdmin = null;
    let isLoading = false;
    let formData = { name: '', email: '', role: '', workshop: '', status: '' };
    let formErrors = {};
    let successMessage = '';
    const itemsPerPage = 10;

    // Data options for dropdowns
    const roleOptions = ['Super Admin', 'Admin'];
    const workshopOptions = ['Jakarta Branch', 'Bandung Branch', 'Surabaya Branch'];
    const statusOptions = ['Active', 'Inactive'];

    // Reactive: Search & filter
    $: filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
    $: paginatedAdmins = filteredAdmins.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Fetch admins
    async function fetchAdmins() {
        isLoading = true;
        try {
            admins = await fetchAll('admins', '*', { orderBy: 'id', order: 'ASC' });
        } catch (err) {
            formErrors = { general: 'Failed to fetch admins: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    // Modal handling
    function openEditModal(admin) {
        editingAdmin = { ...admin };
        formData = { ...admin };
        showEditModal = true;
        focusModal();
    }

    function closeModals() {
        showEditModal = false;
        editingAdmin = null;
        formErrors = {};
        successMessage = '';
    }

    // Form validation
    function validateForm(data) {
        const errors = {};
        if (!data.name?.trim()) errors.name = 'Name is required';
        if (!data.email?.trim()) errors.email = 'Email is required';
        else if (!data.email.includes('@')) errors.email = 'Valid email is required';
        if (!data.role) errors.role = 'Role is required';
        if (!data.workshop) errors.workshop = 'Workshop is required';
        if (!data.status) errors.status = 'Status is required';
        return errors;
    }

    // CRUD Operations
    async function handleEditAdmin() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await update('admins', editingAdmin.id, {
                ...formData,
                updated_at: new Date().toISOString()
            });
            await fetchAdmins();
            showSuccess('Admin updated successfully!');
            closeModals();
        } catch (err) {
            formErrors = { general: 'Failed to update admin: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    async function deleteAdmin(id) {
        if (confirm('Are you sure you want to delete this admin?')) {
            isLoading = true;
            try {
                await remove('admins', id);
                await fetchAdmins();
                showSuccess('Admin deleted successfully!');
            } catch (err) {
                formErrors = { general: 'Failed to delete admin: ' + err.message };
            } finally {
                isLoading = false;
            }
        }
    }

    // Success message
    function showSuccess(message) {
        successMessage = message;
        setTimeout(() => successMessage = '', 3000);
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
        fetchAdmins();
        function handleKeydown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
            if (e.key === 'Escape') {
                closeModals();
            }
            if (e.key === 'Enter' && showEditModal) {
                handleEditAdmin();
            }
        }
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });
</script>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-user-plus"></i> Admin Management
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

    <h1 class="section-header">Admin Overview</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Admins</h2>
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search by Name or Email..." aria-label="Search Admins" bind:value={searchTerm}>
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="card-body">
            {#if isLoading}
                <div class="loading-spinner">Loading...</div>
            {:else}
                <div>Total Admins: {filteredAdmins.length}</div>
                <div class="table-container">
                    <table class="data-table" aria-label="Admins Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Workshop</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminsTable">
                            {#each paginatedAdmins as admin}
                                <tr>
                                    <td>{admin.id}</td>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.role}</td>
                                    <td>{admin.workshop}</td>
                                    <td><span class:status-active={admin.status === 'Active'}>{admin.status}</span></td>
                                    <td>
                                        <button class="action-btn" on:click={() => openEditModal(admin)} aria-label="Edit Admin">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn error" on:click={() => deleteAdmin(admin.id)} aria-label="Delete Admin">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
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
            {#if successMessage}
                <div class="success-message">{successMessage}</div>
            {/if}
            {#if formErrors.general}
                <div class="error-message">{formErrors.general}</div>
            {/if}
        </div>
    </div>

    <!-- Edit Admin Modal -->
    {#if showEditModal}
        <div class="modal" role="dialog" aria-labelledby="editModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="editModalTitle">Edit Admin</h2>
                    <button on:click={closeModals} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleEditAdmin}>
                        <div class="form-group">
                            <label for="editName">Name</label>
                            <input type="text" id="editName" bind:value={formData.name} aria-required="true" aria-invalid={formErrors.name ? 'true' : 'false'} />
                            {#if formErrors.name}
                                <small style="color: red;">{formErrors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="editEmail">Email</label>
                            <input type="email" id="editEmail" bind:value={formData.email} aria-required="true" aria-invalid={formErrors.email ? 'true' : 'false'} />
                            {#if formErrors.email}
                                <small style="color: red;">{formErrors.email}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="editRole">Role</label>
                            <select id="editRole" bind:value={formData.role} aria-required="true" aria-invalid={formErrors.role ? 'true' : 'false'}>
                                <option value="">Select Role</option>
                                {#each roleOptions as role}
                                    <option value={role}>{role}</option>
                                {/each}
                            </select>
                            {#if formErrors.role}
                                <small style="color: red;">{formErrors.role}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="editWorkshop">Workshop</label>
                            <select id="editWorkshop" bind:value={formData.workshop} aria-required="true" aria-invalid={formErrors.workshop ? 'true' : 'false'}>
                                <option value="">Select Workshop</option>
                                {#each workshopOptions as workshop}
                                    <option value={workshop}>{workshop}</option>
                                {/each}
                            </select>
                            {#if formErrors.workshop}
                                <small style="color: red;">{formErrors.workshop}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="editStatus">Status</label>
                            <select id="editStatus" bind:value={formData.status} aria-required="true" aria-invalid={formErrors.status ? 'true' : 'false'}>
                                <option value="">Select Status</option>
                                {#each statusOptions as status}
                                    <option value={status}>{status}</option>
                                {/each}
                            </select>
                            {#if formErrors.status}
                                <small style="color: red;">{formErrors.status}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Admin'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    {/if}
</main>



