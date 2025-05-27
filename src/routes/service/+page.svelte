<div class="content-card">
    <div class="card-header">
        <h2>Service Management</h2>
        <div class="search-container">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search services..." aria-label="Search Services">
                <i class="fas fa-search"></i>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div class="table-container">
            <table class="data-table" aria-label="Services Table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Service Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="servicesTable">
                    <tr>
                        <td>01</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: var(--success-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fas fa-snowflake"></i>
                                </div>
                                <div>
                                    <div>Air Conditioning Service</div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-secondary); font-weight: 400;">AC Repair & Maintenance</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="action-btn" aria-label="Edit Service">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>02</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: var(--warning-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fas fa-circle"></i>
                                </div>
                                <div>
                                    <div>Tire Replacement</div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-secondary); font-weight: 400;">Complete tire services</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="action-btn" aria-label="Edit Service">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>03</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: var(--secondary-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fas fa-oil-can"></i>
                                </div>
                                <div>
                                    <div>Engine Oil Change</div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-secondary); font-weight: 400;">Premium oil service</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="action-btn" aria-label="Edit Service">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>04</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: var(--accent-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fas fa-filter"></i>
                                </div>
                                <div>
                                    <div>Oil Filter Replacement</div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-secondary); font-weight: 400;">High-quality filters</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="action-btn" aria-label="Edit Service">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>05</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: var(--primary-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fas fa-car"></i>
                                </div>
                                <div>
                                    <div>Chery Service</div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-secondary); font-weight: 400;">Specialized brand service</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="action-btn" aria-label="Edit Service">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" role="navigation" aria-label="Pagination">
            <button aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
            <button class="active" aria-current="page">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <span>...</span>
            <button>10</button>
            <button aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
        </div>
    </div>
</div>