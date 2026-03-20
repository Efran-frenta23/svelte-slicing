import { createUser, authenticateUser, createSession, validateEmail, getEffectiveRole, canHaveAdminRole } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';

export async function load() {
  return {};
}

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) {
      return fail(400, { error: 'Email dan password diperlukan' });
    }

    if (!validateEmail(email)) {
      return fail(400, { error: 'Email tidak valid' });
    }

    const result = await authenticateUser(email, password);

    if (result.error) {
      return fail(401, { error: result.error });
    }

    // Create session
    const session = createSession(result.user.id, result.user);
    cookies.set('session', session.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      secure: false
    });

    throw redirect(303, '/Dashboard');
  },

  register: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const role = data.get('role') || 'Member';
    const workshop = data.get('workshop');
    const status = data.get('status');

    if (!name?.trim()) {
      return fail(400, { error: 'Nama diperlukan' });
    }

    if (!validateEmail(email)) {
      return fail(400, { error: 'Email tidak valid' });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: 'Password dan konfirmasi password tidak cocok' });
    }

    if (password.length < 6) {
      return fail(400, { error: 'Password harus minimal 6 karakter' });
    }

    // Get effective role - only admin emails can have admin roles
    const effectiveRole = getEffectiveRole(email, role);
    
    // Only admin emails need workshop and status
    const needsWorkshopStatus = effectiveRole === 'Admin' || effectiveRole === 'Super Admin';

    try {
      const result = await createUser({
        email,
        password,
        name,
        role: effectiveRole,
        workshop: needsWorkshopStatus ? (workshop || 'Jakarta Branch') : null,
        status: needsWorkshopStatus ? (status || 'Active') : 'Active'
      });

      return {
        success: 'Pendaftaran berhasil! Silakan login dengan akun Anda.'
      };
    } catch (error) {
      console.error('Registration error:', error);

      if (error.code === '23505') {
        return fail(400, { error: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' });
      }

      return fail(500, { error: 'Gagal mendaftar: ' + error.message });
    }
  }
};
