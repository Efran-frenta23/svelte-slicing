<main>
    <div>
        <div>
            <i class="fas fa-user-tie"></i> Captain Management
        </div>
        <button aria-label="Add New Captain">
            <i class="fas fa-plus"></i> Add Captain
        </button>
    </div>

    <h1>Captain Overview</h1>

    <div>
        <div>
            <h2>Captains</h2>
            <div>
                <div>
                    <input type="text" id="searchInput" placeholder="Search captains..." aria-label="Search Captains">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>
        <div>
            <div>
                <table aria-label="Captains Table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Employee ID</th>
                            <th>Phone</th>
                            <th>Workshop</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="captainsTable">
                        <tr>
                            <td>1</td>
                            <td>Maryadi</td>
                            <td>EMP-001</td>
                            <td>+62 812 1111 2222</td>
                            <td>Jakarta Branch</td>
                            <td>
                                <button aria-label="Edit Captain"><i class="fas fa-edit"></i></button>
                                <button aria-label="Delete Captain"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Slamet</td>
                            <td>EMP-002</td>
                            <td>+62 821 3333 4444</td>
                            <td>Bandung Branch</td>
                            <td>
                                <button  aria-label="Edit Captain"><i class="fas fa-edit"></i></button>
                                <button  aria-label="Delete Captain"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Yanto</td>
                            <td>EMP-003</td>
                            <td>+62 831 5555 6666</td>
                            <td>Surabaya Branch</td>
                            <td>
                                <button  aria-label="Edit Captain"><i class="fas fa-edit"></i></button>
                                <button aria-label="Delete Captain"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div role="navigation" aria-label="Pagination">
                <button  aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
                <button >1</button>
                <button >2</button>
                <button >3</button>
                <button >4</button>
                <span>...</span>
                <button >10</button>
                <button aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>
</main>