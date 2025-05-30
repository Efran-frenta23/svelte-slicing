<script>
    import { onMount } from 'svelte';

    // State management
    let members = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            membership: 'Premium',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            membership: 'Standard',
            status: 'Inactive'
        }
    ];

    // Modal state
    let showModal = false;
    let isEditing = false;
    let editingMember = null;

    // Form data
    let memberForm = {
        name: '',
        email: '',
        membership: 'Premium',
        status: 'Active'
    };

    // Search and filter
    let searchTerm = '';
    let filterStatus = 'All';
    let filteredMembers = members;

    // Pagination
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 1;

    // Form validation
    let formErrors = {
        name: '',
        email: ''
    };

    // Reactive statements
    $: {
        // Filter members based on search and status
        filteredMembers = members.filter(member => {
            const matchesSearch = 
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.membership.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || member.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        // Calculate pagination
        totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        else if (totalPages === 0) currentPage = 1;
    }

    $: paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Functions
    function openAddModal() {
        isEditing = false;
        editingMember = null;
        memberForm = { name: '', email: '', membership: 'Premium', status: 'Active' };
        formErrors = { name: '', email: '' };
        showModal = true;
    }

    function openEditModal(member) {
        isEditing = true;
        editingMember = member;
        memberForm = { ...member };
        formErrors = { name: '', email: '' };
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        memberForm = { name: '', email: '', membership: 'Premium', status: 'Active' };
        editingMember = null;
        formErrors = { name: '', email: '' };
    }

    function validateForm() {
        let isValid = true;
        formErrors = { name: '', email: '' };

        if (!memberForm.name.trim()) {
            formErrors.name = 'Name is required';
            isValid = false;
        }

        if (!memberForm.email.trim()) {
            formErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email)) {
            formErrors.email = 'Invalid email format';
            isValid = false;
        }

        return isValid;
    }

    function saveMember() {
        if (!validateForm()) return;

        if (isEditing && editingMember) {
            // Update existing member
            const index = members.findIndex(m => m.id === editingMember.id);
            if (index !== -1) {
                members[index] = { ...memberForm, id: editingMember.id };
                members = [...members];
            }
        } else {
            // Add new member
            const newMember = {
                id: members.length ? Math.max(...members.map(m => m.id)) + 1 : 1,
                ...memberForm,
                membership: memberForm.membership.charAt(0).toUpperCase() + memberForm.membership.slice(1)
            };
            members = [...members, newMember];
        }

        closeModal();
        showNotification(isEditing ? 'Member updated successfully!' : 'Member added successfully!');
    }

    function deleteMember(member) {
        if (confirm(`Are you sure you want to delete ${member.name}?`)) {
            members = members.filter(m => m.id !== member.id);
            showNotification('Member deleted successfully!');
        }
    }

    function toggleStatus(member) {
        const index = members.findIndex(m => m.id === member.id);
        if (index !== -1) {
            members[index] = {
                ...members[index],
                status: member.status === 'Active' ? 'Inactive' : 'Active'
            };
            members = [...members];
            showNotification(`Status for ${member.name} changed to ${members[index].status}`);
        }
    }

    function changePage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    function showNotification(message) {
        alert(message);
    }

    // Handle modal backdrop click
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    // Keyboard handling
    function handleKeydown(event) {
        if (event.key === 'Escape' && showModal) {
            closeModal();
        }
    }

    // Lifecycle
    onMount(() => {
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<main>
    <div>
        <div>
            <i aria-hidden="true"></i> Member Dashboard
        </div>
        <button on:click={openAddModal} aria-label="Add New Member">
            <i aria-hidden="true"></i> Add Member
        </button>
    </div>

    <h1>Member Management</h1>

    <div>
        <div>
            <h2>Members List</h2>
            <div>
                <div>
                    <input 
                        type="text" 
                        bind:value={searchTerm}
                        placeholder="Search members..." 
                        aria-label="Search Members"
                    >
                    <i aria-hidden="true"></i>
                </div>
                <div>
                    <label for="statusFilter">Filter by Status</label>
                    <select 
                        id="statusFilter" 
                        bind:value={filterStatus}
                        aria-label="Filter by Status"
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <div>
            <div>
                <table aria-label="Members Table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Membership</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each paginatedMembers as member (member.id)}
                            <tr>
                                <td>{member.id}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.membership}</td>
                                <td>
                                    <span>
                                        {member.status}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        on:click={() => openEditModal(member)}
                                        aria-label={`Edit ${member.name}`}
                                    >
                                        <i aria-hidden="true"></i>
                                    </button>
                                    <button 
                                        on:click={() => toggleStatus(member)}
                                        aria-label={`Toggle status for ${member.name}`}
                                    >
                                        <i aria-hidden="true"></i>
                                    </button>
                                    <button 
                                        on:click={() => deleteMember(member)}
                                        aria-label={`Delete ${member.name}`}
                                    >
                                        <i aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        {:else}
                            <tr>
                                <td colspan="6">
                                    {searchTerm || filterStatus !== 'All' 
                                        ? 'No members found matching your criteria.' 
                                        : 'No members available.'}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            {#if totalPages > 1}
                <div role="navigation" aria-label="Pagination">
                    <button 
                        on:click={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous Page"
                    >
                        <i aria-hidden="true"></i>
                    </button>

                    {#each Array(totalPages) as _, i}
                        <button 
                            on:click={() => changePage(i + 1)}
                            aria-current={currentPage === i + 1 ? 'page' : undefined}
                            aria-label={`Page ${i + 1}`}
                        >
                            {i + 1}
                        </button>
                    {/each}

                    <button 
                        on:click={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next Page"
                    >
                        <i aria-hidden="true"></i>
                    </button>
                </div>
            {/if}
        </div>
    </div>
</main>

{#if showModal}
    <div role="dialog" aria-labelledby="modalTitle" aria-modal="true">
        <div>
            <div>
                <h2 id="modalTitle">
                    {isEditing ? 'Edit Member' : 'Add New Member'}
                </h2>
                <button on:click={closeModal} aria-label="Close Modal">
                    <i aria-hidden="true"></i>
                </button>
            </div>

            <div>
                <form on:submit|preventDefault={saveMember}>
                    <div>
                        <label for="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            bind:value={memberForm.name}
                            required 
                            aria-required="true"
                            aria-invalid={formErrors.name ? 'true' : 'false'}
                        >
                        {#if formErrors.name}
                            <span>{formErrors.name}</span>
                        {/if}
                    </div>

                    <div>
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            bind:value={memberForm.email}
                            required 
                            aria-required="true"
                            aria-invalid={formErrors.email ? 'true' : 'false'}
                        >
                        {#if formErrors.email}
                            <span>{formErrors.email}</span>
                        {/if}
                    </div>

                    <div>
                        <label for="membership">Membership Type</label>
                        <select 
                            id="membership" 
                            bind:value={memberForm.membership}
                            required 
                            aria-required="true"
                        >
                            <option value="Premium">Premium</option>
                            <option value="Standard">Standard</option>
                        </select>
                    </div>

                    {#if isEditing}
                        <div>
                            <label for="status">Status</label>
                            <select 
                                id="status" 
                                bind:value={memberForm.status}
                                required 
                                aria-required="true"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    {/if}
                </form>
            </div>

            <div>
                <button on:click={closeModal} aria-label="Cancel">
                    Cancel
                </button>
                <button on:click={saveMember} aria-label={isEditing ? 'Update Member' : 'Save Member'}>
                    {isEditing ? 'Update' : 'Save'}
                </button>
            </div>
        </div>
    </div>
    <div ></div>
{/if}