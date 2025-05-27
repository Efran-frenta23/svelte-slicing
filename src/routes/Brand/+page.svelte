<main>
    <div>
        <div>
            <i class="fas fa-car"></i> Available Brand
        </div>
    </div>

    <h1>Available Brands</h1>

    <div>
        <!-- Brands Card -->
        <div>
            <div>
                <h2>Car Brands</h2>
                <div>
                    <div>
                        <input type="text" id="searchInput" placeholder="Search by Brand Name or Country..." aria-label="Search Brands">
                        <i class="fas fa-search"></i>
                    </div>
                    <button  aria-label="Add New Brand">
                        <i class="fas fa-plus"></i> Add Brand
                    </button>
                </div>
            </div>
            <div>
                <div>Total Brands: 15</div>
                <div>
                    <table aria-label="Brands Table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Brand Name</th>
                                <th>Country</th>
                                <th>Supported Models</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="brandsTable">
                            <tr>
                                <td>1</td>
                                <td>Toyota</td>
                                <td>Japan</td>
                                <td>Corolla, Camry, Yaris</td>
                                <td>
                                    <button aria-label="Edit Brand"><i class="fas fa-edit"></i></button>
                                    <button aria-label="Delete Brand"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Honda</td>
                                <td>Japan</td>
                                <td>Civic, Accord, CR-V</td>
                                <td>
                                    <button aria-label="Edit Brand"><i class="fas fa-edit"></i></button>
                                    <button  aria-label="Delete Brand"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Chery</td>
                                <td>China</td>
                                <td>Tiggo, Arrizo</td>
                                <td>
                                    <button aria-label="Edit Brand"><i class="fas fa-edit"></i></button>
                                    <button  aria-label="Delete Brand"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div role="navigation" aria-label="Pagination">
                    <button aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
                    <button >1</button>
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