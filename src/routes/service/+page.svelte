<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    
    // Store untuk state
    let isAnimating = false;
    const modalStore = writable({ visible: false, modalId: '' });
    const sidebarStore = writable({ visible: false });
    
    // Data layanan (contoh statis, bisa diganti dengan fetch API)
    let services = [
        { id: '01', name: 'Air Conditioning Service', desc: 'AC Repair & Maintenance', icon: 'fa-snowflake', gradient: 'var(--success-gradient)' },
        { id: '02', name: 'Tire Replacement', desc: 'Complete tire services', icon: 'fa-circle', gradient: 'var(--warning-gradient)' },
        { id: '03', name: 'Engine Oil Change', desc: 'Premium oil service', icon: 'fa-oil-can', gradient: 'var(--secondary-gradient)' },
        { id: '04', name: 'Oil Filter Replacement', desc: 'High-quality filters', icon: 'fa-filter', gradient: 'var(--accent-gradient)' },
        { id: '05', name: 'Chery Service', desc: 'Specialized brand service', icon: 'fa-car', gradient: 'var(--primary-gradient)' }
    ];
    
    let searchTerm = '';
    let currentPage = 1;
    const itemsPerPage = 5;
    
    // Reactive: Filter layanan berdasarkan pencarian
    $: filteredServices = services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        service.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Reactive: Pagination
    $: paginatedServices = filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    $: totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    
    // Search Functionality
    function handleSearch(event) {
        searchTerm = event.target.value;
        currentPage = 1; // Reset ke halaman 1 saat pencarian
    }
    
    // Modal Management
    function showModal(modalId) {
        modalStore.update(store => {
            if (!store.visible) {
                document.body.style.overflow = 'hidden';
                return { visible: true, modalId };
            }
            return store;
        });
    }
    
    function closeModal() {
        modalStore.set({ visible: false, modalId: '' });
        document.body.style.overflow = '';
    }
    
    // Form Handling
    let isSubmitting = false;
    function handleAddService(event) {
        event.preventDefault();
        if (isSubmitting) return;
        
        isSubmitting = true;
        setTimeout(() => {
            const form = event.target;
            const newService = {
                id: (services.length + 1).toString().padStart(2, '0'),
                name: form.serviceName.value,
                desc: form.serviceDesc.value,
                icon: 'fa-cog', // Default icon
                gradient: 'var(--primary-gradient)' // Default gradient
            };
            services = [...services, newService];
            isSubmitting = false;
            closeModal();
            form.reset();
        }, 2000);
    }
    
    // Keyboard Shortcuts
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K untuk focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('#searchInput');
                if (searchInput) searchInput.focus();
            }
            // Escape untuk close modal
            if (e.key === 'Escape') {
                modalStore.update(store => {
                    if (store.visible) {
                        document.body.style.overflow = '';
                        return { visible: false, modalId: '' };
                    }
                    return store;
                });
            }
            // Ctrl+N untuk add new service
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                showModal('addServiceModal');
            }
        });
    }
    
    // Sidebar Toggle
    function toggleSidebar() {
        if (isAnimating) return;
        isAnimating = true;
        sidebarStore.update(store => ({ visible: !store.visible }));
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }
    
    // Active Link Management
    function setActiveLink() {
        const links = document.querySelectorAll('a');
        const currentPath = window.location.pathname.split('/').pop() || 'service.html';
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.style.fontWeight = 'bold';
            }
        });
    }
    
    // Pagination
    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }
    
    // Click Outside to Close Modal
    function handleOutsideClick(event) {
        modalStore.update(store => {
            if (store.visible && event.target.closest('.modal-content') === null) {
                document.body.style.overflow = '';
                return { visible: false, modalId: '' };
            }
            return store;
        });
    }
    
    // Inisialisasi
    onMount(() => {
        initializeKeyboardShortcuts();
        setActiveLink();
    });
</script>

<div class="content-card">
    <div class="card-header">
        <h2>Service Management</h2>
        <div class="search-container">
            <div class="search-box">
                <input 
                    type="text" 
                    id="searchInput" 
                    placeholder="Search services..." 
                    aria-label="Search Services"
                    bind:value={searchTerm}
                    on:input={handleSearch}
                >
                <i class="fas fa-search"></i>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div class="table-container">
            <table class="data-table" aria-label="Services Table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Service Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="servicesTable">
                    {#each paginatedServices as service}
                        <tr style="cursor: pointer;" on:click={() => goto(`/service/${service.id}/activity`)}>
                            <td>{service.id}</td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 40px; height: 40px; background: {service.gradient}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
                                        <i class="fas {service.icon}"></i>
                                    </div>
                                    <div>
                                        <div>{service.name}</div>
                                        <div style="font-size: var(--font-size-xs); color: var(--text-secondary); font-weight: 400;">
                                            {service.desc}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <button class="action-btn" aria-label="View Activities" on:click|stopPropagation={() => goto(`/service/${service.id}/activity`)}>
                                    <i class="fas fa-list"></i>
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="pagination" role="navigation" aria-label="Pagination">
            <button aria-label="Previous Page" on:click={() => goToPage(currentPage - 1)}>
                <i class="fas fa-chevron-left"></i>
            </button>
            {#each Array(totalPages) as _, i}
                <button 
                    class:active={currentPage === i + 1} 
                    aria-current={currentPage === i + 1 ? 'page' : undefined}
                    on:click={() => goToPage(i + 1)}
                >
                    {i + 1}
                </button>
            {/each}
            <button aria-label="Next Page" on:click={() => goToPage(currentPage + 1)}>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
</div>

<!-- Modal for Add Service -->
{#if $modalStore.visible && $modalStore.modalId === 'addServiceModal'}
    <div class="modal" id="addServiceModal" role="dialog" aria-modal="true" on:click={handleOutsideClick}>
        <div class="modal-content">
            <form on:submit|preventDefault={handleAddService}>
                <h3>Add New Service</h3>
                <label for="serviceName">Service Name</label>
                <input type="text" id="serviceName" name="serviceName" required>
                <label for="serviceDesc">Description</label>
                <input type="text" id="serviceDesc" name="serviceDesc" required>
                <div class="button-group">
                    <button type="submit" disabled={isSubmitting}>
                        {#if isSubmitting}
                            Adding...
                        {:else}
                            Add Service
                        {/if}
                    </button>
                    <button type="button" on:click={closeModal}>Cancel</button>
                </div>
            </form>
        </div>
    </div>
{/if}

