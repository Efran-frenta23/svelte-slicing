<main>
    <div>
        <div>
            <i class="fas fa-list"></i> Car List
        </div>
        <button aria-label="Add New Car">
            <i class="fas fa-plus"></i> Add Car
        </button>
    </div>

    <h1>Car List</h1>

    <div>
        <div>
            <h2>Registered Cars</h2>
            <div>
                <div>
                    <input type="text" id="searchInput" placeholder="Search by VIN, License, Brand, Model, or Owner..." aria-label="Search Cars">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>
        <div>
            <div id="totalCars">Total Cars: 3</div>
            <div>
                <table aria-label="Cars Table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>License Number</th>
                            <th>VIN</th>
                            <th>Owner</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="carsTable">
                        <tr>
                            <td>1</td>
                            <td>Toyota</td>
                            <td>Rush</td>
                            <td>BA 1234 OOD</td>
                            <td>123456789</td>
                            <td>Anne</td>
                            <td>
                                <button aria-label="Edit Car"><i class="fas fa-edit"></i></button>
                                <button aria-label="Delete Car"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Honda</td>
                            <td>Civic</td>
                            <td>BA 5678 ABC</td>
                            <td>987654321</td>
                            <td>Budi</td>
                            <td>
                                <button  aria-label="Edit Car"><i class="fas fa-edit"></i></button>
                                <button  aria-label="Delete Car"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Chery</td>
                            <td>Tiggo</td>
                            <td>BA 9012 XYZ</td>
                            <td>456789123</td>
                            <td>Citra</td>
                            <td>
                                <button aria-label="Edit Car"><i class="fas fa-edit"></i></button>
                                <button aria-label="Delete Car"><i class="fas fa-trash"></i></button>
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