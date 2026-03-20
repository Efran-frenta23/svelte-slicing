<script>
    import { onMount } from 'svelte';

    let finances = [];
    let isLoading = true;
    let errorMessage = '';
    let successMessage = '';

    // Form state
    let editingFinance = null;
    let showForm = false;
    let formData = {
        transaction_type: '',
        amount: '',
        description: '',
        category: '',
        transaction_date: ''
    };

    const transactionTypes = ['Income', 'Expense'];
    const categories = ['Service', 'Sparepart', 'Salary', 'Operational', 'Other'];

    onMount(async () => {
        await loadFinances();
    });

    async function loadFinances() {
        isLoading = true;
        errorMessage = '';
        try {
            const response = await fetch('/api/finance');
            if (response.ok) {
                finances = await response.json();
            } else {
                errorMessage = 'Failed to load finance data';
            }
        } catch (err) {
            errorMessage = 'Failed to load finance data: ' + err.message;
        } finally {
            isLoading = false;
        }
    }

    function openAddForm() {
        editingFinance = null;
        formData = {
            transaction_type: 'Income',
            amount: '',
            description: '',
            category: 'Service',
            transaction_date: new Date().toISOString().split('T')[0]
        };
        showForm = true;
    }

    function openEditForm(finance) {
        editingFinance = finance;
        formData = {
            transaction_type: finance.transaction_type,
            amount: finance.amount,
            description: finance.description || '',
            category: finance.category || 'Other',
            transaction_date: finance.transaction_date ? finance.transaction_date.split('T')[0] : ''
        };
        showForm = true;
    }

    function closeForm() {
        showForm = false;
        editingFinance = null;
        formData = {
            transaction_type: 'Income',
            amount: '',
            description: '',
            category: 'Service',
            transaction_date: ''
        };
    }

    async function handleSubmit() {
        errorMessage = '';
        successMessage = '';

        try {
            const url = editingFinance ? `/api/finance/${editingFinance.id}` : '/api/finance';
            const method = editingFinance ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                successMessage = editingFinance ? 'Finance record updated successfully' : 'Finance record added successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadFinances();
                closeForm();
            } else {
                const error = await response.json();
                errorMessage = 'Failed to save finance record: ' + error.error;
            }
        } catch (err) {
            errorMessage = 'Failed to save finance record: ' + err.message;
        }
    }

    async function handleDelete(finance) {
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const response = await fetch(`/api/finance/${finance.id}`, { method: 'DELETE' });
            if (response.ok) {
                successMessage = 'Finance record deleted successfully';
                setTimeout(() => successMessage = '', 3000);
                await loadFinances();
            } else {
                errorMessage = 'Failed to delete finance record';
            }
        } catch (err) {
            errorMessage = 'Failed to delete finance record: ' + err.message;
        }
    }

    // Calculate totals
    $: totalIncome = finances.filter(f => f.transaction_type === 'Income').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
    $: totalExpense = finances.filter(f => f.transaction_type === 'Expense').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
    $: balance = totalIncome - totalExpense;
</script>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-yellow-800">Finance Management</h1>
        <button class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md flex items-center gap-2" on:click={openAddForm}>
            <i class="fas fa-plus"></i> Add Transaction
        </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-400 to-green-500 text-white p-6 rounded-xl shadow-lg">
            <div class="text-sm opacity-90">Total Income</div>
            <div class="text-2xl font-bold">Rp {totalIncome.toLocaleString()}</div>
        </div>
        <div class="bg-gradient-to-br from-red-400 to-red-500 text-white p-6 rounded-xl shadow-lg">
            <div class="text-sm opacity-90">Total Expense</div>
            <div class="text-2xl font-bold">Rp {totalExpense.toLocaleString()}</div>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-6 rounded-xl shadow-lg">
            <div class="text-sm opacity-90">Balance</div>
            <div class="text-2xl font-bold">Rp {balance.toLocaleString()}</div>
        </div>
    </div>

    {#if errorMessage}
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">{errorMessage}</div>
    {/if}
    {#if successMessage}
        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">{successMessage}</div>
    {/if}

    {#if isLoading}
        <div class="text-center py-8 text-gray-500">Loading finance data...</div>
    {:else}
        <div class="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
            <table class="w-full">
                <thead class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each finances as finance}
                        <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                            <td class="px-4 py-3">{finance.transaction_date || '-'}</td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 rounded-full text-xs font-semibold {finance.transaction_type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                    {finance.transaction_type}
                                </span>
                            </td>
                            <td class="px-4 py-3">{finance.category || '-'}</td>
                            <td class="px-4 py-3">{finance.description || '-'}</td>
                            <td class="px-4 py-3 font-semibold {finance.transaction_type === 'Income' ? 'text-green-600' : 'text-red-600'}">
                                {finance.transaction_type === 'Income' ? '+' : '-'} Rp {(finance.amount || 0).toLocaleString()}
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors" on:click={() => openEditForm(finance)} aria-label="Edit Finance">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" on:click={() => handleDelete(finance)} aria-label="Delete Finance">
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
                    <h2 class="text-xl font-bold text-yellow-800">{editingFinance ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button class="text-gray-500 hover:text-gray-700 text-2xl" on:click={closeForm}>&times;</button>
                </div>
                <form on:submit|preventDefault={handleSubmit} class="p-4 space-y-4">
                    <div>
                        <label for="transaction_type" class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                        <select id="transaction_type" bind:value={formData.transaction_type} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400">
                            {#each transactionTypes as type}
                                <option value={type}>{type}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (Rp)</label>
                        <input type="number" id="amount" bind:value={formData.amount} required min="0" class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="category" bind:value={formData.category} class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400">
                            {#each categories as category}
                                <option value={category}>{category}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label for="transaction_date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" id="transaction_date" bind:value={formData.transaction_date} required class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" bind:value={formData.description} rows="3" class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400"></textarea>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" on:click={closeForm}>Cancel</button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all">
                            {editingFinance ? 'Update' : 'Add'} Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>
