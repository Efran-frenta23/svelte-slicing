<script>
    import { onMount } from 'svelte';

    let brands = [];
    let isLoading = true;
    let errorMessage = '';
    let successMessage = '';

    // Form state
    let editingBrand = null;
    let showForm = false;
    let formData = {
        brand_name: '',
        country: '',
        models: ''
    };

    onMount(async () => {
        await loadBrands();
    });

    async function loadBrands() {
        isLoading = true;
        errorMessage = '';
        try {
            const response = await fetch('/api/brands');
            if (response.ok) {
                brands = await response.json();
            } else {
                errorMessage = 'Failed to load brands';
            }
        } catch (err) {
            errorMessage = 'Failed to load brands: ' + err.message;
        } finally {
            isLoading = false;
        }
    }

    function openAddForm() {
        editingBrand = null;
        formData = {
            brand_name: '',
            country: '',
            models: ''
        };
        showForm = true;
    }

    function openEditForm(brand) {
        editingBrand = brand;
        formData = {
            brand_name: brand.brand_name,
            country: brand.country || '',
            models: brand.models || ''
        };
        showForm = true;
    }

    function closeForm() {
        showForm = false;
        editingBrand = null;
        formData = {
            brand_name: '',
            country: '',
            models: ''
        };
    }

    async function handleSubmit() {
        errorMessage = '';
        successMessage = '';

        try {
            const url = editingBrand ? `/api/brands/${editingBrand.id}` : '/api/brands';
            const method = editingBrand ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                successMessage = editingBrand ? 'Brand updated successfully' : 'Brand added successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadBrands();
                closeForm();
            } else {
                const error = await response.json();
                errorMessage = 'Failed to save brand: ' + error.error;
            }
        } catch (err) {
            errorMessage = 'Failed to save brand: ' + err.message;
        }
    }

    async function handleDelete(brand) {
        if (!confirm(`Are you sure you want to delete ${brand.brand_name}?`)) return;

        try {
            const response = await fetch(`/api/brands/${brand.id}`, { method: 'DELETE' });
            if (response.ok) {
                successMessage = 'Brand deleted successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadBrands();
            } else {
                errorMessage = 'Failed to delete brand';
            }
        } catch (err) {
            errorMessage = 'Failed to delete brand: ' + err.message;
        }
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-yellow-800">Brands Management</h1>
        <button class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md flex items-center gap-2" on:click={openAddForm}>
            <i class="fas fa-plus"></i> Add Brand
        </button>
    </div>

    {#if errorMessage}
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">{errorMessage}</div>
    {/if}
    {#if successMessage}
        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">{successMessage}</div>
    {/if}

    {#if isLoading}
        <div class="text-center py-8 text-gray-500">Loading brands...</div>
    {:else}
        <div class="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
            <table class="w-full">
                <thead class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Brand Name</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Country</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Models</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each brands as brand}
                        <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                            <td class="px-4 py-3">{brand.id}</td>
                            <td class="px-4 py-3">{brand.brand_name}</td>
                            <td class="px-4 py-3">{brand.country || '-'}</td>
                            <td class="px-4 py-3">{brand.models || '-'}</td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors" on:click={() => openEditForm(brand)} aria-label="Edit Brand">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" on:click={() => handleDelete(brand)} aria-label="Delete Brand">
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
                    <h2 class="text-xl font-bold text-yellow-800">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h2>
                    <button class="text-gray-500 hover:text-gray-700 text-2xl" on:click={closeForm}>&times;</button>
                </div>
                <form on:submit|preventDefault={handleSubmit} class="p-4 space-y-4">
                    <div>
                        <label for="brand_name" class="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input type="text" id="brand_name" bind:value={formData.brand_name} required class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input type="text" id="country" bind:value={formData.country} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="models" class="block text-sm font-medium text-gray-700 mb-1">Models</label>
                        <textarea id="models" bind:value={formData.models} rows="3" class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400"></textarea>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" on:click={closeForm}>Cancel</button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all">
                            {editingBrand ? 'Update' : 'Add'} Brand
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>
