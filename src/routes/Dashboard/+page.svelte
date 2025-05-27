<main class="main-content" >
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-tachometer-alt"></i> Dashboard
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

    <h1 class="section-header">Homepage</h1>

    <div class="content-body">
        <!-- Overview Card -->
        <div class="content-card">
            <div class="card-body">
                <div class="card-title">Overview</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Data Counts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Service Revenue</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Service</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Confirmation Card -->
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Payment Confirmation</h2>
                <div class="search-container">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search payments..." aria-label="Search Payments">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-subtitle">Pending Payments</div>
                <div class="table-container">
                    <table class="data-table" aria-label="Payment Confirmation Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>VIN</th>
                                <th>Service Date</th>
                                <th>Customer</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody id="paymentsTable">
                            <tr>
                                <td>1</td>
                                <td>Toyota Vios</td>
                                <td>12425533</td>
                                <td>2025-05-20</td>
                                <td>John Doe</td>
                                <td><span class="status-badge status-pending">Waiting for payment</span></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Honda Civic</td>
                                <td>12425534</td>
                                <td>2025-05-21</td>
                                <td>Jane Smith</td>
                                <td><span class="status-badge status-pending">Waiting for payment</span></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Mazda 3</td>
                                <td>12425535</td>
                                <td>2025-05-22</td>
                                <td>Bob Johnson</td>
                                <td><span class="status-badge status-pending">Waiting for payment</span></td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Nissan Altima</td>
                                <td>12425536</td>
                                <td>2025-05-23</td>
                                <td>Alice Brown</td>
                                <td><span class="status-badge status-confirmed">Confirmed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="text-align: right; margin-top: var(--spacing-lg);">
                    <button class="btn btn-primary" aria-label="See More Payments">
                        <i class="fas fa-arrow-right"></i> See more
                    </button>
                </div>
            </div>
        </div>

        <!-- Company Revenue Card -->
        <div class="content-card">
            <div class="card-body">
                <div class="card-title">Company Revenue</div>
                <div class="card-subtitle">Total: Rp 125.000.000</div>
                <table class="revenue-table" aria-label="Company Revenue Table">
                    <tbody>
                        <tr>
                            <td>
                                <i class="fas fa-bolt" style="color: #f39c12; margin-right: var(--spacing-sm);"></i>
                                Sparks Service
                            </td>
                            <td>Rp 25.000.000</td>
                        </tr>
                        <tr>
                            <td>
                                <i class="fas fa-oil-can" style="color: #e67e22; margin-right: var(--spacing-sm);"></i>
                                Oil Change
                            </td>
                            <td>Rp 15.000.000</td>
                        </tr>
                        <tr>
                            <td>
                                <i class="fas fa-tint" style="color: #3498db; margin-right: var(--spacing-sm);"></i>
                                Coolant
                            </td>
                            <td>Rp 10.000.000</td>
                        </tr>
                        <tr>
                            <td>
                                <i class="fas fa-spray-can" style="color: #2ecc71; margin-right: var(--spacing-sm);"></i>
                                Washing Service
                            </td>
                            <td>Rp 5.000.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>