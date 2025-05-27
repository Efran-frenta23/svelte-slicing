<main class="main-content" >
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-cog"></i> Spare Part
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

    <h1 class="section-header">Spare Part Inventory</h1>

    <div class="content-body loading">
        <!-- Spare Parts Card -->
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Spare Parts</h2>
                <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                    <div style="color: rgba(255,255,255,0.8); font-size: var(--font-size-sm);">
                        Total Parts: 40
                    </div>
                    <button class="btn btn-primary"  aria-label="Add New Spare Part">
                        <i class="fas fa-plus"></i> Add Spare Part
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search by Part Name, Code, or Brand..." aria-label="Search Spare Parts">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table" aria-label="Spare Parts Table">
                        <thead>
                            <tr>
                                <th data-sort="id">No <i class="fas fa-sort"></i></th>
                                <th data-sort="name">Part Name <i class="fas fa-sort"></i></th>
                                <th data-sort="code">Part Code <i class="fas fa-sort"></i></th>
                                <th data-sort="brand">Brand <i class="fas fa-sort"></i></th>
                                <th data-sort="stock">Stock <i class="fas fa-sort"></i></th>
                                <th data-sort="price">Price <i class="fas fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="sparePartTable">
                            <tr>
                                <td>1</td>
                                <td>Oil Filter</td>
                                <td>OF-12345</td>
                                <td>Toyota</td>
                                <td>50</td>
                                <td>Rp 150,000</td>
                                <td>
                                    <button class="action-btn edit" aria-label="Edit Spare Part"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn delete" aria-label="Delete Spare Part"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Brake Pad</td>
                                <td>BP-67890</td>
                                <td>Honda</td>
                                <td>30</td>
                                <td>Rp 300,000</td>
                                <td>
                                    <button class="action-btn edit" aria-label="Edit Spare Part"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn delete" aria-label="Delete Spare Part"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Air Filter</td>
                                <td>AF-11223</td>
                                <td>Chery</td>
                                <td>20</td>
                                <td>Rp 100,000</td>
                                <td>
                                    <button class="action-btn edit" aria-label="Edit Spare Part"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn delete" aria-label="Delete Spare Part"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination" role="navigation" aria-label="Pagination">
                    <button aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
                    <button class="active" >1</button>
                    <button >1</button>
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