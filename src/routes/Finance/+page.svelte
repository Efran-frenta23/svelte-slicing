```svelte
<script>
    import { onMount } from 'svelte';


    // State management
    let sidebarCollapsed = true; // Start hidden on mobile
    let searchTerm = '';
    let currentPage = 1;
    let showAddModal = false;
    let showEditModal = false;
    let editingTransaction = null;
    let isLoading = false;
    let formData = { id: '', customer: '', amount: '', date: '', status: 'pending' };
    let formErrors = {};
    let successMessage = '';
    let user = { name: 'Autopulse', role: 'developer' };
    const itemsPerPage = 10;

    // Transaction data
    let transactions = [
        { id: 'TRX-001', customer: 'Budi Santoso', amount: 1500000, date: '2025-05-20', status: 'completed' },
        { id: 'TRX-002', customer: 'Budi', amount: 2000000, date: '2025-05-19', status: 'pending' },
        { id: 'TRX-003', customer: 'Rudi Hartono', amount: 1200000, date: '2025-05-18', status: 'completed' }
    ];

    // Navigation menu
    const navMenu = [
        { name: 'Dashboard', href: '/dashboard', icon: 'fa-tachometer-alt' },
        { name: 'Service', href: '/service', icon: 'fa-wrench' },
        { name: 'Workshop Information', href: '/workshop', icon: 'fa-building' },
        { name: 'Membership', href: '/member', icon: 'fa-users' },
        { name: 'Captain', href: '/captain', icon: 'fa-user-tie' },
        { name: 'Available Brand', href: '/brand', icon: 'fa-car' },
        { name: 'Spare Part', href: '/sparepart', icon: 'fa-cog' },
        { name: 'Car List', href: '/carlist', icon: 'fa-list' },
        { name: 'Service Activity', href: '/serviceactivity', icon: 'fa-clipboard-list' },
        { name: 'Logbook', href: '/logbook', icon: 'fa-book' },
        { name: 'Service Detail', href: '/servicedetail', icon: 'fa-tools' },
        },
        { name: 'Finance', href: '/finance', icon: 'fa-dollar-sign', isActive: true },
        { name: 'Promotion', href: '/promotion', icon: 'fa-percent' },
        },
        { name: 'Admin Registration', href: '/admin', icon: 'fa-user-plus' },
    },
];

    // Validation patterns
    const validationPatterns = {
        id: /^TRX-[0-9]{3}$/,
        customer: /^[A-Za-z\s]{2,50}$/,
        amount: { min: 1000, step: 1000 },
        date: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
        status: /^(pending|completed|cancelled)$/
    };

    // Reactive: Search & filter
    $: filteredTransactions = transactions.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm) ||
        t.date.includes(searchTerm) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reactive: Pagination
    $: totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    $: paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Authentication check
    onMount(() => {
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = '/login';
        }
    });

    // Modal management
    function openAddModal() {
        formData = { id: '', customer: '', amount: '', date: '', status: 'pending' };
        formErrors = {};
        showAddModal = true;
        focusModal();
    }

    function openEditModal(transaction) {
        editingTransaction = { ...transaction };
        formData = { ...transaction };
        formErrors = {};
        showEditModal = true;
        focusModal('edit');
    }

    function closeModals() {
        showAddModal = false;
        showEditModal = false;
        editingTransaction = null;
        formErrors = {};
        successMessage = '';
    }

    // Form validation
    function validateForm(data) {
        const errors = {};
        if (!data.id?.trim()) errors.id = 'Transaction ID is required';
        else if (!validationPatterns.id.test(data.id)) {
            errors.id = 'ID must be in format TRX-XXX';
        } else if (!editingTransaction && transactions.some(t => t.id === data.id)) {
            errors.id = 'Transaction ID must be unique';
        }
        if (!data.customer?.trim()) errors.customer = 'Customer name is required';
        else if (!validationPatterns.customer.test(data.customer)) {
            errors.customer = 'Customer name must be 2-50 characters, letters only';
        }
        if (!data.amount) errors.amount = 'Amount is required';
        else if (data.amount < validationPatterns.amount.min) {
            errors.amount = 'Amount must be at least 1000';
        }
        if (!data.date) errors.date = 'Date is required';
        else if (new Date(data.date) > new Date()) {
            errors.date = 'Date cannot be in the future';
        }
        if (!data.status) errors.status = 'Status is required';
        return errors;
    }

    // CRUD Operations
    async function handleAddTransaction() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            transactions = [...transactions, {
                ...formData,
                amount: parseInt(formData.amount),
                id: formData.id || `TRX-${String(transactions.length + 1).padStart(3, '0')}`
            }];
            showSuccess('Transaction added successfully!');
            closeModals();
        } catch (err) {
            formErrors = { general: 'Failed to add transaction: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    async function handleEditTransaction() {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        isLoading = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            transactions = transactions.map(t =>
                t.id === editingTransaction.id ? { ...formData, amount: parseInt(formData.amount) } : t
            );
            showSuccess('Transaction updated successfully!');
            closeModals();
        } catch (err) {
            formErrors = { general: 'Failed to update transaction: ' + err.message };
        } finally {
            isLoading = false;
        }
    }

    function deleteTransaction(transactionId) {
        if (confirm(`Are you sure you want to delete transaction ${transactionId}?`)) {
            transactions = transactions.filter(t => t.id !== transactionId);
            showSuccess('Transaction deleted successfully!');
        }
    }

    // Success message
    function showSuccess(message) {
        successMessage = message;
        setTimeout(() => successMessage = '', 3000);
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

    // Currency and status formatting
    function formatCurrency(amount) {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    }

    function formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    // Focus management
    function focusModal(type = 'add') {
        setTimeout(() => {
            const firstInput = document.querySelector(`#${type}TransactionModal input:not([type=hidden]), #${type}TransactionModal select`);
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
                closeModals();
                if (!sidebarCollapsed) toggleSidebar();
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
                event.preventDefault();
                openAddModal();
            }
        }
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    });

    // Toggle sidebar
    function toggleSidebar() {
        sidebarCollapsed = !sidebarCollapsed;
    }

    // Check active link
    function isActiveLink(href) {
        return window.location.pathname === href;
    }
</script>

<header role="banner" class="header">
    <div class="header-left">
        <button on:click={toggleSidebar} aria-label="Toggle Sidebar" class="btn-icon">
            <i class="fas fa-bars"></i>
        </button>
        <a href="/dashboard" aria-label="Autopulse Dashboard" class="logo">
            <i class="fas fa-car"></i> Autopulse
        </a>
        <nav aria-label="Breadcrumb" class="breadcrumb">
            <a href="/dashboard">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>Finance</span>
        </nav>
    </div>
    <div class="header-right">
        <button aria-label="Notifications" class="btn-icon">
            <i class="fas fa-bell"></i>
        </button>
        <div class="user-profile" aria-label="User Profile">
            <div class="user-avatar">{user.name[0]}</div>
            <div class="user-info">
                <div>{user.name}</div>
                <div>{user.role}</div>
            </div>
            <i class="fas fa-chevron-down"></i>
        </div>
    </div>
</header>

<div class="container">
    <aside id="sidebar" class:collapsed={sidebarCollapsed} role="navigation">
        <div class="sidebar-header">
            <div class="sidebar-logo">AP</div>
            <button on:click={toggleSidebar} aria-label="Close Sidebar" class="btn-icon">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <ul id="navMenu" class="nav-menu">
            {#each navMenu as item}
                <li class="nav-item" class:active={isActiveLink(item.href)}>
                    <a href={item.href} class:active={isActiveLink(item.href)} aria-current={isActiveLink(item.href) ? 'page' : null}>
                        <i class="fas {item.icon}"></i> {item.name}
                    </a>
                </li>
            {/each}
        </ul>
    </aside>

    <main role="main" class="main-content">
        <div class="content-header">
            <div class="page-title">
                <i class="fas fa-dollar-sign"></i> Financial Transactions
            </div>
            <button class="btn btn-primary" on:click={openAddModal} aria-label="Add New Transaction">
                <i class="fas fa-plus"></i> Add Transaction
            </button>
        </div>

        <h1 class="section-header">Financial Transactions</h1>

        <div class="content-card">
            <div class="card-header">
                <h2>Transactions</h2>
                <div class="search-container">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search by Transaction ID, Customer, Amount, Date, or Status..." aria-label="Search Transactions" bind:value={searchTerm}>
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            </div>
            <div class="card-body">
                {#if isLoading}
                    <div class="loading-spinner">Loading...</div>
                {:else}
                    <div id="totalTransactions">Total Transactions: {filteredTransactions.length}</div>
                    <div class="table-container">
                        <table class="data-table" aria-label="Transactions Table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Transaction ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="transactionsTable">
                                {#each paginatedTransactions as transaction, index}
                                    <tr>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{transaction.id}</td>
                                        <td>{transaction.customer}</td>
                                        <td>{formatCurrency(transaction.amount)}</td>
                                        <td>{transaction.date}</td>
                                        <td>{formatStatus(transaction.status)}</td>
                                        <td>
                                            <button class="action-btn" on:click={() => openEditModal(transaction)} aria-label="Edit Transaction {transaction.id}">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn error" on:click={() => deleteTransaction(transaction.id)} aria-label="Delete Transaction {transaction.id}">
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

        <!-- Add Transaction Modal -->
        {#if showAddModal}
            <div id="addTransactionModal" class="modal" role="dialog" aria-labelledby="addModalTitle">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="addModalTitle">Add Transaction</h2>
                        <button on:click={closeModals} aria-label="Close Modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form on:submit|preventDefault={handleAddTransaction}>
                            <div class="form-group">
                                <label for="addTransactionId">Transaction ID</label>
                                <input type="text" id="addTransactionId" bind:value={formData.id} placeholder="TRX-XXX" aria-required="true" aria-invalid={formErrors.id ? 'true' : 'false'} />
                                {#if formErrors.id}
                                    <small style="color: red;">{formErrors.id}</small>
                                {/if}
                            </div>
                            <div class="form-group">
                                <label for="addCustomer">Customer Name</label>
                                <input type="text" id="addCustomer" bind:value={formData.customer} placeholder="Enter customer name" aria-required="true" aria-invalid={formErrors.customer ? 'true' : 'false'} />
                                {#if formErrors.customer}
                                    <small style="color: red;">{formErrors.customer}</small>
                                {/if}
                            </div>
                            <div class="form-group">
                                <label for="addAmount">Amount</label>
                                <input type="number" id="addAmount" bind:value={formData.amount} placeholder="Enter amount" min="1000" step="1000" aria-required="true" aria-invalid={formErrors.amount ? 'true' : 'false'} />
                                {#if formErrors.amount}
                                    <small style="color: red;">{formErrors.amount}</small>
                                {/if}
                            </div>
                            <div class="form-group">
                                <label for="addDate">Date</label>
                                <input type="date" id="addDate" bind:value={formData.date} aria-required="true" aria-invalid={formErrors.date ? 'true' : 'false'} />
                                {#if formErrors.date}
                                    <small style="color: red;">{formErrors.date}</small>
                                {/if}
                            </div>
                            <div class="form-group">
                                <label for="addStatus">Status</label>
                                <select id="addStatus" bind:value={formData.status} aria-required="true" aria-invalid={formErrors.status ? 'true' : 'false'}>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {#if formErrors.status}
                                    <small style="color: red;">{formErrors.status}</small>
                                {/if}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" on:click={closeModals} aria-label="Cancel">Cancel</button>
                                <button type="submit" class="btn btn-primary" disabled={isLoading} aria-label="Add Transaction">
                                    {isLoading ? 'Adding...' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Edit Transaction Modal -->
        {#if showEditModal}
            <div id="editTransactionModal" class="modal" role="dialog" aria-labelledby="editModalTitle">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="editModalTitle">Edit Transaction</h2>
                        <button on:click={closeModals} aria-label="Close Modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form on:submit|preventDefault={handleEditTransaction}>
                            <input type="hidden" bind:value={formData.id}>
                            <div class="form-group">
                                <label for="editCustomer">Customer Name</label>
                                <input type="text" id="editCustomer" bind:value={formData.customer} aria-required="true" aria-invalid={formErrors.customer ? 'true' : 'false'} />
                                {#if formErrors.customer}
                                    <small style="color: red;">{formErrors.customer}</small>
                                {/if}
                            </div>
                            <div class="form-group">
                                <label for="editAmount">Amount</label>
                                <input type="number" id="editAmount" bind:value={formData.amount} min="1000" step="1000" aria-required="true" aria-invalid={formErrors.amount ? 'true' : 'false'} />
                                {#if formErrors.amount}
                                    <small style="color: red;">{formErrors.amount}</small>
                                {/if}
                            </div>
                            <div class="form-group">
                                <label for="editDate">Date</label>
                                <input type="date" id="editDate" bind:value={formData.date} aria-required="true" aria-invalid={formErrors.date ? 'true' : 'false'} />
                                {#if formErrors.date}
                                    <small style="color: red;">{formErrors.date}</small>
                                {/if}
                            </div>
                            <div class="form-group">
                                <label for="editStatus">Status</label>
                                <select id="editStatus" bind:value={formData.status} aria-required="true" aria-invalid={formErrors.status ? 'true' : 'false'}>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {#if formErrors.status}
                                    <small style="color: red;">{formErrors.status}</small>
                                {/if}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" on:click={closeModals} aria-label="Cancel">Cancel</button>
                                <button type="submit" class="btn btn-primary" disabled={isLoading} aria-label="Update Transaction">
                                    {isLoading ? 'Updating...' : 'Update Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        {/if}
    </main>
</div>