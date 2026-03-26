import { createUser, authenticateUser, createSession, validateEmail } from '$lib/auth';
import { validatePasswordStrength } from '$lib/password';
import { loginSchema, registerSchema } from '$lib/validators';
import { validateRequest } from '$lib/security';
import { authLogger, auditLogger } from '$lib/logger';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
  // Clear old Supabase cookies
  const supabaseCookies = [
    'sb-qxdylfidszktvbbyxiey-auth-token.0',
    'sb-qxdylfidszktvbbyxiey-auth-token.1',
    'sb-sfcbffrpowginbtvtjqd-auth-token.0',
    'sb-sfcbffrpowginbtvtjqd-auth-token.1'
  ];
  
  for (const cookieName of supabaseCookies) {
    cookies.delete(cookieName, { path: '/' });
  }
  
  return {};
}

export const actions = {
  login: async ({ request, cookies, getClientAddress, locals }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    const csrfToken = data.get('csrf_token');

    // Verify CSRF token
    if (!csrfToken || csrfToken !== locals.csrfToken) {
      auditLogger.warn({
        event: 'CSRF_VALIDATION_FAILED',
        email,
        ipAddress: getClientAddress(),
      }, 'CSRF token validation failed');
      
      return fail(403, { 
        error: 'Invalid CSRF token. Please refresh and try again.'
      });
    }

    // Validate with Zod
    const validation = validateRequest(loginSchema, { email, password });
    if (!validation.success) {
      return fail(400, { 
        error: 'Validation failed',
        details: validation.errors 
      });
    }

    const ipAddress = getClientAddress();
    
    try {
      const result = await authenticateUser(email, password, ipAddress);

      if (result.error) {
        authLogger.warn({ email, ipAddress }, 'Login failed');
        return fail(401, { error: result.error });
      }

      // Create session in Redis with IP tracking
      const session = createSession(result.user.id, {
        ...result.user,
        ip_address: ipAddress
      }, ipAddress, request.headers.get('user-agent'));
      
      cookies.set('autopulse-session', session.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production'
      });

      auditLogger.info({
        event: 'LOGIN_SUCCESS',
        userId: result.user.id,
        email,
        ipAddress,
      }, 'User logged in successfully');

      throw redirect(303, '/Dashboard');
    } catch (error) {
      if (error instanceof redirect) throw error;
      
      authLogger.error({ error: error.message, email, ipAddress }, 'Login error');
      return fail(500, { error: 'Login failed. Please try again.' });
    }
  },

  register: async ({ request, cookies, getClientAddress }) => {
    const data = await request.formData();
    const ipAddress = getClientAddress();
    
    // Validate with Zod
    const validation = validateRequest(registerSchema, Object.fromEntries(data));
    if (!validation.success) {
      return fail(400, { 
        error: 'Validation failed',
        details: validation.errors 
      });
    }

    const { name, email, password, role, workshop, status } = validation.data;

    // Additional password strength check
    const passwordStrength = validatePasswordStrength(password);
    if (!passwordStrength.valid) {
      return fail(400, { 
        error: 'Password too weak',
        details: passwordStrength.errors,
        strength: passwordStrength.strength
      });
    }

    try {
      const result = await createUser({
        email,
        password,
        name,
        role,
        workshop: (role === 'Admin' || role === 'Super Admin') ? workshop : null,
        status: (role === 'Admin' || role === 'Super Admin') ? status : 'Active',
        ipAddress
      });

      // Clear old Supabase cookies
      const supabaseCookies = [
        'sb-qxdylfidszktvbbyxiey-auth-token.0',
        'sb-qxdylfidszktvbbyxiey-auth-token.1',
        'sb-sfcbffrpowginbtvtjqd-auth-token.0',
        'sb-sfcbffrpowginbtvtjqd-auth-token.1'
      ];
      
      for (const cookieName of supabaseCookies) {
        cookies.delete(cookieName, { path: '/' });
      }

      auditLogger.info({
        event: 'REGISTRATION_SUCCESS',
        userId: result.user.id,
        email,
        ipAddress,
      }, 'User registered successfully');

      return {
        success: 'Pendaftaran berhasil! Silakan login dengan akun Anda.'
      };
    } catch (error) {
      authLogger.error({ error: error.message, email }, 'Registration error');

      if (error.code === '23505') {
        return fail(400, { error: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' });
      }

      return fail(500, { error: 'Gagal mendaftar: ' + error.message });
    }
  }
};
