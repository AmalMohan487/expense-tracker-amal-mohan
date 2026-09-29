const STORAGE_KEY = "expro_transactions";

// ========================================================= CATEGORIES

const incomeCategories = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];
const expenseCategories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Education", "Unnecessary Spending", "Other"];

// ========================================================= STATE

let transactions = loadTransactions();
let selectedType = "income";

// ========================================================= DOM ELEMENTS

const loadingScreen = document.getElementById("loadingScreen");
const app = document.getElementById("app");
const typingText = document.getElementById("typingText");

const form = document.getElementById("transactionForm");
const editingId = document.getElementById("editingId");

const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const transactionTypeInput = document.getElementById("transactionType");

const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const formMessage = document.getElementById("formMessage");

const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");

const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");

const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const currentBalance = document.getElementById("currentBalance");
const avoidableSpending = document.getElementById("avoidableSpending");
const transactionCount = document.getElementById("transactionCount");
const todayDate = document.getElementById("todayDate");

// ========================================================= SAFETY NET

window.addEventListener("error", revealAppIfStuck);
setTimeout(revealAppIfStuck, 6000);

function revealAppIfStuck() {
    if (!loadingScreen.classList.contains("hidden")) {
        loadingScreen.classList.add("hidden");
        app.classList.remove("hidden");
    }
}

// ========================================================= INITIALIZE

document.addEventListener("DOMContentLoaded", () => {
    setTodayDate();
    setDefaultDate();
    updateCategoryOptions();
    updateDescriptionPlaceholder();
    updateCategoryFilter();
    renderAll();
    startLoadingScreen();
    attachValidationClearers();
});

// ========================================================= LOADING SCREEN

function startLoadingScreen() {
    const lines = ["Welcome to Expro", "Your expense tracker", "You spend.", "We track."];
    typingText.innerHTML = "";
    let lineIndex = 0;

    function typeLine() {
        if (lineIndex >= lines.length) {
            setTimeout(hideLoadingScreen, 700);
            return;
        }

        const line = document.createElement("div");
        line.className = "typing-line";
        typingText.appendChild(line);

        const lineText = lines[lineIndex];
        let characterIndex = 0;

        const typing = setInterval(() => {
            line.textContent = lineText.slice(0, characterIndex);
            characterIndex++;

            if (characterIndex > lineText.length) {
                clearInterval(typing);
                lineIndex++;
                setTimeout(typeLine, 250);
            }
        }, 45);
    }

    function hideLoadingScreen() {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.transition = "opacity .35s ease";

        setTimeout(() => {
            loadingScreen.classList.add("hidden");
            app.classList.remove("hidden");
        }, 350);
    }

    typeLine();
}

// ========================================================= DATE

function setTodayDate() {
    todayDate.textContent = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date());
}

function setDefaultDate() {
    const today = new Date();

    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    )
        .toISOString()
        .split("T")[0];

    dateInput.value = localDate;
}

// ========================================================= LOCAL STORAGE

function loadTransactions() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveTransactions() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactions)
        );
    } catch {
        showFormMessage(
            "Could not save — your browser's storage may be full or disabled."
        );
    }
}

// ========================================================= FORMATTERS

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(value);
}

function formatDate(date) {
    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

// ========================================================= CATEGORY OPTIONS

function updateCategoryOptions() {
    const categories =
        selectedType === "income"
            ? incomeCategories
            : expenseCategories;

    categoryInput.innerHTML = categories
        .map(c => `<option value="${c}">${c}</option>`)
        .join("");
}

// ========================================================= DESCRIPTION PLACEHOLDER

function updateDescriptionPlaceholder() {
    if (selectedType === "expense") {
        descriptionInput.placeholder = "e.g. Monthly rent";
    } else {
        descriptionInput.placeholder = "e.g. Monthly salary";
    }
}

// ========================================================= CATEGORY FILTER

function updateCategoryFilter() {
    const categories = [
        ...new Set(transactions.map(item => item.category))
    ].sort();

    const previousValue = categoryFilter.value;

    categoryFilter.innerHTML =
        `<option value="all">All Categories</option>` +
        categories
            .map(
                c =>
                    `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`
            )
            .join("");

    if (categories.includes(previousValue)) {
        categoryFilter.value = previousValue;
    }
}

// ========================================================= INCOME / EXPENSE TOGGLE

document.querySelectorAll(".type-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedType = button.dataset.type;

        transactionTypeInput.value = selectedType;

        document
            .querySelectorAll(".type-btn")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        updateCategoryOptions();
        updateDescriptionPlaceholder();
        clearFormMessage();
    });
});

// ========================================================= VALIDATION

const requiredFields = [
    amountInput,
    categoryInput,
    dateInput,
    descriptionInput
];

function attachValidationClearers() {
    requiredFields.forEach(field => {
        field.addEventListener("input", () => {
            field.classList.remove("invalid");
        });
    });
}

function validate(amount, category, date, description) {
    const errors = {};

    if (!amount || amount <= 0) {
        errors.amount = "a valid amount greater than 0";
    }

    if (!category) {
        errors.category = "a category";
    }

    if (!date) {
        errors.date = "a date";
    }

    if (!description) {
        errors.description = "a description";
    }

    return errors;
}

// ========================================================= ADD / UPDATE TRANSACTION

form.addEventListener("submit", event => {
    event.preventDefault();

    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value.trim();

    const errors = validate(
        amount,
        category,
        date,
        description
    );

    requiredFields.forEach(field => {
        field.classList.remove("invalid");
    });

    if (Object.keys(errors).length > 0) {
        if (errors.amount) {
            amountInput.classList.add("invalid");
        }

        if (errors.category) {
            categoryInput.classList.add("invalid");
        }

        if (errors.date) {
            dateInput.classList.add("invalid");
        }

        if (errors.description) {
            descriptionInput.classList.add("invalid");
        }

        showFormMessage(
            "Please enter " +
            Object.values(errors).join(", ") +
            "."
        );

        return;
    }

    clearFormMessage();

    const existingId = editingId.value;

    if (existingId) {
        const index = transactions.findIndex(
            item => String(item.id) === existingId
        );

        if (index !== -1) {
            transactions[index] = {
                ...transactions[index],
                type: selectedType,
                amount,
                category,
                date,
                description,
                updatedAt: Date.now()
            };
        }

        exitEditMode();
    } else {
        transactions.push({
            id: Date.now(),
            type: selectedType,
            amount,
            category,
            date,
            description,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
    }

    saveTransactions();
    updateCategoryFilter();
    renderAll();
    resetForm();
});

// ========================================================= EDIT TRANSACTION

function editTransaction(id) {
    const transaction = transactions.find(
        item => item.id === id
    );

    if (!transaction) return;

    selectedType = transaction.type;

    transactionTypeInput.value = transaction.type;

    editingId.value = String(transaction.id);

    document
        .querySelectorAll(".type-btn")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.type === transaction.type
            );
        });

    updateCategoryOptions();
    updateDescriptionPlaceholder();

    amountInput.value = transaction.amount;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;
    descriptionInput.value = transaction.description;

    requiredFields.forEach(field => {
        field.classList.remove("invalid");
    });

    clearFormMessage();

    formTitle.textContent = "Edit Transaction";
    submitBtn.textContent = "Update Transaction";

    cancelEditBtn.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ========================================================= DELETE TRANSACTION

function deleteTransaction(id) {
    const transaction = transactions.find(
        item => item.id === id
    );

    if (!transaction) return;

    const confirmed = window.confirm(
        `Delete "${transaction.description}"?`
    );

    if (!confirmed) return;

    transactions = transactions.filter(
        item => item.id !== id
    );

    if (editingId.value === String(id)) {
        exitEditMode();
        resetForm();
    }

    saveTransactions();
    updateCategoryFilter();
    renderAll();
}

// ========================================================= CANCEL EDIT

cancelEditBtn.addEventListener("click", () => {
    exitEditMode();
    resetForm();
});

function exitEditMode() {
    editingId.value = "";

    formTitle.textContent = "Add Transaction";
    submitBtn.textContent = "Add Transaction";

    cancelEditBtn.classList.add("hidden");
}

// ========================================================= RESET FORM

function resetForm() {
    form.reset();

    selectedType = "income";

    transactionTypeInput.value = "income";

    document
        .querySelectorAll(".type-btn")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.type === "income"
            );
        });

    requiredFields.forEach(field => {
        field.classList.remove("invalid");
    });

    updateCategoryOptions();
    updateDescriptionPlaceholder();
    setDefaultDate();
    clearFormMessage();
}

// ========================================================= FORM MESSAGES

function showFormMessage(message) {
    formMessage.textContent = message;
}

function clearFormMessage() {
    formMessage.textContent = "";
}

// ========================================================= FILTERS

[typeFilter, categoryFilter, searchInput].forEach(element => {
    element.addEventListener("input", renderTransactions);
    element.addEventListener("change", renderTransactions);
});

// ========================================================= RENDER ALL

function renderAll() {
    renderSummary();
    renderTransactions();
}

// ========================================================= SUMMARY

function renderSummary() {
    const income = transactions
        .filter(i => i.type === "income")
        .reduce((sum, i) => sum + i.amount, 0);

    const expenses = transactions
        .filter(i => i.type === "expense")
        .reduce((sum, i) => sum + i.amount, 0);

    const avoidable = transactions
        .filter(
            i =>
                i.type === "expense" &&
                i.category === "Unnecessary Spending"
        )
        .reduce((sum, i) => sum + i.amount, 0);

    totalIncome.textContent = formatCurrency(income);
    totalExpenses.textContent = formatCurrency(expenses);
    currentBalance.textContent = formatCurrency(
        income - expenses
    );
    avoidableSpending.textContent = formatCurrency(avoidable);
}

// ========================================================= FILTER TRANSACTIONS

function getFilteredTransactions() {
    const selectedTypeFilter = typeFilter.value;
    const selectedCategory = categoryFilter.value;
    const search = searchInput.value.trim().toLowerCase();

    return transactions
        .filter(item => {
            const matchesType =
                selectedTypeFilter === "all" ||
                item.type === selectedTypeFilter;

            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            const matchesSearch =
                !search ||
                item.description.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search);

            return (
                matchesType &&
                matchesCategory &&
                matchesSearch
            );
        })
        .sort((a, b) => {
            const dateDifference =
                new Date(b.date) - new Date(a.date);

            if (dateDifference !== 0) {
                return dateDifference;
            }

            const bTime =
                b.updatedAt ||
                b.createdAt ||
                b.id ||
                0;

            const aTime =
                a.updatedAt ||
                a.createdAt ||
                a.id ||
                0;

            return bTime - aTime;
        });
}

// ========================================================= RENDER TRANSACTIONS

function renderTransactions() {
    const filtered = getFilteredTransactions();

    transactionList.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");

        if (transactions.length === 0) {
            emptyTitle.textContent = "No transactions yet";

            emptyText.textContent =
                "Add your first transaction to get started.";
        } else {
            emptyTitle.textContent =
                "No matching transactions";

            emptyText.textContent =
                "Try adjusting your search or filters.";
        }
    } else {
        emptyState.classList.add("hidden");

        filtered.forEach(transaction => {
            const row = document.createElement("tr");

            const amountClass =
                transaction.type === "income"
                    ? "income-text"
                    : "expense-text";

            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";

            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>

                <td>
                    ${escapeHtml(transaction.description)}
                </td>

                <td>
                    ${escapeHtml(transaction.category)}
                </td>

                <td>
                    <span class="type-badge ${transaction.type}">
                        ${capitalize(transaction.type)}
                    </span>
                </td>

                <td class="amount ${amountClass}">
                    ${sign}${formatCurrency(transaction.amount)}
                </td>

                <td>
                    <div class="action-buttons">

                        <button
                            class="action-btn"
                            title="Edit"
                            aria-label="Edit ${escapeHtml(transaction.description)}"
                            onclick="editTransaction(${transaction.id})"
                        >
                            ✎
                        </button>

                        <button
                            class="action-btn delete-btn"
                            title="Delete"
                            aria-label="Delete ${escapeHtml(transaction.description)}"
                            onclick="deleteTransaction(${transaction.id})"
                        >
                            ×
                        </button>

                    </div>
                </td>
            `;

            transactionList.appendChild(row);
        });
    }

    transactionCount.textContent =
        filtered.length === transactions.length
            ? `${filtered.length} transaction${filtered.length === 1 ? "" : "s"}`
            : `Showing ${filtered.length} of ${transactions.length} transactions`;
}

// ========================================================= SECURITY

function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}