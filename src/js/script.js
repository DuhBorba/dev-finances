const Modal = {
  modalElement: document.querySelector(".modal-overlay"),
  toggle(event) {
    event.preventDefault();
    Modal.modalElement.classList.toggle("active");
  },
};

Modal.modalElement.addEventListener("click", (event) => {
  if (event.target == Modal.modalElement) {
    Modal.toggle(event);
  }
});

const ModalAlert = {
  modalAlert: document.querySelector(".modal-overlay-alert"),
  btnAlert: document.querySelector(".btn-alert"),
  btnCancelAlert: document.querySelector(".cancel-alert"),

  open(event) {
    event.preventDefault();
    ModalAlert.modalAlert.classList.add("active");
  },

  functionalitiesModal(index) {
    ModalAlert.btnAlert.addEventListener("click", deleteTransaction);
    ModalAlert.btnCancelAlert.addEventListener("click", closeAlert);
    function deleteTransaction() {
      Transaction.remove(index);
      closeAlert();
    }
    function closeAlert() {
      event.preventDefault();
      ModalAlert.modalAlert.classList.remove("active");
      ModalAlert.btnAlert.removeEventListener("click", deleteTransaction);
      ModalAlert.btnCancelAlert.removeEventListener("click", closeAlert);
    }
    ModalAlert.modalAlert.addEventListener("click", (event) => {
      if (event.target == ModalAlert.modalAlert) {
        ModalAlert.modalAlert.classList.remove("active");
        ModalAlert.btnAlert.removeEventListener("click", deleteTransaction);
        ModalAlert.btnCancelAlert.removeEventListener("click", closeAlert);
      }
    });
  },

  init(event, index) {
    ModalAlert.open(event);
    ModalAlert.functionalitiesModal(index);
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },

  getDarkMode() {
    return localStorage.getItem("dev.finances:theme");
  },

  setDarkMode() {
    localStorage.setItem("dev.finances:theme", "dark");
    DarkMode.body.classList.add("dark-theme");
    DarkMode.button.setAttribute("checked", "true");
  },

  removeDarkMode() {
    localStorage.removeItem("dev.finances:theme");
    DarkMode.body.classList.remove("dark-theme");
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = Transaction.all.reduce((acc, transaction) => {
      if (transaction.amount > 0) {
        acc += transaction.amount;
      }
      return acc;
    }, 0);
    return income;
  },

  expenses() {
    let expense = Transaction.all.reduce((acc, transaction) => {
      if (transaction.amount < 0) {
        acc += transaction.amount;
      }
      return acc;
    }, 0);
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img class="remove-icon" src="assets/minus.svg" alt="Remover Transação" onclick="ModalAlert.init(event, ${index})" />
        </td>
      </tr>
    `;

    return html;
  },

  updateBalance() {
    document.querySelector("#income-display").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.querySelector("#expense-display").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.querySelector("#total-display").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmount(value) {
    value = value * 100;

    return Math.round(value);
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getLastId() {
    let lastId = Transaction.all.reduce((a, b) => {
      return Math.max(a, b.id);
    }, 0);
    return lastId + 1;
  },

  getValues() {
    return {
      id: Form.getLastId(),
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { id, description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      id,
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();

      Transaction.add(transaction);

      Form.clearFields();
      Modal.toggle(event);
    } catch (err) {
      alert(err.message);
    }
  },
};

console.log(Form.getUltimoId());

const DarkMode = {
  body: document.querySelector("body"),
  button: document.querySelector("#switch"),
  click() {
    if (DarkMode.button.checked) {
      Storage.setDarkMode();
    } else {
      Storage.removeDarkMode();
    }
  },

  init() {
    if (Storage.getDarkMode() == "dark") {
      Storage.setDarkMode();
    } else {
      Storage.removeDarkMode();
    }
  },
};

const App = {
  init() {
    Transaction.all.map((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();

    Storage.set(Transaction.all);
    DarkMode.init();
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();
