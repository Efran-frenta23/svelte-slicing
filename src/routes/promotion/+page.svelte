<div class="content-body">
    <!-- Promotions Card -->
    <div class="content-card">
        <div class="card-header">
            <h2 class="card-title">Promotions</h2>
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div style="color: rgba(255,255,255,0.8); font-size: var(--font-size-sm);">
                    Total Promotions: <span id="totalPromotions">3</span>
                </div>
                <button class="btn btn-primary"  aria-label="Add New Promotion">
                    <i class="fas fa-plus"></i> Add Promotion
                </button>
            </div>
        </div>
        <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search by Promotion Name or Status..." aria-label="Search Promotions">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table" aria-label="Promotions Table">
                    <thead>
                        <tr>
                            <th data-sort="id">No <i class="fas fa-sort"></i></th>
                            <th data-sort="name">Promotion Name <i class="fas fa-sort"></i></th>
                            <th data-sort="discount">Discount <i class="fas fa-sort"></i></th>
                            <th data-sort="startDate">Start Date <i class="fas fa-sort"></i></th>
                            <th data-sort="endDate">End Date <i class="fas fa-sort"></i></th>
                            <th data-sort="status">Status <i class="fas fa-sort"></i></th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="promotionTable"></tbody>
                </table>
            </div>
            <div class="pagination" role="navigation" aria-label="Pagination">
                <button aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
                <span id="paginationButtons"></span>
                <button  aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>
</div>