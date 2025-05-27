<main class="main-content">
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-tachometer-alt"></i> Member Dashboard
        </div>
        <button class="btn btn-primary add-member-btn" aria-label="Add New Member">
            <i class="fas fa-plus"></i> Add Member
        </button>
    </div>

    <h1 class="section-header">Member Management</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Members List</h2>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search members..." aria-label="Search Members">
                    <i class="fas fa-search"></i>
                </div>
                <button class="btn btn-primary" aria-label="Filter Members">
                    <i class="fas fa-filter"></i> Filter
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-container">
                <table class="data-table" aria-label="Members Table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Membership</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="membersTable">
                        <tr>
                            <td>1</td>
                            <td>John Doe</td>
                            <td>john.doe@example.com</td>
                            <td>Premium</td>
                            <td><span class="status-badge premium">Active</span></td>
                            <td>
                                <button class="action-btn" aria-label="Edit Member">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn danger" aria-label="Delete Member">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jane Smith</td>
                            <td>jane.smith@example.com</td>
                            <td>Standard</td>
                            <td><span class="status-badge standard">Inactive</span></td>
                            <td>
                                <button class="action-btn" aria-label="Edit Member">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn danger" aria-label="Delete Member">
                                    <i class="fas fa-trash"></i>
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
                <button aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>
</main>