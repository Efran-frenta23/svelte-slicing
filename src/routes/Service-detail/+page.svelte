<script>
    import { onMount } from 'svelte';

    // Reactive state for section toggling
    let expandedSections = {
        'service-info': true,
        'member-info': true,
        'car-info': true
    };

    // Reactive service data
    let serviceData = {
        serviceInfo: {
            date: 'Saturday, 22 December 2024 13:00 - 14:00',
            mileage: '20,123 km',
            captain: 'Maryadi',
            branch: 'Honda Denpasar'
        },
        memberInfo: {
            name: 'Anne',
            memberId: '123456789',
            point: '2,600',
            phone: '628123456789',
            address: 'Jl. Siliwangi No.76, Pakuan, Kec. Bogor Selatan, Kota Bogor, Jawa Barat'
        },
        carInfo: {
            brand: 'Toyota',
            model: 'Rush',
            licenseNumber: 'BA 1234 OOD',
            vin: '123456789',
            driverName: 'Yanto',
            year: '2024'
        },
        transaction: {
            items: [
                {
                    title: 'Tire Replacement - Bridgestone',
                    costs: [
                        { label: 'Service Fee', value: 'Rp 50,000' },
                        { label: 'Price', value: 'Rp 600,000 x4' },
                        { label: 'Discount 10%', value: '-Rp 240,000', isDiscount: true }
                    ]
                },
                {
                    title: 'Engine Oil Replacement - Castrol',
                    costs: [
                        { label: 'Service Fee', value: 'Rp 50,000' },
                        { label: 'Price', value: 'Rp 600,000 x1' }
                    ]
                }
            ],
            subtotal: 'Rp 2,450,000',
            totalDiscount: 'Rp 240,000',
            tax: 'Rp 245,000',
            grandTotal: 'Rp 2,455,000',
            paymentStatus: 'Paid',
            warrantyNote: 'Valid for 6 months from service date.'
        }
    };

    // Loading state
    let isLoading = true;

    // Toggle section function
    function toggleSection(sectionId) {
        expandedSections[sectionId] = !expandedSections[sectionId];
    }

    // Button actions
    function downloadInvoice() {
        console.log('Downloading invoice...');
        // Suggestion: Implement actual PDF generation or API call
    }

    function viewImages() {
        console.log('Viewing images...');
        // Suggestion: Open a modal or navigate to image gallery
    }

    // Back navigation
    function goBack() {
        history.back();
        // Alternative: goto('/previous-page'); // Replace with actual route
    }

    // Keyboard navigation
    onMount(() => {
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                goBack(); // Close or navigate back on Escape
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const sections = ['service-info', 'member-info', 'car-info'];
                const currentIndex = sections.findIndex(id => expandedSections[id]);
                let newIndex = currentIndex;
                if (e.key === 'ArrowUp') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
                } else {
                    newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
                }
                sections.forEach(id => expandedSections[id] = false);
                expandedSections[sections[newIndex]] = true;
            }
        }

        // Simulate loading
        setTimeout(() => {
            isLoading = false;
        }, 1000);

        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-tools"></i> Service Detail
        </div>
        <div class="user-info">
            <div class="user-avatar">A</div>
            <div>
                <div style="font-size: var(--font-size-sm); font-weight: 600;">Autopulse</div>
                <div style="font-size: var(--font-size-xs); opacity: 0.8;">Super Admin</div>
            </div>
            <i class="fas fa-chevron-down" style="font-size: 10px; opacity: 0.8;"></i>
        </div>
    </div>

    <h1 class="section-header">Service Detail</h1>

    <div class="content-body" class:loading={isLoading}>
        {#if isLoading}
            <div class="loading-spinner">Loading...</div>
        {:else}
            <div class="content-card">
                <div class="card-header">
                    <button class="btn-back" on:click={goBack} aria-label="Back to Previous Page">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2 class="card-title">Service Detail</h2>
                </div>
                <div class="card-body">
                    <div class="service-detail">
                        <div>
                            <!-- Service Information -->
                            <div class="detail-section" id="service-info">
                                <div class="detail-section-header" 
                                     on:click={() => toggleSection('service-info')}
                                     role="button" 
                                     tabindex="0"
                                     aria-expanded={expandedSections['service-info']}>
                                    <h3>Service Information</h3>
                                    <i class="fas {expandedSections['service-info'] ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon"></i>
                                </div>
                                {#if expandedSections['service-info']}
                                    <div class="detail-content">
                                        <div class="detail-row">
                                            <div class="detail-label">Service Date</div>
                                            <div class="detail-value">{serviceData.serviceInfo.date}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Last Mileage</div>
                                            <div class="detail-value">{serviceData.serviceInfo.mileage}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Captain</div>
                                            <div class="detail-value">{serviceData.serviceInfo.captain}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Branch</div>
                                            <div class="detail-value">{serviceData.serviceInfo.branch}</div>
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <!-- Member Information -->
                            <div class="detail-section" id="member-info">
                                <div class="detail-section-header" 
                                     on:click={() => toggleSection('member-info')}
                                     role="button" 
                                     tabindex="0"
                                     aria-expanded={expandedSections['member-info']}>
                                    <h3>Member Information</h3>
                                    <i class="fas {expandedSections['member-info'] ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon"></i>
                                </div>
                                {#if expandedSections['member-info']}
                                    <div class="detail-content">
                                        <div class="detail-row">
                                            <div class="detail-label">Name</div>
                                            <div class="detail-value">{serviceData.memberInfo.name}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Member ID</div>
                                            <div class="detail-value">{serviceData.memberInfo.memberId}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Point</div>
                                            <div class="detail-value">{serviceData.memberInfo.point}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Phone</div>
                                            <div class="detail-value">{serviceData.memberInfo.phone}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Address</div>
                                            <div class="detail-value">{serviceData.memberInfo.address}</div>
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <!-- Car Information -->
                            <div class="detail-section" id="car-info">
                                <div class="detail-section-header" 
                                     on:click={() => toggleSection('car-info')}
                                     role="button" 
                                     tabindex="0"
                                     aria-expanded={expandedSections['car-info']}>
                                    <h3>Car Information</h3>
                                    <i class="fas {expandedSections['car-info'] ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon"></i>
                                </div>
                                {#if expandedSections['car-info']}
                                    <div class="detail-content">
                                        <div class="detail-row">
                                            <div class="detail-label">Brand</div>
                                            <div class="detail-value">{serviceData.carInfo.brand}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Model</div>
                                            <div class="detail-value">{serviceData.carInfo.model}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">License Number</div>
                                            <div class="detail-value">{serviceData.carInfo.licenseNumber}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">VIN</div>
                                            <div class="detail-value">{serviceData.carInfo.vin}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Driver Name</div>
                                            <div class="detail-value">{serviceData.carInfo.driverName}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Year</div>
                                            <div class="detail-value">{serviceData.carInfo.year}</div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Transaction Summary -->
                        <div class="transaction-summary">
                            <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md); font-size: var(--font-size-lg); font-weight: 600;">Transaction Detail</h3>
                            {#each serviceData.transaction.items as item}
                                <div class="service-item">
                                    <div class="service-title">{item.title}</div>
                                    {#each item.costs as cost}
                                        <div class="service-cost" class:service-discount={cost.isDiscount}>
                                            <span>{cost.label}</span>
                                            <span>{cost.value}</span>
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                            <hr style="margin: var(--spacing-md) 0; border: none; border-top: 1px solid var(--border-color);">
                            <div class="transaction-item">
                                <span>Subtotal</span>
                                <span>{serviceData.transaction.subtotal}</span>
                            </div>
                            <div class="transaction-item">
                                <span>Total Discount</span>
                                <span>{serviceData.transaction.totalDiscount}</span>
                            </div>
                            <div class="transaction-item">
                                <span>Tax</span>
                                <span>{serviceData.transaction.tax}</span>
                            </div>
                            <div class="transaction-item">
                                <span>Grand Total</span>
                                <span>{serviceData.transaction.grandTotal}</span>
                            </div>
                            <div class="payment-status">
                                <span>Payment Status: {serviceData.transaction.paymentStatus}</span>
                                <div class="status-indicator"></div>
                            </div>
                            <div class="warranty-note">
                                <small>Warranty Note: {serviceData.transaction.warrantyNote}</small>
                            </div>
                            <button class="btn btn-primary" on:click={downloadInvoice}>Download Invoice</button>
                            <button class="btn btn-action" on:click={viewImages}>See Image (Transfer Proof & Quotation)</button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>