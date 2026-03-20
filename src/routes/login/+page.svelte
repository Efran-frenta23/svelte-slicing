<script>
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let name = '';
  let role = 'Member';
  let workshop = '';
  let status = '';
  let errorMessage = '';
  let successMessage = '';
  let showPassword = false;
  let showConfirmPassword = false;
  let isLogin = true;

  const workshopOptions = ['Jakarta Branch', 'Bandung Branch', 'Surabaya Branch'];
  const statusOptions = ['Active', 'Inactive'];

  // Check if email can have admin role
  $: canBeAdmin = email === 'efran@dalang.io' || email === 'efransigma@gmail.com';
  $: showRoleSelect = canBeAdmin && !isLogin;
  $: showWorkshopStatus = (role === 'Admin' || role === 'Super Admin') && showRoleSelect;

  function togglePassword() {
    showPassword = !showPassword;
  }

  function toggleConfirmPassword() {
    showConfirmPassword = !showConfirmPassword;
  }

  function toggleForm() {
    isLogin = !isLogin;
    email = '';
    password = '';
    confirmPassword = '';
    name = '';
    role = 'Member';
    workshop = '';
    status = '';
    errorMessage = '';
    successMessage = '';
    showPassword = false;
    showConfirmPassword = false;
    setTimeout(() => {
      const firstInput = document.querySelector('.login-form input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function handleResult({ result }) {
    if (result?.error) {
      errorMessage = result.error;
    }
    if (result?.success) {
      successMessage = result.success;
      isLogin = true;
    }
  }
</script>

<div class="min-h-screen flex">
  <!-- Left Section - Wider and larger text -->
  <div class="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-yellow-400 to-yellow-500 items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 bg-black/10"></div>
    <div class="relative z-10 text-center text-white px-12">
      <div class="mb-8">
        <i class="fas fa-car text-8xl"></i>
      </div>
      <h1 class="text-7xl font-bold mb-6 text-white" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">AUTOPULSE</h1>
      <p class="text-3xl text-white/95 font-medium">Perjalanan Lancar Dimulai di Sini</p>
    </div>
    <!-- Decorative wave -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full">
        <path fill="rgba(255,255,255,0.2)" fill-opacity="1" d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,213.3C672,213,768,171,864,160C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  </div>

  <!-- Right Section - Centered form, 35% larger -->
  <div class="w-full lg:w-[45%] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-12">
    <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 transform transition-all hover:shadow-3xl">
      <div class="text-center mb-8">
        <div class="lg:hidden mb-4">
          <i class="fas fa-car text-5xl text-yellow-500"></i>
        </div>
        <h2 class="text-4xl font-bold text-gray-800 mb-3">{isLogin ? 'Hi, Welcome Back' : 'Buat Akun Baru'}</h2>
        <p class="text-xl text-gray-600">
          {isLogin ? 'Silahkan masukkan email dan password' : 'Daftar untuk mengelola workshop Anda'}
        </p>
      </div>
      
      {#if errorMessage}
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 mb-6 rounded-lg text-lg">
          <p>{errorMessage}</p>
        </div>
      {/if}
      {#if successMessage}
        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-5 mb-6 rounded-lg text-lg">
          <p>{successMessage}</p>
        </div>
      {/if}
      
      <!-- Login Form -->
      {#if isLogin}
        <form method="POST" action="?/login" use:enhance={handleResult} class="space-y-6">
          <div>
            <label for="email" class="block text-lg font-semibold text-gray-700 mb-2">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              bind:value={email}
              placeholder="masukkan@email.com"
              required
              class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
            />
          </div>
          <div>
            <label for="password" class="block text-lg font-semibold text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                bind:value={password}
                placeholder="••••••••"
                required
                class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
              />
              <button
                type="button"
                class="eye-icon absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-600 text-xl p-2"
                on:click={togglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i class="fas fa-eye{showPassword ? '-slash' : ''}"></i>
              </button>
            </div>
          </div>
          <button type="submit" class="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xl font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            <i class="fas fa-sign-in-alt mr-3"></i>Login
          </button>
        </form>
      {:else}
        <!-- Register Form -->
        <form method="POST" action="?/register" use:enhance={handleResult} class="space-y-6">
          <div>
            <label for="email" class="block text-lg font-semibold text-gray-700 mb-2">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              bind:value={email}
              placeholder="masukkan@email.com"
              required
              class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
            />
          </div>
          <div>
            <label for="name" class="block text-lg font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              name="name"
              bind:value={name}
              placeholder="Nama lengkap Anda"
              required
              class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
            />
          </div>
          
          {#if showRoleSelect}
            <div>
              <label for="role" class="block text-lg font-semibold text-gray-700 mb-2">Role</label>
              <select
                id="role"
                name="role"
                bind:value={role}
                class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
              <p class="mt-2 text-sm text-gray-500">* Hanya email tertentu yang bisa memilih role Admin/Super Admin</p>
            </div>
          {/if}
          
          <div>
            <label for="password" class="block text-lg font-semibold text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                bind:value={password}
                placeholder="••••••••"
                required
                minlength="6"
                class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
              />
              <button
                type="button"
                class="eye-icon absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-600 text-xl p-2"
                on:click={togglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i class="fas fa-eye{showPassword ? '-slash' : ''}"></i>
              </button>
            </div>
          </div>
          <div>
            <label for="confirm-password" class="block text-lg font-semibold text-gray-700 mb-2">Konfirmasi Password</label>
            <div class="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                bind:value={confirmPassword}
                placeholder="••••••••"
                required
                minlength="6"
                class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
              />
              <button
                type="button"
                class="eye-icon absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-600 text-xl p-2"
                on:click={toggleConfirmPassword}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                <i class="fas fa-eye{showConfirmPassword ? '-slash' : ''}"></i>
              </button>
            </div>
          </div>
          
          {#if showWorkshopStatus}
            <div>
              <label for="workshop" class="block text-lg font-semibold text-gray-700 mb-2">Workshop</label>
              <select
                id="workshop"
                name="workshop"
                bind:value={workshop}
                class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
              >
                <option value="">Pilih Workshop</option>
                {#each workshopOptions as w}
                  <option value={w}>{w}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="status" class="block text-lg font-semibold text-gray-700 mb-2">Status</label>
              <select
                id="status"
                name="status"
                bind:value={status}
                class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all"
              >
                <option value="">Pilih Status</option>
                {#each statusOptions as s}
                  <option value={s}>{s}</option>
                {/each}
              </select>
            </div>
          {/if}
          
          <button type="submit" class="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xl font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            <i class="fas fa-user-plus mr-3"></i>Daftar
          </button>
        </form>
      {/if}
      
      <div class="mt-8 text-center">
        <p class="text-lg text-gray-600">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <button
            type="button"
            class="text-yellow-600 hover:text-yellow-700 font-bold text-lg ml-2 underline underline-offset-4"
            on:click={toggleForm}
          >
            {isLogin ? 'Daftar sekarang' : 'Login di sini'}
          </button>
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .eye-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
</style>
