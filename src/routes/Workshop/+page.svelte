<main class="main-content" >
    <div class="content-header">
        <div class="page-title">
            <i class="fas fa-info-circle"></i> Workshop Information
        </div>
        <button class="btn btn-primary" aria-label="Add New Workshop">
            <i class="fas fa-plus"></i> Add Workshop
        </button>
    </div>

    <h1 class="section-header">Workshop Management</h1>

    <div class="content-card">
        <div class="card-header">
            <h2>Workshops</h2>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search workshops..." aria-label="Search Workshops">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="table-container">
                <table class="data-table" aria-label="Workshops Table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Workshop Name</th>
                            <th>Location</th>
                            <th>Contact</th>
                            <th>Captain</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="workshopsTable">
                        <tr>
                            <td>1</td>
                            <td>Jakarta Branch</td>
                            <td>Jakarta</td>
                            <td>+62 21 1234 5678</td>
                            <td>Maryadi</td>
                            <td>
                                <button class="action-btn"  aria-label="Edit Workshop">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn error"  aria-label="Delete Workshop">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Bandung Branch</td>
                            <td>Bandung</td>
                            <td>+62 22 8765 4321</td>
                            <td>Slamet</td>
                            <td>
                                <button class="action-btn"  aria-label="Edit Workshop">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn error" aria-label="Delete Workshop">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Surabaya Branch</td>
                            <td>Surabaya</td>
                            <td>+62 31 5678 1234</td>
                            <td>Yanto</td>
                            <td>
                                <button class="action-btn"  aria-label="Edit Workshop">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn error"  aria-label="Delete Workshop">
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
                <button>4</button>
                <span>...</span>
                <button>10</button>
                <button aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>
</main>