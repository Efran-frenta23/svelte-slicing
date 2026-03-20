<script>
    import { onMount } from 'svelte';

    let captains = [];
    let isLoading = true;
    let errorMessage = '';
    let successMessage = '';

    // Form state
    let editingCaptain = null;
    let showForm = false;
    let formData = {
        name: '',
        employee_id: '',
        phone: '',
        workshop: ''
    };

    const workshopOptions = ['Jakarta Branch', 'Bandung Branch', 'Surabaya Branch'];

    onMount(async () => {
        await loadCaptains();
    });

    async function loadCaptains() {
        isLoading = true;
        errorMessage = '';
        try {
            const response = await fetch('/api/captains');
            if (response.ok) {
                captains = await response.json();
            } else {
                errorMessage = 'Failed to load captains';
            }
        } catch (err) {
            errorMessage = 'Failed to load captains: ' + err.message;
        } finally {
            isLoading = false;
        }
    }

    function openAddForm() {
        editingCaptain = null;
        formData = {
            name: '',
            employee_id: '',
            phone: '',
            workshop: ''
        };
        showForm = true;
    }

    function openEditForm(captain) {
        editingCaptain = captain;
        formData = {
            name: captain.name,
            employee_id: captain.employee_id || '',
            phone: captain.phone || '',
            workshop: captain.workshop || ''
        };
        showForm = true;
    }

    function closeForm() {
        showForm = false;
        editingCaptain = null;
        formData = {
            name: '',
            employee_id: '',
            phone: '',
            workshop: ''
        };
    }

    async function handleSubmit() {
        errorMessage = '';
        successMessage = '';

        try {
            const url = editingCaptain ? `/api/captains/${editingCaptain.id}` : '/api/captains';
            const method = editingCaptain ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                successMessage = editingCaptain ? 'Captain updated successfully' : 'Captain added successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadCaptains();
                closeForm();
            } else {
                const error = await response.json();
                errorMessage = 'Failed to save captain: ' + error.error;
            }
        } catch (err) {
            errorMessage = 'Failed to save captain: ' + err.message;
        }
    }

    async function handleDelete(captain) {
        if (!confirm(`Are you sure you want to delete ${captain.name}?`)) return;

        try {
            const response = await fetch(`/api/captains/${captain.id}`, { method: 'DELETE' });
            if (response.ok) {
                successMessage = 'Captain deleted successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadCaptains();
            } else {
                errorMessage = 'Failed to delete captain';
            }
        } catch (err) {
            errorMessage = 'Failed to delete captain: ' + err.message;
        }
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-yellow-800">Captains Management</h1>
        <button class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md flex items-center gap-2" on:click={openAddForm}>
            <i class="fas fa-plus"></i> Add Captain
        </button>
    </div>

    {#if errorMessage}
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">{errorMessage}</div>
    {/if}
    {#if successMessage}
        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">{successMessage}</div>
    {/if}

    {#if isLoading}
        <div class="text-center py-8 text-gray-500">Loading captains...</div>
    {:else}
        <div class="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
            <table class="w-full">
                <thead class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Employee ID</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Workshop</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each captains as captain}
                        <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                            <td class="px-4 py-3">{captain.id}</td>
                            <td class="px-4 py-3">{captain.name}</td>
                            <td class="px-4 py-3">{captain.employee_id || '-'}</td>
                            <td class="px-4 py-3">{captain.phone || '-'}</td>
                            <td class="px-4 py-3">{captain.workshop || '-'}</td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors" on:click={() => openEditForm(captain)} aria-label="Edit Captain">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" on:click={() => handleDelete(captain)} aria-label="Delete Captain">
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
                    <h2 class="text-xl font-bold text-yellow-800">{editingCaptain ? 'Edit Captain' : 'Add Captain'}</h2>
                    <button class="text-gray-500 hover:text-gray-700 text-2xl" on:click={closeForm}>&times;</button>
                </div>
                <form on:submit|preventDefault={handleSubmit} class="p-4 space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="name" bind:value={formData.name} required class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="employee_id" class="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input type="text" id="employee_id" bind:value={formData.employee_id} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" id="phone" bind:value={formData.phone} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="workshop" class="block text-sm font-medium text-gray-700 mb-1">Workshop</label>
                        <select id="workshop" bind:value={formData.workshop} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400">
                            <option value="">Select Workshop</option>
                            {#each workshopOptions as w}
                                <option value={w}>{w}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" on:click={closeForm}>Cancel</button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all">
                            {editingCaptain ? 'Update' : 'Add'} Captain
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>
