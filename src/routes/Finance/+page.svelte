<main>
    <div>
        <div>
            <i class="fas fa-dollar-sign"></i> Financial Transactions
        </div>
        <button aria-label="Add New Transaction">
            <i class="fas fa-plus"></i> Add Transaction
        </button>
    </div>

    <h1>Financial Transactions</h1>

    <div>
        <div>
            <h2>Transactions</h2>
            <div>
                <div>
                    <input type="text" id="searchInput" placeholder="Search by Transaction ID, Customer, Amount, Date, or Status..." aria-label="Search Transactions">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>
        <div>
            <div id="totalTransactions">Total Transactions: 3</div>
            <div>
                <table aria-label="Transactions Table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Transaction ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="transactionsTable">
                        <tr>
                            <td>1</td>
                            <td>TRX-001</td>
                            <td>Budi Santoso</td>
                            <td>Rp 1,500,000</td>
                            <td>2025-05-20</td>
                            <td>Completed</td>
                            <td>
                                <button  aria-label="Edit Transaction TRX-001"><i class="fas fa-edit"></i></button>
                                <button aria-label="Delete Transaction TRX-001"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>TRX-002</td>
                            <td>Ani Wijaya</td>
                            <td>Rp 2,000,000</td>
                            <td>2025-05-19</td>
                            <td>Pending</td>
                            <td>
                                <button aria-label="Edit Transaction TRX-002"><i class="fas fa-edit"></i></button>
                                <button aria-label="Delete Transaction TRX-002"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>TRX-003</td>
                            <td>Rudi Hartono</td>
                            <td>Rp 1,200,000</td>
                            <td>2025-05-18</td>
                            <td>Completed</td>
                            <td>
                                <button  aria-label="Edit Transaction TRX-003"><i class="fas fa-edit"></i></button>
                                <button  aria-label="Delete Transaction TRX-003"><i class="fas fa-trash"></i></button>
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
</main>