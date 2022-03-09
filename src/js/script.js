// Modal

const modalElement = document.querySelector(".modal-overlay");

const Modal = {
  toggle(event) {
    event.preventDefault();
    modalElement.classList.toggle("active");
  },
};

modalElement.addEventListener("click", (event) => {
  if (event.target == modalElement) {
    Modal.toggle(event);
  }
});

// Formatter Numbers

const Utils = {
  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL"
    });

    return signal + value;
  }
};

// Transactions

const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50001,
    date: "23/01/2022",
  },
  {
    id: 2,
    description: "Criação website",
    amount: 500000,
    date: "23/01/2022",
  },
  {
    id: 3,
    description: "Internet",
    amount: -20012,
    date: "23/01/2022",
  },
  {
    id: 3,
    description: "Freela Landing Page",
    amount: 200000,
    date: "23/01/2022",
  },
];

const Transaction = {
  all: transactions,
  incomes() {
    let income = Transaction.all.reduce((acc, transaction) => {
      if(transaction.amount > 0){
        acc += transaction.amount;
      }
      return acc
    }, 0);
    return income;
  },
  expenses() {
    let expense = Transaction.all.reduce((acc, transaction) => {
      if(transaction.amount < 0){
        acc += transaction.amount;
      }
      return acc
    }, 0);
    return expense;
  },
  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction, index){
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img src="assets/minus.svg" alt="Remover Transação" /></td>
      </tr>
    `;

    return html;
  },
  updateBalance() {
    document.querySelector('#income-display').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector('#expense-display').innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector('#total-display').innerHTML = Utils.formatCurrency(Transaction.total());
  }
};

Transaction.all.map(transaction => {
  DOM.addTransaction(transaction);
});

DOM.updateBalance();
