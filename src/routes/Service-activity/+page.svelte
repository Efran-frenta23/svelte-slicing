<script>
    export let data;
    let serviceActivities = data?.serviceActivities || [];
    let branches = data?.branches || [];
    let captains = data?.captains || [];
    let searchTerm = '';
    let selectedBranch = '';
    let selectedCaptain = '';
    let selectedDate = '';
    let currentPage = 1;
    const itemsPerPage = 10;

    // Reactive filtered and paginated activities
    $: filteredActivities = serviceActivities.filter(activity =>
        (!selectedBranch || activity.branch === selectedBranch) &&
        (!selectedCaptain || activity.captain_id?.toString() === selectedCaptain) &&
        (!selectedDate || (activity.service_date && new Date(activity.service_date).toISOString().split('T')[0] === selectedDate)) &&
        ((activity.member_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
         (activity.license_number || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    $: paginatedActivities = filteredActivities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    $: totalPages = Math.ceil(filteredActivities.length / itemsPerPage) || 1;

    // Handle search
    function handleSearch(event) {
        searchTerm = event.target.value;
        currentPage = 1;
    }

    // Handle filter changes
    function handleFilterChange() {
        currentPage = 1;
    }

    // Pagination
    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }
</script>

<svelte:head>
    <title>Autopulse - Service Activity</title>
    <meta name="description" content="Autopulse Dashboard - Service Activity" />
</svelte:head>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-yellow-800 flex items-center gap-3">
            <i class="fas fa-clipboard-list"></i> Service Activity
        </h1>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-search mr-2"></i>Search
                </label>
                <input
                    type="text"
                    placeholder="Member name or license plate"
                    bind:value={searchTerm}
                    on:input={handleSearch}
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                />
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-building mr-2"></i>Branch
                </label>
                <select
                    bind:value={selectedBranch}
                    on:change={handleFilterChange}
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                >
                    <option value="">All Branches</option>
                    {#each branches as branch}
                        <option value={branch.workshop_name || branch.id}>{branch.workshop_name || 'Unknown'}</option>
                    {/each}
                </select>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-user-tie mr-2"></i>Captain
                </label>
                <select
                    bind:value={selectedCaptain}
                    on:change={handleFilterChange}
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                >
                    <option value="">All Captains</option>
                    {#each captains as captain}
                        <option value={captain.id}>{captain.name}</option>
                    {/each}
                </select>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-calendar mr-2"></i>Date
                </label>
                <input
                    type="date"
                    bind:value={selectedDate}
                    on:change={handleFilterChange}
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                />
            </div>
        </div>
    </div>

    <!-- Results Summary -->
    <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl shadow-lg p-4 mb-6">
        <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">
                <i class="fas fa-list mr-2"></i>
                Showing {filteredActivities.length} of {serviceActivities.length} activities
            </span>
            {#if searchTerm || selectedBranch || selectedCaptain || selectedDate}
                <button
                    on:click={() => { searchTerm = ''; selectedBranch = ''; selectedCaptain = ''; selectedDate = ''; }}
                    class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                    <i class="fas fa-times mr-2"></i>Clear Filters
                </button>
            {/if}
        </div>
    </div>

    <!-- Content -->
    {#if filteredActivities.length === 0}
        <div class="bg-white rounded-xl shadow-lg p-12 text-center">
            <i class="fas fa-clipboard-list text-6xl text-gray-300 mb-6"></i>
            <h3 class="text-2xl font-bold text-gray-700 mb-3">
                {searchTerm || selectedBranch || selectedCaptain || selectedDate ? 'No Matching Activities' : 'No Service Activities Yet'}
            </h3>
            <p class="text-gray-500 text-lg">
                {searchTerm || selectedBranch || selectedCaptain || selectedDate 
                    ? 'Try adjusting your filters to find what you\'re looking for.'
                    : 'Service activities will appear here once they are created.'}
            </p>
        </div>
    {:else}
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                        <tr>
                            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Member</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Vehicle</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Branch</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Captain</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each paginatedActivities as activity}
                            <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                                <td class="px-6 py-4 text-gray-600">
                                    {activity.service_date ? new Date(activity.service_date).toLocaleDateString() : '-'}
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-800">
                                    {activity.member_name || 'Unknown'}
                                </td>
                                <td class="px-6 py-4 text-gray-600">
                                    {activity.license_number || activity.car || '-'}
                                </td>
                                <td class="px-6 py-4 text-gray-600">
                                    {activity.branch_name || '-'}
                                </td>
                                <td class="px-6 py-4 text-gray-600">
                                    {activity.captain_name || '-'}
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1.5 rounded-full text-sm font-semibold
                                        {activity.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                         activity.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                         activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                         'bg-gray-100 text-gray-700'}">
                                        {activity.status || 'Pending'}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <a
                                        href="/Service-activity/Service-detail/{activity.id}"
                                        class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md inline-flex items-center gap-2"
                                    >
                                        <i class="fas fa-eye"></i> View Details
                                    </a>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        {#if totalPages > 1}
            <div class="flex justify-center gap-2 mt-6">
                <button
                    on:click={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    class="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                    <button
                        on:click={() => goToPage(page)}
                        class="px-4 py-2 rounded-lg font-semibold transition-all {page === currentPage ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md' : 'bg-white border-2 border-gray-200 hover:bg-yellow-50 hover:border-yellow-400'}"
                    >
                        {page}
                    </button>
                {/each}
                <button
                    on:click={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    class="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        {/if}
    {/if}
</div>
