<script>
    export let data; // Data from +page.server.js
    let serviceData = data.serviceData;
    let expandedSections = {
        'service-detail': true,
        'member-info': true,
        'car-info': true
    };

    // Toggle section
    function toggleSection(sectionId) {
        expandedSections[sectionId] = !expandedSections[sectionId];
    }

    // Button actions
    function downloadInvoice() {
        console.log('Downloading invoice...');
        // Implement PDF generation or API call
    }

    function viewImages() {
        console.log('Viewing images...');
        // Implement modal or gallery navigation
    }

    // Back navigation
    function goBack() {
        history.back();
    }
</script>

<svelte:head>
    <title>Autopulse - Service Detail</title>
    <meta name="description" content="Autopulse Dashboard - Service Detail" />
</svelte:head>

<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-tools"></i> Service Detail
        </div>
        <div class="user-info">
            <div class="user-avatar">A</div>
            <div>
                <div style="font-size: var(--font-size-sm); font-weight: bold;">Autopulse</div>
                <div style="font-size: var(--font-size-xs); opacity: 0.8;">Super Admin</div>
            </div>
            <i class="fas fa-chevron-down" style="font-size: 10px; opacity: 0.8;"></i>
        </div>
    </div>

    <h1 class="section-header">Service Detail</h1>

    <div class="content-body">
        {#if !serviceData.serviceInfo}
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
                                <div
                                    class="detail-section-header"
                                    on:click={() => toggleSection('service-info')}
                                    role="button"
                                    tabindex="0"
                                    aria-expanded={expandedSections['service-info']}
                                >
                                    <h3>Service Information</h3>
                                    <i
                                        class="fas {expandedSections['service-info'] ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon"
                                    ></i>
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
                                        <div class="detail-row">
                                            <div class="detail-label">Service Status</div>
                                            <div class="detail-value">{serviceData.serviceInfo.status}</div>
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <!-- Member Information -->
                            <div class="detail-section" id="member-info">
                                <div
                                    class="detail-section-header"
                                    on:click={() => toggleSection('member-info')}
                                    role="button"
                                    tabindex="0"
                                    aria-expanded={expandedSections['member-info']}
                                >
                                    <h3>Member Information</h3>
                                    <i
                                        class="fas {expandedSections['member-info'] ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon"
                                    ></i>
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
                                <div
                                    class="detail-section-header"
                                    on:click={() => toggleSection('car-info')}
                                    role="button"
                                    tabindex="0"
                                    aria-expanded={expandedSections['car-info']}
                                >
                                    <h3>Car Information</h3>
                                    <i
                                        class="fas {expandedSections['car-info'] ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon"
                                    ></i>
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
                            <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md); font-size: var(--font-size-lg); font-weight: 600;">
                                Quotation
                            </h3>
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
                            <hr style="margin: var(--spacing-md) 0; border: none; border-top: 1px solid var(--border-color);" />
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

<style>
    .main-content {
        padding: 20px;
    }

    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .page-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: var(--font-size-lg);
        font-weight: 600;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user-avatar {
        width: 30px;
        height: 30px;
        background: var(--primary-gradient);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 600;
    }

    .section-header {
        font-size: var(--font-size-xl);
        margin-bottom: 20px;
    }

    .content-body {
        opacity: 1;
        pointer-events: auto;
    }

    .loading-spinner {
        text-align: center;
        padding: 20px;
        font-size: var(--font-size-md);
    }

    .content-card {
        background: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        padding: 20px;
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .btn-back {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--primary-color);
    }

    .card-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
    }

    .service-detail {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

    .detail-section {
        margin-bottom: 20px;
    }

    .detail-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 10px;
        background: var(--background-secondary);
        border-radius: var(--radius-sm);
    }

    .detail-section-header h3 {
        margin: 0;
        font-size: var(--font-size-md);
    }

    .toggle-icon {
        font-size: var(--font-size-sm);
    }

    .detail-content {
        padding: 15px;
        background: var(--background-light);
        border-radius: var(--radius-sm);
        margin-top: 10px;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--border-color);
    }

    .detail-label {
        font-weight: 500;
        color: var(--text-secondary);
    }

    .detail-value {
        color: var(--text-primary);
    }

    .transaction-summary {
        flex: 1;
        min-width: 300px;
        padding: 20px;
        background: var(--background-light);
        border-radius: var(--radius-md);
    }

    .service-item {
        margin-bottom: 15px;
    }

    .service-title {
        font-weight: 600;
        margin-bottom: 5px;
    }

    .service-cost {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-size-sm);
    }

    .service-discount {
        color: var(--danger-color);
    }

    .transaction-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: var(--font-size-sm);
    }

    .payment-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
    }

    .status-indicator {
        width: 10px;
        height: 10px;
        background: var(--success-color);
        border-radius: 50%;
    }

    .warranty-note {
        margin-top: 10px;
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
    }

    .btn {
        padding: 10px;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
    }

    .btn-primary {
        background: var(--primary-gradient);
        color: white;
    }

    .btn-action {
        background: var(--secondary-gradient);
        color: white;
    }

    @media (max-width: 768px) {
        .service-detail {
            flex-direction: column;
        }

        .transaction-summary {
            min-width: 100%;
        }
    }
</style>