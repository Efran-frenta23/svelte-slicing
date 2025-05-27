<main>
    <div>
        <div>
            <i class="fas fa-user-plus"></i> Admin Registration
        </div>
        <div>
            <div>A</div>
            <div>
                <div>Autopulse</div>
                <div>Super Admin</div>
            </div>
            <i class="fas fa-chevron-down"></i>
        </div>
    </div>

    <h1>Admin Management</h1>

    <div>
        <!-- Admins Card -->
        <div>
            <div>
                <h2>Admins</h2>
                <div>
                    <div>
                        <input type="text" id="searchInput" placeholder="Search by Name or Email..." aria-label="Search Admins">
                        <i class="fas fa-search"></i>
                    </div>
                    <button aria-label="Add New Admin">
                        <i class="fas fa-plus"></i> Add Admin
                    </button>
                </div>
            </div>
            <div>
                <div>Total Admins: 10</div>
                <div>
                    <table aria-label="Admins Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Workshop</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminsTable">
                            <tr>
                                <td>1</td>
                                <td>Budi Santoso</td>
                                <td>budi@autopulse.com</td>
                                <td>Super Admin</td>
                                <td>Jakarta Branch</td>
                                <td><span>Active</span></td>
                                <td>
                                    <button aria-label="Edit Admin"><i class="fas fa-edit"></i></button>
                                    <button  aria-label="Delete Admin"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Ani Wijaya</td>
                                <td>ani@autopulse.com</td>
                                <td>Admin</td>
                                <td>Bandung Branch</td>
                                <td><span>Active</span></td>
                                <td>
                                    <button  aria-label="Edit Admin"><i class="fas fa-edit"></i></button>
                                    <button  aria-label="Delete Admin"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Rudi Hartono</td>
                                <td>rudi@autopulse.com</td>
                                <td>Admin</td>
                                <td>Surabaya Branch</td>
                                <td><span>Inactive</span></td>
                                <td>
                                    <button  aria-label="Edit Admin"><i class="fas fa-edit"></i></button>
                                    <button aria-label="Delete Admin"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div role="navigation" aria-label="Pagination">
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