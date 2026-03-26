import { z } from 'zod';

// Password validation schema - stronger requirements
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation schema
export const emailSchema = z.string()
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters');

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Registration schema
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['Member', 'Admin', 'Super Admin']).optional().default('Member'),
  workshop: z.string().max(255).optional().nullable(),
  status: z.enum(['Active', 'Inactive']).optional().default('Active')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

// Role change schema (only for super admin)
export const changeRoleSchema = z.object({
  userId: z.number().int().positive('Invalid user ID'),
  newRole: z.enum(['Member', 'Captain', 'Admin'])
    .refine((role) => role !== 'Super Admin', {
      message: 'Cannot assign Super Admin role via API'
    })
});

// Generic ID schema
export const idSchema = z.object({
  id: z.number().int().positive('Invalid ID')
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10)
});

// Table name whitelist for SQL injection prevention
export const allowedTables = [
  'users', 'profiles', 'admins', 'captains', 'brands', 'cars',
  'spareparts', 'service_activities', 'service_details', 'quotations',
  'members', 'logbook', 'finance', 'workshop'
] as const;

export const allowedColumns: Record<string, string[]> = {
  users: ['id', 'email', 'password_hash', 'created_at', 'updated_at'],
  profiles: ['id', 'user_id', 'name', 'role', 'email', 'workshop', 'status', 'created_at', 'updated_at'],
  admins: ['id', 'name', 'email', 'role', 'workshop', 'status', 'created_at', 'updated_at'],
  captains: ['id', 'name', 'employee_id', 'phone', 'workshop', 'created_at', 'updated_at'],
  brands: ['id', 'brand_name', 'country', 'models', 'created_at', 'updated_at'],
  cars: ['id', 'brand', 'model', 'license_plate', 'vin', 'owner', 'created_at', 'updated_at'],
  spareparts: ['id', 'part_name', 'part_number', 'brand', 'model_compatibility', 'price', 'stock', 'workshop', 'created_at', 'updated_at'],
  service_activities: ['id', 'activity_name', 'branch', 'captain_id', 'description', 'status', 'created_at', 'updated_at'],
  service_details: ['id', 'service_activity_id', 'service_name', 'service_type', 'price', 'notes', 'created_at', 'updated_at'],
  quotations: ['id', 'service_activity_id', 'item_name', 'quantity', 'unit_price', 'total_price', 'created_at', 'updated_at'],
  members: ['id', 'name', 'email', 'phone', 'workshop', 'status', 'created_at', 'updated_at'],
  logbook: ['id', 'activity_date', 'description', 'captain_id', 'vehicle_id', 'notes', 'created_at', 'updated_at'],
  finance: ['id', 'transaction_type', 'amount', 'description', 'category', 'transaction_date', 'created_at', 'updated_at'],
  workshop: ['id', 'workshop_name', 'location', 'phone', 'email', 'created_at', 'updated_at']
};

export function validateTable(tableName: string): boolean {
  return allowedTables.includes(tableName as any);
}

export function validateColumn(tableName: string, columnName: string): boolean {
  const allowed = allowedColumns[tableName];
  return allowed ? allowed.includes(columnName) : false;
}
