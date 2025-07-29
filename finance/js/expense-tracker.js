// expenseTracker.js

// Wrap entire script to ensure DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const expenseForm = document.getElementById('expenseForm');
    const expenseName = document.getElementById('expenseName');
    const expenseAmount = document.getElementById('expenseAmount');
    const expenseCategory = document.getElementById('expenseCategory');
    const expenseDate = document.getElementById('expenseDate');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const expenseTableBody = document.querySelector('#expenseTable tbody');
    const emptyExpensesRow = document.getElementById('emptyExpenses');
    const dailyTotalSpan = document.getElementById('dailyTotal');
    const overallTotalSpan = document.getElementById('overallTotal');
    const clearExpensesBtn = document.getElementById('clearExpensesBtn');
    const themeToggleButton = document.querySelector('.theme-toggle-button');
    const expenseResultsSection = document.querySelector('.expense-results-section');

    // Data Storage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let expenseHistory = JSON.parse(localStorage.getItem('expenseHistory')) || [];
    let favoriteExpenses = JSON.parse(localStorage.getItem('favoriteExpenses')) || [];
    let filteredExpenses = [...expenses];

    // Set today's date
    expenseDate.valueAsDate = new Date();

    // Helper to format date
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    // Update total calculations
    const updateTotals = () => {
        const today = new Date().toISOString().slice(0, 10);
        const dailyTotal = expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);
        const overallTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
        dailyTotalSpan.textContent = `$${dailyTotal.toFixed(2)}`;
        overallTotalSpan.textContent = `$${overallTotal.toFixed(2)}`;
    };

    // Render Expenses
    const renderExpenses = () => {
        expenseTableBody.innerHTML = '';
        if (filteredExpenses.length === 0) {
            emptyExpensesRow.style.display = 'table-row';
            emptyExpensesRow.querySelector('td').textContent = expenses.length === 0 ?
                'No expenses recorded yet.' : 'No expenses match your filters';
            expenseResultsSection.classList.add('hidden');
            return;
        }

        emptyExpensesRow.style.display = 'none';
        expenseResultsSection.classList.remove('hidden');

        filteredExpenses.forEach((expense, idx) => {
            const originalIndex = expenses.findIndex(e =>
                e.name === expense.name &&
                e.amount === expense.amount &&
                e.category === expense.category &&
                e.date === expense.date);

            const isFavorite = favoriteExpenses.some(fav =>
                fav.name === expense.name && fav.amount === expense.amount &&
                fav.category === expense.category && fav.date === expense.date);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(expense.date)}</td>
                <td>${expense.name}</td>
                <td><span class="category-badge">${expense.category}</span></td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-index="${originalIndex}"><i class="fas fa-star"></i></button>
                    <button class="delete-btn" data-index="${originalIndex}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            expenseTableBody.appendChild(row);
        });
        updateTotals();
    };

    expenseForm.addEventListener('submit', e => {
    e.preventDefault(); // ✅ This line is GOOD, keeps page from reloading

    const newExpense = {
        name: expenseName.value.trim(),
        amount: parseFloat(expenseAmount.value),
        category: expenseCategory.value,
        date: expenseDate.value
    };

    if (!newExpense.name || isNaN(newExpense.amount) || !newExpense.category || !newExpense.date) {
        alert('Please fill in all fields.');
        return;
    }

        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        filteredExpenses = [...expenses];
        renderExpenses();
        expenseForm.reset();
    });

    // Delete & Favorite
    expenseTableBody.addEventListener('click', e => {
        const delBtn = e.target.closest('.delete-btn');
        const favBtn = e.target.closest('.favorite-btn');

        if (delBtn) {
            const idx = parseInt(delBtn.dataset.index);
            const deleted = { ...expenses[idx], deletedAt: new Date().toISOString() };
            expenseHistory.push(deleted);
            expenses.splice(idx, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            localStorage.setItem('expenseHistory', JSON.stringify(expenseHistory));
            filteredExpenses = [...expenses];
            renderExpenses();
        } else if (favBtn) {
            const idx = parseInt(favBtn.dataset.index);
            const expense = expenses[idx];
            const favIdx = favoriteExpenses.findIndex(f =>
                f.name === expense.name &&
                f.amount === expense.amount &&
                f.category === expense.category &&
                f.date === expense.date);

            if (favIdx === -1) {
                favoriteExpenses.push(expense);
                favBtn.classList.add('active');
            } else {
                favoriteExpenses.splice(favIdx, 1);
                favBtn.classList.remove('active');
            }

            localStorage.setItem('favoriteExpenses', JSON.stringify(favoriteExpenses));
        }
    });

    // Clear all
    clearExpensesBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all expenses?')) {
            expenses = [];
            filteredExpenses = [];
            localStorage.removeItem('expenses');
            renderExpenses();
        }
    });

    // Theme toggle
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateThemeIcon();
    });

    const updateThemeIcon = () => {
        themeToggleButton.innerHTML = document.body.classList.contains('dark-mode') ?
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();

    // Initial render
    renderExpenses();
});