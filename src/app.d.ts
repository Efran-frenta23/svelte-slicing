// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: {
				id: string;
				user_id: number;
				user: {
					id: number;
					email: string;
					name?: string;
					role?: string;
					workshop?: string;
					status?: string;
				};
				created_at: string;
				expires_at: string;
			} | null;
			user: {
				id: number;
				email: string;
				name?: string;
				role?: string;
				workshop?: string;
				status?: string;
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
