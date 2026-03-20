<script>
    import { onMount } from 'svelte';

    let stats = {
        totalData: 0,
        serviceRevenue: 0,
        totalServices: 0,
        totalMembers: 0
    };
    let isLoading = true;

    onMount(async () => {
        await loadStats();
    });

    async function loadStats() {
        isLoading = true;
        try {
            // Fetch stats from various endpoints
            const [captains, brands, cars, spareparts] = await Promise.all([
                fetch('/api/captains').then(r => r.ok ? r.json() : []),
                fetch('/api/brands').then(r => r.ok ? r.json() : []),
                fetch('/api/cars').then(r => r.ok ? r.json() : []),
                fetch('/api/spareparts').then(r => r.ok ? r.json() : [])
            ]);

            stats = {
                totalData: captains.length + brands.length + cars.length + spareparts.length,
                serviceRevenue: 0, // Would need finance API
                totalServices: captains.length,
                totalMembers: 0 // Would need members API
            };
        } catch (err) {
            console.error('Failed to load stats:', err);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-yellow-800 flex items-center gap-3">
            <i class="fas fa-tachometer-alt"></i> Dashboard
        </h1>
        <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold">A</div>
            <div>
                <div class="text-sm font-semibold text-yellow-800">Autopulse</div>
                <div class="text-xs text-gray-500">Super Admin</div>
            </div>
        </div>
    </div>

    <h2 class="text-xl font-bold text-gray-700 mb-4">Homepage</h2>

    {#if isLoading}
        <div class="text-center py-8 text-gray-500">Loading dashboard...</div>
    {:else}
        <!-- Overview Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Overview</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-6 rounded-xl shadow-md">
                    <div class="text-3xl font-bold">{stats.totalData}</div>
                    <div class="text-sm opacity-90">Total Data</div>
                </div>
                <div class="bg-gradient-to-br from-green-400 to-green-500 text-white p-6 rounded-xl shadow-md">
                    <div class="text-3xl font-bold">Rp {stats.serviceRevenue.toLocaleString()}</div>
                    <div class="text-sm opacity-90">Service Revenue</div>
                </div>
                <div class="bg-gradient-to-br from-blue-400 to-blue-500 text-white p-6 rounded-xl shadow-md">
                    <div class="text-3xl font-bold">{stats.totalServices}</div>
                    <div class="text-sm opacity-90">Total Services</div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="/Captain" class="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
                    <i class="fas fa-user-tie text-3xl text-yellow-600 mb-2 group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm font-medium text-gray-700">Captains</span>
                </a>
                <a href="/Brand" class="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
                    <i class="fas fa-car text-3xl text-yellow-600 mb-2 group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm font-medium text-gray-700">Brands</span>
                </a>
                <a href="/Cars" class="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
                    <i class="fas fa-list text-3xl text-yellow-600 mb-2 group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm font-medium text-gray-700">Cars</span>
                </a>
                <a href="/Sparepart" class="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
                    <i class="fas fa-cog text-3xl text-yellow-600 mb-2 group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm font-medium text-gray-700">Spareparts</span>
                </a>
            </div>
        </div>
    {/if}
</div>
