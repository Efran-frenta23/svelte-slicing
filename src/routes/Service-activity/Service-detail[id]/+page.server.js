import { query } from '$lib/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const { id } = params;

    try {
        // Fetch service details
        let service = null;
        try {
            const result = await query('SELECT * FROM service_activities WHERE id = $1', [id]);
            service = result.rows[0] || null;
        } catch (err) {
            console.warn('service_activities query failed:', err.message);
        }

        // Fetch quotations
        let quotations = [];
        try {
            const result = await query('SELECT * FROM quotations WHERE service_activity_id = $1', [id]);
            quotations = result.rows || [];
        } catch (err) {
            console.warn('quotations query failed:', err.message);
        }

        if (!service) {
            return { serviceData: {} };
        }

        let subtotal = 0;
        let totalDiscount = 0;
        const items = quotations.map(q => {
            const itemTotal = (q.service_fee || 0) + ((q.price || 0) * (q.quantity || 0));
            subtotal += itemTotal;
            totalDiscount += q.discount || 0;
            return {
                title: q.service_item || 'Service Item',
                costs: [
                    q.service_fee ? { label: 'Service Fee', value: `Rp ${q.service_fee.toLocaleString()}` } : null,
                    q.price ? { label: 'Price', value: `Rp ${q.price.toLocaleString()} x${q.quantity}` } : null,
                    q.discount ? { label: `Discount`, value: `-Rp ${q.discount.toLocaleString()}`, isDiscount: true } : null
                ].filter(Boolean)
            };
        });

        const tax = subtotal * 0.1; // Assuming 10% tax
        const grandTotal = subtotal - totalDiscount + tax;

        const serviceData = {
            serviceInfo: {
                date: service.service_date ? new Date(service.service_date).toLocaleString() : 'N/A',
                mileage: `${service.mileage || 0} km`,
                captain: service.captain_id || 'N/A',
                branch: service.branch || 'N/A',
                status: service.status || 'Pending'
            },
            memberInfo: {
                name: 'N/A',
                memberId: 'N/A',
                point: '0',
                phone: 'N/A',
                address: 'N/A'
            },
            carInfo: {
                brand: 'N/A',
                model: 'N/A',
                licenseNumber: 'N/A',
                vin: 'N/A',
                driverName: 'N/A',
                year: 'N/A'
            },
            transaction: {
                items,
                subtotal: `Rp ${subtotal.toLocaleString()}`,
                totalDiscount: `Rp ${totalDiscount.toLocaleString()}`,
                tax: `Rp ${tax.toLocaleString()}`,
                grandTotal: `Rp ${grandTotal.toLocaleString()}`,
                paymentStatus: service.status === 'Waiting for Payment' ? 'Pending' : 'Paid',
                warrantyNote: 'Valid for 6 months from service date.'
            }
        };

        return { serviceData };
    } catch (error) {
        console.error('Error fetching service details:', error);
        return { serviceData: {} };
    }
}
