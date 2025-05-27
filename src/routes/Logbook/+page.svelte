<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-book"></i> Logbook
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

    <h1 class="section-header">Service History</h1>

    <div class="content-body loading">
        <!-- Logbook Card -->
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Service Logbook</h2>
                <div style="color: rgba(255,255,255,0.8); font-size: var(--font-size-sm);">
                    Total Records: 50
                </div>
            </div>
            <div class="card-body">
                <div class="filter-group">
                    <select id="brandFilter" aria-label="Filter by Brand">
                        <option value="">All Brands</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Honda">Honda</option>
                        <option value="Chery">Chery</option>
                    </select>
                    <select id="serviceFilter" aria-label="Filter by Service Type">
                        <option value="">All Services</option>
                        <option value="Tire Replacement">Tire Replacement</option>
                        <option value="Oil Change">Oil Change</option>
                        <option value="AC Service">AC Service</option>
                        <option value="Brake Service">Brake Service</option>
                    </select>
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search by VIN, Customer, or Service..." aria-label="Search Logs">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table" aria-label="Service Logbook Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Service Date</th>
                                <th>Customer</th>
                                <th>VIN</th>
                                <th>Service Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="logbookTable">
                            <tr>
                                <td>1</td>
                                <td>22 Dec 2024</td>
                                <td>Anne</td>
                                <td>123456789</td>
                                <td>Tire Replacement</td>
                                <td><span class="status-badge status-confirmed">Confirmed</span></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>20 Dec 2024</td>
                                <td>Budi</td>
                                <td>987654321</td>
                                <td>Oil Change</td>
                                <td><span class="status-badge status-pending">Pending</span></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>18 Dec 2024</td>
                                <td>Citra</td>
                                <td>456789123</td>
                                <td>AC Service</td>
                                <td><span class="status-badge status-confirmed">Confirmed</span></td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>15 Dec 2024</td>
                                <td>Deny</td>
                                <td>321654987</td>
                                <td>Brake Service</td>
                                <td><span class="status-badge status-pending">Pending</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination" role="navigation" aria-label="Pagination">
                    <button aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
                    <button class="active" >1</button>
                    <button >2</button>
                    <button >3</button>
                    <button >4</button>
                    <span>...</span>
                    <button >10</button>
                    <button aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </div>
</main>