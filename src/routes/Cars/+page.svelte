<script>
    import { onMount } from 'svelte';

    let cars = [];
    let brands = [];
    let members = [];
    let isLoading = true;
    let errorMessage = '';
    let successMessage = '';

    // Form state
    let editingCar = null;
    let showForm = false;
    let formData = {
        brand: '',
        model: '',
        license_plate: '',
        vin: '',
        owner: ''
    };

    onMount(async () => {
        await loadCars();
        await loadBrands();
        await loadMembers();
    });

    async function loadCars() {
        isLoading = true;
        errorMessage = '';
        try {
            const response = await fetch('/api/cars');
            if (response.ok) {
                cars = await response.json();
            } else {
                errorMessage = 'Failed to load cars';
            }
        } catch (err) {
            errorMessage = 'Failed to load cars: ' + err.message;
        } finally {
            isLoading = false;
        }
    }

    async function loadBrands() {
        try {
            const response = await fetch('/api/brands');
            if (response.ok) {
                brands = await response.json();
            }
        } catch (err) {
            console.error('Failed to load brands:', err);
        }
    }

    async function loadMembers() {
        try {
            const response = await fetch('/api/members');
            if (response.ok) {
                members = await response.json();
            }
        } catch (err) {
            console.error('Failed to load members:', err);
        }
    }

    function openAddForm() {
        editingCar = null;
        formData = {
            brand: '',
            model: '',
            license_plate: '',
            vin: '',
            owner: ''
        };
        showForm = true;
    }

    function openEditForm(car) {
        editingCar = car;
        formData = {
            brand: car.brand || '',
            model: car.model || '',
            license_plate: car.license_plate || '',
            vin: car.vin || '',
            owner: car.owner || ''
        };
        showForm = true;
    }

    function closeForm() {
        showForm = false;
        editingCar = null;
        formData = {
            brand: '',
            model: '',
            license_plate: '',
            vin: '',
            owner: ''
        };
    }

    async function handleSubmit() {
        errorMessage = '';
        successMessage = '';

        try {
            const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars';
            const method = editingCar ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                successMessage = editingCar ? 'Car updated successfully' : 'Car added successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadCars();
                closeForm();
            } else {
                const error = await response.json();
                errorMessage = 'Failed to save car: ' + error.error;
            }
        } catch (err) {
            errorMessage = 'Failed to save car: ' + err.message;
        }
    }

    async function handleDelete(car) {
        if (!confirm('Are you sure you want to delete this car?')) return;

        try {
            const response = await fetch(`/api/cars/${car.id}`, { method: 'DELETE' });
            if (response.ok) {
                successMessage = 'Car deleted successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadCars();
            } else {
                errorMessage = 'Failed to delete car';
            }
        } catch (err) {
            errorMessage = 'Failed to delete car: ' + err.message;
        }
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-yellow-800">Cars Management</h1>
        <button class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md flex items-center gap-2" on:click={openAddForm}>
            <i class="fas fa-plus"></i> Add Car
        </button>
    </div>

    {#if errorMessage}
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">{errorMessage}</div>
    {/if}
    {#if successMessage}
        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">{successMessage}</div>
    {/if}

    {#if isLoading}
        <div class="text-center py-8 text-gray-500">Loading cars...</div>
    {:else}
        <div class="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
            <table class="w-full">
                <thead class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Brand</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Model</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">License Plate</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">VIN</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Owner</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each cars as car}
                        <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                            <td class="px-4 py-3">{car.id}</td>
                            <td class="px-4 py-3">{car.brand || '-'}</td>
                            <td class="px-4 py-3">{car.model || '-'}</td>
                            <td class="px-4 py-3">{car.license_plate || '-'}</td>
                            <td class="px-4 py-3">{car.vin || '-'}</td>
                            <td class="px-4 py-3">{car.owner || '-'}</td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors" on:click={() => openEditForm(car)} aria-label="Edit Car">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" on:click={() => handleDelete(car)} aria-label="Delete Car">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    {#if showForm}
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" on:click={closeForm}>
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden" on:click|stopPropagation>
                <div class="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-yellow-800">{editingCar ? 'Edit Car' : 'Add Car'}</h2>
                    <button class="text-gray-500 hover:text-gray-700 text-2xl" on:click={closeForm}>&times;</button>
                </div>
                <form on:submit|preventDefault={handleSubmit} class="p-4 space-y-4">
                    <div>
                        <label for="brand" class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <select id="brand" bind:value={formData.brand} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400">
                            <option value="">Select Brand</option>
                            {#each brands as brand}
                                <option value={brand.brand_name}>{brand.brand_name}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label for="model" class="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <input type="text" id="model" bind:value={formData.model} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="license_plate" class="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                        <input type="text" id="license_plate" bind:value={formData.license_plate} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="vin" class="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                        <input type="text" id="vin" bind:value={formData.vin} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="owner" class="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                        <select id="owner" bind:value={formData.owner} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400">
                            <option value="">Select Owner</option>
                            {#each members as member}
                                <option value={member.name}>{member.name}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" on:click={closeForm}>Cancel</button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all">
                            {editingCar ? 'Update' : 'Add'} Car
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>
