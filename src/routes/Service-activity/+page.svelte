<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-clipboard-list"></i> Service Activity
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

    <h1 class="section-header">Service Activity</h1>

    <div class="content-body loading">
        <!-- Service Activities Card -->
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Service Activities</h2>
                <div style="color: rgba(255,255,255,0.8); font-size: var(--font-size-sm);">
                    Total Activities: 30
                </div>
            </div>
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search by Activity, Customer, Car, Captain, or Status..." aria-label="Search Service Activities">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table" aria-label="Service Activities Table">
                        <thead>
                            <tr>
                                <th data-sort="id">No <i class="fas fa-sort"></i></th>
                                <th data-sort="activity">Activity <i class="fas fa-sort"></i></th>
                                <th data-sort="customer">Customer <i class="fas fa-sort"></i></th>
                                <th data-sort="car">Car <i class="fas fa-sort"></i></th>
                                <th data-sort="captain">Captain <i class="fas fa-sort"></i></th>
                                <th data-sort="status">Status <i class="fas fa-sort"></i></th>
                            </tr>
                        </thead>
                        <tbody id="serviceActivityTable">
                            <tr>
                                <td>1</td>
                                <td>Tire Replacement</td>
                                <td>Anne</td>
                                <td>Toyota Rush</td>
                                <td>Maryadi</td>
                                <td><span class="status-badge status-inprogress">In Progress</span></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Oil Change</td>
                                <td>Budi</td>
                                <td>Honda Civic</td>
                                <td>Slamet</td>
                                <td><span class="status-badge status-completed">Completed</span></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>AC Service</td>
                                <td>Citra</td>
                                <td>Chery Tiggo</td>
                                <td>Yanto</td>
                                <td><span class="status-badge status-inprogress">In Progress</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination" role="navigation" aria-label="Pagination">
                    <button  aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
                    <button class="active" >1</button>
                    <button >2</button>
                    <button >3</button>
                    <button >4</button>
                    <span>...</span>
                    <button >10</button>
                    <button  aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </div>
</main>