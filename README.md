# Expro — Expense Tracker

Expro is a simple and responsive expense tracker web application built using HTML, CSS, and Vanilla JavaScript.

It allows users to record their income and expenses, manage transactions, view financial summaries, and search or filter their transaction history. Transaction data is stored locally in the browser using Local Storage.

## Features

- Add income transactions
- Add expense transactions
- Enter amount, category, date, and description
- Edit existing transactions
- Delete transactions
- View total income
- View total expenses
- View current balance
- Track "Spending That Could Have Been Avoided"
- "Unnecessary Spending" expense category
- Filter transactions by income or expense
- Filter transactions by category
- Search transactions by description or category
- Store transactions using browser Local Storage
- Basic form validation
- Responsive desktop and mobile layout
- Typing-style loading screen
- Dynamic transaction count
- Automatic current date display

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage

## Project Structure

```text
expense-tracker-amal-mohan/
│
├── index.html
├── style.css
├── script.js
└── README.md
```
##AI Assistance

AI tools were used as a development aid during the creation of this project.

AI assistance was used for:

Understanding implementation approaches
Debugging and troubleshooting
Reviewing JavaScript logic
Improving CSS styling and responsive design
Refining parts of the user interface
Reviewing and improving documentation

The code was reviewed, modified, integrated, and tested during development to ensure that the implemented features work as intended.

How to Run

No installation, package manager, or build tools are required.

Download or clone the repository.
Open the project folder.
Open index.html in a web browser.

For local development, you can also use VS Code with the Live Server extension.

Data Storage

Expro uses the browser's Local Storage to save transactions.

This means:

Transactions remain available after refreshing the page.
No external database is required.
Data is stored locally in the user's browser.
Clearing the browser's Local Storage will remove the saved transactions.
Transaction Categories
Income Categories
Salary
Freelance
Business
Investment
Gift
Other
Expense Categories
Food
Transport
Bills
Shopping
Entertainment
Health
Education
Unnecessary Spending
Other
Financial Summary

The dashboard provides the following financial summaries:

Total Income — Sum of all income transactions.
Total Expenses — Sum of all expense transactions.
Current Balance — Total income minus total expenses.
Spending That Could Have Been Avoided — Sum of expenses recorded under the Unnecessary Spending category.
Search and Filters

The transaction section provides:

Filter by income or expense
Filter by category
Search by transaction description
Search by transaction category

Transactions are displayed with the most recent dates first.

Form Validation

The application includes basic form validation to ensure that:

The amount is greater than zero.
A category is selected.
A date is provided.
A description is provided.

Invalid fields are highlighted to help identify missing or incorrect information.

Responsive Design

The application is designed to work across different screen sizes, including:

Desktop
Laptop
Tablet
Mobile devices

The layout adjusts automatically based on the available screen width.

Author

Amal Mohan

Assignment

This project was developed as part of a Software Developer Intern assignment.