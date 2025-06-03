```svelte
<script>
    import { onMount } from 'svelte';

    // State management & data
    let cars = [
        { id: 1, brand: 'Toyota', model: 'Rush', license: 'BA 1234 OOD', vin: '123456789', owner: 'Anne' },
        { id: 2, brand: 'Honda', model: 'Civic', license: 'BA 5678 ABC', vin: '987654321', owner: 'Budi' },
        { id: 3, brand: 'Chery', model: 'Tiggo', license: 'BA 9012 XYZ', vin: '456789123', owner: 'Citra' }
    ];
    let currentPage = 1;
    let searchTerm = '';
    let showAddModal = false;
    let showEditModal = false;
    let editingCar = null;
    let isLoading = false;
    let formData = { brand: '', model: '', license: '', vin: '', owner: '' };
    let formErrors = {};
    let successMessage = '';
    const itemsPerPage = 10;

    // Brand options (can be fetched from API or synced with brand management)
    const brandOptions = ['Toyota', 'Honda', 'Chery'];

    // Reactive: Search & filter
    $: filteredCars = cars.filter(car =>
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredCars.length / itemsPerPage);
    $: paginatedCars = filteredCars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Modal management
    function openAddModal() {
        resetForm();
        showAddModal = true;
        focusModal();
    }

    function openEditModal(car) {
        editingCar = { ...car };
        formData = { ...car };
        showEditModal = true;
        focusModal();
    }

    function closeModal() {
        showAddModal = false;
        showEditModal = false;
        editingCar = null;
        formErrors = {};
        successMessage = '';
    }

    // Form validation
    const validationPatterns = {
        brand: /^[A-Za-z\s]{2,50}$/,
        model: /^[A-Za-z0-9\s]{2,50}$/,
        license: /^[A-Z0-9\s]{5,12}$/,
        vin: /^[A-HJ-NPR-Z0-9]{9}$/,
        owner: /^[A-Za-z\s]{2,50}$/
    };

    function validateForm(formData) {
        const errors = {};
        if (!formData.brand?.trim()) errors.brand = 'Brand is required';
        else if (!validationPatterns.brand.test(formData.brand)) {
            errors.brand = 'Brand must be 2-50 characters, letters only';
        }
        if (!formData.model?.trim()) errors.model = 'Model is required';
        else if (!validationPatterns.model.test(formData.model)) {
            errors.model = 'Model must be 2-50 characters, alphanumeric';
        }
        if (!formData.license?.trim()) errors.license = 'License number is required';
        else if (!validationPatterns.license.test(formData.license)) {
            errors.license = 'License must be 5-12 characters, uppercase letters and numbers';
        }
        if (!formData.vin?.trim()) errors.vin = 'VIN is required';
        else if (!validationPatterns.vin.test(formData.vin)) {
            errors.vin = 'VIN must be exactly 9 characters, alphanumeric';
        }
        else if (cars.some(c => c.vin === formData.vin && c.id !== (editingCar?.id || 0))) {
            errors.vin = 'VIN must be unique';
        }
        if (!formData.owner?.trim()) errors.owner = 'Owner is required';
        else if (!validationPatterns.owner.test(formData.owner)) {
            errors.owner = 'Owner must be 2-50 characters, letters only';
        }
        return errors;
    }

    // CRUD Operations
    async function handleAddCar() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            const newCar = {
                id: cars.length ? Math.max(...cars.map(c => c.id)) + 1 : 1,
                ...formData
            };
            cars = [...cars, newCar];
            showSuccess('Car added successfully!');
            closeModal();
        } catch (err) {
            formErrors = { general: 'Failed to add car: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    async function handleEditCar() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            cars = cars.map(car =>
                car.id === editingCar.id ? { ...formData, id: car.id } : car
            );
            showSuccess('Car updated successfully!');
            closeModal();
        } catch (err) {
            formErrors = { general: 'Failed to update car: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    function deleteCar(id) {
        if (confirm('Are you sure you want to delete this car?')) {
            cars = cars.filter(car => car.id !== id);
            showSuccess('Car deleted successfully!');
        }
    }

    // Success message
    function showSuccess(message) {
        successMessage = message;
        setTimeout(() => successMessage = '', 3000);
    }

    // Reset form
    function resetForm() {
        formData = { brand: '', model: '', license: '', vin: '', owner: '' };
        formErrors = {};
    }

    // Pagination
    function changePage(page) {
        if (page === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (page === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (typeof page === 'number' && page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    // Focus management
    function focusModal() {
        setTimeout(() => {
            const firstInput = document.querySelector('.modal-content select');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Keyboard shortcuts
    onMount(() => {
        function handleKeydown(event) {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                document.querySelector('#searchInput')?.focus();
            }
            if (event.key === 'Escape') {
                closeModal();
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
                event.preventDefault();
                openAddModal();
            }
            if (event.key === 'Enter' && (showAddModal || showEditModal)) {
                if (showAddModal) handleAddCar();
                if (showEditModal) handleEditCar();
            }
        }
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });
</script>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-list"></i> Car List
        </div>
        <button class="btn btn-primary" on:click={openAddModal} aria-label="Add New Car">
            <i class="fas fa-plus"></i> Add Car
        </button>
    </div>

    <h1 class="section-header">Car List</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Registered Cars</h2>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search by VIN, License, Brand, Model, or Owner..." aria-label="Search Cars" bind:value={searchTerm}>
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>
        <div class="card-body">
            {#if isLoading}
                <div class="loading-spinner">Loading...</div>
            {:else}
                <div id="totalCars">Total Cars: {filteredCars.length}</div>
                <div class="table-container">
                    <table class="data-table" aria-label="Cars Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>License Number</th>
                                <th>VIN</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="carsTable">
                            {#each paginatedCars as car}
                                <tr>
                                    <td>{car.id}</td>
                                    <td>{car.brand}</td>
                                    <td>{car.model}</td>
                                    <td>{car.license}</td>
                                    <td>{car.vin}</td>
                                    <td>{car.owner}</td>
                                    <td>
                                        <button class="action-btn" on:click={() => openEditModal(car)} aria-label="Edit Car">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn error" on:click={() => deleteCar(car.id)} aria-label="Delete Car">
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

    <!-- Add Car Modal -->
    {#if showAddModal}
        <div class="modal" role="dialog" aria-labelledby="addModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="addModalTitle">Add New Car</h2>
                    <button on:click={closeModal} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleAddCar}>
                        <div class="form-group">
                            <label for="brand">Brand</label>
                            <select id="brand" bind:value={formData.brand} aria-required="true" aria-invalid={formErrors.brand ? 'true' : 'false'}>
                                <option value="">Select Brand</option>
                                {#each brandOptions as brand}
                                    <option value={brand}>{brand}</option>
                                {/each}
                            </select>
                            {#if formErrors.brand}
                                <small style="color: red;">{formErrors.brand}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="model">Model</label>
                            <input type="text" id="model" bind:value={formData.model} aria-required="true" aria-invalid={formErrors.model ? 'true' : 'false'} placeholder="e.g., Rush" />
                            {#if formErrors.model}
                                <small style="color: red;">{formErrors.model}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="license">License Number</label>
                            <input type="text" id="license" bind:value={formData.license} aria-required="true" aria-invalid={formErrors.license ? 'true' : 'false'} placeholder="e.g., BA 1234 OOD" />
                            {#if formErrors.license}
                                <small style="color: red;">{formErrors.license}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="vin">VIN</label>
                            <input type="text" id="vin" bind:value={formData.vin} aria-required="true" aria-invalid={formErrors.vin ? 'true' : 'false'} placeholder="9 characters" />
                            {#if formErrors.vin}
                                <small style="color: red;">{formErrors.vin}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="owner">Owner</label>
                            <input type="text" id="owner" bind:value={formData.owner} aria-required="true" aria-invalid={formErrors.owner ? 'true' : 'false'} />
                            {#if formErrors.owner}
                                <small style="color: red;">{formErrors.owner}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Car'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    {/if}

    <!-- Edit Car Modal -->
    {#if showEditModal}
        <div class="modal" role="dialog" aria-labelledby="editModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="editModalTitle">Edit Car</h2>
                    <button on:click={closeModal} aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleEditCar}>
                        <div class="form-group">
                            <label for="brand">Brand</label>
                            <select id="brand" bind:value={formData.brand} aria-required="true" aria-invalid={formErrors.brand ? 'true' : 'false'}>
                                <option value="">Select Brand</option>
                                {#each brandOptions as brand}
                                    <option value={brand}>{brand}</option>
                                {/each}
                            </select>
                            {#if formErrors.brand}
                                <small style="color: red;">{formErrors.brand}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="model">Model</label>
                            <input type="text" id="model" bind:value={formData.model} aria-required="true" aria-invalid={formErrors.model ? 'true' : 'false'} placeholder="e.g., Rush" />
                            {#if formErrors.model}
                                <small style="color: red;">{formErrors.model}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="license">License Number</label>
                            <input type="text" id="license" bind:value={formData.license} aria-required="true" aria-invalid={formErrors.license ? 'true' : 'false'} placeholder="e.g., BA 1234 OOD" />
                            {#if formErrors.license}
                                <small style="color: red;">{formErrors.license}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="vin">VIN</label>
                            <input type="text" id="vin" bind:value={formData.vin} aria-required="true" aria-invalid={formErrors.vin ? 'true' : 'false'} placeholder="9 characters" />
                            {#if formErrors.vin}
                                <small style="color: red;">{formErrors.vin}</small>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="owner">Owner</label>
                            <input type="text" id="owner" bind:value={formData.owner} aria-required="true" aria-invalid={formErrors.owner ? 'true' : 'false'} />
                            {#if formErrors.owner}
                                <small style="color: red;">{formErrors.owner}</small>
                            {/if}
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Car'}
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