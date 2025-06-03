<script>
    import { onMount } from 'svelte';

    // State management & data
    let admins = [
        { id: 1, name: 'Budi Santoso', email: 'budi@autopulse.com', role: 'Super Admin', workshop: 'Jakarta Branch', status: 'Active' },
        { id: 2, name: 'Ani Wijaya', email: 'ani@autopulse.com', role: 'Admin', workshop: 'Bandung Branch', status: 'Active' },
        { id: 3, name: 'Rudi Hartono', email: 'rudi@autopulse.com', role: 'Admin', workshop: 'Surabaya Branch', status: 'Inactive' }
    ];
    let currentPage = 1;
    let searchTerm = '';
    let showAddModal = false;
    let showEditModal = false;
    let editingAdmin = null;
    let isLoading = false;
    let errors = {};
    let successMessage = '';
    const itemsPerPage = 10;

    // Data options for dropdowns
    const roleOptions = ['Super Admin', 'Admin'];
    const workshopOptions = ['Jakarta Branch', 'Bandung Branch', 'Surabaya Branch'];
    const statusOptions = ['Active', 'Inactive'];

    // Form data
    let formData = { name: '', email: '', role: '', workshop: '', status: '', password: '' };

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

    // Modal functions
    function openAddModal() {
        resetForm();
        showAddModal = true;
    }

    function openEditModal(admin) {
        editingAdmin = { ...admin };
        formData = { ...admin, password: '' };
        showEditModal = true;
    }

    function closeModals() {
        showAddModal = false;
        showEditModal = false;
        editingAdmin = null;
        errors = {};
        successMessage = '';
    }

    // Form validation
    function validateForm(data) {
        const errors = {};
        if (!data.name.trim()) errors.name = 'Name is required';
        if (!data.email.trim()) errors.email = 'Email is required';
        else if (!data.email.includes('@')) errors.email = 'Valid email is required';
        if (showAddModal && !data.password?.trim()) errors.password = 'Password is required';
        if (data.password && data.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (!data.role) errors.role = 'Role is required';
        if (!data.workshop) errors.workshop = 'Workshop is required';
        if (!data.status) errors.status = 'Status is required';
        return errors;
    }

    // CRUD Operations
    async function handleAddAdmin() {
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            errors = validationErrors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            const newAdmin = {
                id: admins.length ? Math.max(...admins.map(a => a.id)) + 1 : 1,
                ...formData
            };
            admins = [...admins, newAdmin];
            showSuccess('Admin added successfully!');
            closeModals();
        } catch (err) {
            errors = { general: 'Failed to add admin: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    async function handleEditAdmin() {
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            errors = validationErrors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            admins = admins.map(admin => 
                admin.id === editingAdmin.id ? { ...admin, ...formData } : admin
            );
            showSuccess('Admin updated successfully!');
            closeModals();
        } catch (err) {
            errors = { general: 'Failed to update admin: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    function deleteAdmin(id) {
        if (confirm('Are you sure you want to delete this admin?')) {
            admins = admins.filter(admin => admin.id !== id);
            showSuccess('Admin deleted successfully!');
        }
    }

    // Success message
    function showSuccess(message) {
        successMessage = message;
        setTimeout(() => successMessage = '', 3000);
    }

    // Reset form
    function resetForm() {
        formData = { name: '', email: '', role: '', workshop: '', status: '', password: '' };
        errors = {};
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
                document.getElementById('searchInput')?.focus();
            }
            if (e.key === 'Escape') {
                closeModals();
            }
            if (e.key === 'Enter' && (showAddModal || showEditModal)) {
                if (showAddModal) handleAddAdmin();
                if (showEditModal) handleEditAdmin();
            }
        }
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });
</script>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-user-plus"></i> Admin Registration
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

    <h1 class="section-header">Admin Management</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Admins</h2>
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search by Name or Email..." aria-label="Search Admins" bind:value={searchTerm}>
                    <i class="fas fa-search"></i>
                </div>
                <button class="btn btn-primary" on:click={openAddModal} aria-label="Add New Admin">
                    <i class="fas fa-plus"></i> Add Admin
                </button>
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
            {#if successMessage}
                <div class="success-message">{successMessage}</div>
            {/if}
            {#if errors.general}
                <div class="error-message">{errors.general}</div>
            {/if}
        </div>
    </div>

    <!-- Add Admin Modal -->
    {#if showAddModal}
        <div class="modal" role="dialog" aria-labelledby="addModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="addModalTitle">Add New Admin</h2>
                    <button on:click={closeModals} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleAddAdmin}>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" aria-invalid={errors.name ? 'true' : 'false'} />
                            {#if errors.name}
                                <small style="color: red;">{errors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" bind:value={formData.email} aria-required="true" aria-invalid={errors.email ? 'true' : 'false'} />
                            {#if errors.email}
                                <small style="color: red;">{errors.email}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" bind:value={formData.password} aria-required="true" aria-invalid={errors.password ? 'true' : 'false'} />
                            {#if errors.password}
                                <small style="color: red;">{errors.password}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select id="role" bind:value={formData.role} aria-required="true" aria-invalid={errors.role ? 'true' : 'false'}>
                                <option value="">Select Role</option>
                                {#each roleOptions as role}
                                    <option value={role}>{role}</option>
                                {/each}
                            </select>
                            {#if errors.role}
                                <small style="color: red;">{errors.role}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="workshop">Workshop</label>
                            <select id="workshop" bind:value={formData.workshop} aria-required="true" aria-invalid={errors.workshop ? 'true' : 'false'}>
                                <option value="">Select Workshop</option>
                                {#each workshopOptions as workshop}
                                    <option value={workshop}>{workshop}</option>
                                {/each}
                            </select>
                            {#if errors.workshop}
                                <small style="color: red;">{errors.workshop}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="status">Status</label>
                            <select id="status" bind:value={formData.status} aria-required="true" aria-invalidcloser
                            <option value="">Select Status</option>
                            {#each statusOptions as status}
                                <option value={status}>{status}</option>
                            {/each}
                            </select>
                            {#if errors.status}
                                <small style="color: red;">{errors.status}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary">Add Admin</button>
                    </form>
                </div>
            </div>
        </div>
    {/if}

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
                            <label for="name">Name</label>
                            <input type="text" id="name" bind:value={formData.name} aria-required="true" aria-invalid={errors.name ? 'true' : 'false'} />
                            {#if errors.name}
                                <small style="color: red;">{errors.name}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" bind:value={formData.email} aria-required="true" aria-invalid={errors.email ? 'true' : 'false'} />
                            {#if errors.email}
                                <small style="color: red;">{errors.email}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="password">Password (leave blank to keep unchanged)</label>
                            <input type="password" id="password" bind:value={formData.password} aria-invalid={errors.password ? 'true' : 'false'} />
                            {#if errors.password}
                                <small style="color: red;">{errors.password}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select id="role" bind:value={formData.role} aria-required="true" aria-invalid={errors.role ? 'true' : 'false'}>
                                <option value="">Select Role</option>
                                {#each roleOptions as role}
                                    <option value={role}>{role}</option>
                                {/each}
                            </select>
                            {#if errors.role}
                                <small style="color: red;">{errors.role}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="workshop">Workshop</label>
                            <select id="workshop" bind:value={formData.workshop} aria-required="true" aria-invalid={errors.workshop ? 'true' : 'false'}>
                                <option value="">Select Workshop</option>
                                {#each workshopOptions as workshop}
                                    <option value={workshop}>{workshop}</option>
                                {/each}
                            </select>
                            {#if errors.workshop}
                                <small style="color: red;">{errors.workshop}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="status">Status</label>
                            <select id="status" bind:value={formData.status} aria-required="true" aria-invalid={errors.status ? 'true' : 'false'}>
                                <option value="">Select Status</option>
                                {#each statusOptions as status}
                                    <option value={status}>{status}</option>
                                {/each}
                            </select>
                            {#if errors.status}
                                <small style="color: red;">{errors.status}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary">Update Admin</button>
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
    .status-active {
        color: green;
        font-weight: bold;
    }
</style>