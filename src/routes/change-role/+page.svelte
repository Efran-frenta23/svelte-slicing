<script>
  import { onMount } from 'svelte';

  let users = [];
  let isLoading = true;
  let errorMessage = '';
  let successMessage = '';
  let currentUser = null;

  const roleOptions = ['Member', 'Captain', 'Admin'];

  onMount(async () => {
    await loadUsers();
    await checkCurrentUser();
  });

  async function loadUsers() {
    isLoading = true;
    try {
      const response = await fetch('/api/change-role');
      if (response.ok) {
        users = await response.json();
      } else {
        errorMessage = 'Failed to load users';
      }
    } catch (err) {
      errorMessage = 'Failed to load users: ' + err.message;
    } finally {
      isLoading = false;
    }
  }

  async function checkCurrentUser() {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        currentUser = await response.json();
      }
    } catch (err) {
      console.error('Failed to get current user:', err);
    }
  }

  async function handleChangeRole(user, newRole) {
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;

    try {
      const response = await fetch('/api/change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          newRole
        })
      });

      const result = await response.json();

      if (response.ok) {
        successMessage = `Role changed to ${newRole} successfully!`;
        setTimeout(() => successMessage = '', 3000);
        await loadUsers();
      } else {
        errorMessage = result.error || 'Failed to change role';
        setTimeout(() => errorMessage = '', 5000);
      }
    } catch (err) {
      errorMessage = 'Failed to change role: ' + err.message;
      setTimeout(() => errorMessage = '', 5000);
    }
  }

  // Check if current user is efran@dalang.io
  $: canChangeRoles = currentUser?.email === 'efran@dalang.io';
</script>

<div class="p-6">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-3xl font-bold text-yellow-800 flex items-center gap-3">
        <i class="fas fa-user-cog"></i> Change Role
      </h1>
      <p class="text-gray-600 mt-2">Manage user roles and permissions</p>
    </div>
    {#if canChangeRoles}
      <div class="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-3 rounded-xl">
        <i class="fas fa-shield-alt mr-2"></i>Super Admin Access
      </div>
    {:else}
      <div class="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-3 rounded-xl">
        <i class="fas fa-exclamation-triangle mr-2"></i>Access Denied - Only efran@dalang.io can change roles
      </div>
    {/if}
  </div>

  {#if errorMessage}
    <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 mb-6 rounded-lg">{errorMessage}</div>
  {/if}
  {#if successMessage}
    <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-5 mb-6 rounded-lg">{successMessage}</div>
  {/if}

  {#if !canChangeRoles}
    <div class="bg-white rounded-xl shadow-lg p-12 text-center">
      <i class="fas fa-lock text-6xl text-gray-300 mb-6"></i>
      <h2 class="text-2xl font-bold text-gray-700 mb-3">Access Restricted</h2>
      <p class="text-gray-500 text-lg">Only <strong class="text-yellow-600">efran@dalang.io</strong> can change user roles.</p>
    </div>
  {:else if isLoading}
    <div class="text-center py-12 text-gray-500">
      <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
      <p>Loading users...</p>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">User</th>
              <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
              <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Current Role</th>
              <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Workshop</th>
              <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Change To</th>
              <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {#each users as user}
              <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span class="font-semibold text-gray-800">{user.name || 'Unknown'}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600">{user.email}</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1.5 rounded-full text-sm font-semibold 
                    {user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 
                      user.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 
                      user.role === 'Captain' ? 'bg-green-100 text-green-700' : 
                      'bg-gray-100 text-gray-700'}">
                    {user.role || 'Member'}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-600">{user.workshop || '-'}</td>
                <td class="px-6 py-4">
                  <select class="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 text-sm">
                    {#each roleOptions as role}
                      <option value={role} selected={role === (user.role || 'Member')}>{role}</option>
                    {/each}
                  </select>
                </td>
                <td class="px-6 py-4">
                  {#if user.email !== 'efran@dalang.io'}
                    <button 
                      class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md"
                      on:click={() => handleChangeRole(user, event.target.previousElementSibling.value)}>
                      <i class="fas fa-sync-alt mr-2"></i>Change Role
                    </button>
                  {:else}
                    <span class="text-gray-400 text-sm italic">Cannot change</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
