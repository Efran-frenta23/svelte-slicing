import { update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function PUT({ params, request, locals }) {
  try {
    const user = locals.user;
    if (!user || (user.role !== 'Admin' && user.role !== 'Super Admin')) {
      return json({ error: 'Only Admin or Super Admin can edit workshops' }, { status: 403 });
    }

    const { id } = params;
    const data = await request.json();
    const workshop = await update('workshops', id, {
      ...data,
      updated_at: new Date().toISOString()
    });
    return json(workshop);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params, locals }) {
  try {
    const user = locals.user;
    if (!user || (user.role !== 'Admin' && user.role !== 'Super Admin')) {
      return json({ error: 'Only Admin or Super Admin can delete workshops' }, { status: 403 });
    }

    const { id } = params;
    await remove('workshops', id);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
