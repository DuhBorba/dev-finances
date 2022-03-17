const ModalCreate = {
  modalElement: document.querySelector("#create"),
  open(event) {
    event.preventDefault();
    ModalCreate.modalElement.classList.add("active");
    ModalCreate.addEventModal();
  },

  close(event) {
    event.preventDefault();
    ModalCreate.modalElement.classList.remove("active");
    ModalCreate.removeEventModal();
  },

  addEventModal() {
    ModalCreate.modalElement.addEventListener(
      "click",
      ModalCreate.clickOutsideBox
    );
  },

  removeEventModal() {
    ModalCreate.modalElement.removeEventListener(
      "click",
      ModalCreate.clickOutsideBox
    );
  },

  clickOutsideBox(event) {
    if (event.target == ModalCreate.modalElement) {
      ModalCreate.close(event);
    }
  },
};

const ModalAlert = {
  modalElement: document.querySelector("#alert"),
  idUser: 0,

  open(event) {
    event.preventDefault();
    ModalAlert.modalElement.classList.add("active");
  },

  close(event) {
    event.preventDefault();
    ModalAlert.modalElement.classList.remove("active");
    ModalAlert.removeEventModal();
  },

  addEventModal() {
    ModalAlert.modalElement.addEventListener(
      "click",
      ModalAlert.clickOutsideBox
    );
  },

  removeEventModal() {
    ModalAlert.modalElement.removeEventListener(
      "click",
      ModalAlert.clickOutsideBox
    );
  },

  clickOutsideBox(event) {
    if (event.target == ModalAlert.modalElement) {
      ModalAlert.modalElement.classList.remove("active");
      ModalAlert.removeEventModal();
    }
  },

  deleteTransaction(event) {
    Transaction.remove(ModalAlert.idUser);
    ModalAlert.close(event);
  },

  init(event, id) {
    ModalAlert.idUser = id;

    ModalAlert.open(event);
    ModalAlert.addEventModal();
  },
};

const ModalEdit = {
  modalElement: document.querySelector("#edit"),
  idUser: 0,

  open(event) {
    event.preventDefault();
    ModalEdit.modalElement.classList.add("active");
  },

  close(event) {
    event.preventDefault();
    ModalEdit.modalElement.classList.remove("active");
    ModalEdit.removeEventModal();
  },

  addEventModal() {
    ModalEdit.modalElement.addEventListener(
      "click",
      ModalEdit.clickOutsideBox
    );
  },

  removeEventModal() {
    ModalEdit.modalElement.removeEventListener(
      "click",
      ModalEdit.clickOutsideBox
    );
  },

  clickOutsideBox(event) {
    if (event.target == ModalEdit.modalElement) {
      ModalEdit.modalElement.classList.remove("active");
      ModalEdit.removeEventModal();
    }
  },

  init(event, id) {
    ModalEdit.idUser = id;

    FormEdit.putData(ModalEdit.idUser);
    ModalEdit.open(event);

    ModalEdit.addEventModal();
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
    Transaction.all = Transaction.all.filter(
      (transaction) => transaction.id !== index
    );

    App.reload();
  },
  
  replace(trasaction) {
    const index = Transaction.findIndex(trasaction.id);
    
    console.log(transaction);
    console.log(index);

    Transaction.all.splice(index, 1, {
      id: trasaction.id,
      description: trasaction.description,
      amount: trasaction.amount,
      date: trasaction.date,
    });

    App.reload();
  },

  findIndex(id) {
    return Transaction.all.findIndex(transaction => transaction.id === id);
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
          <img class="remove-icon" src="assets/edit.svg" alt="Editar Transação" onclick="ModalEdit.init(event, ${transaction.id})" />
          <img class="remove-icon" src="assets/minus.svg" alt="Remover Transação" onclick="ModalAlert.init(event, ${transaction.id})" />
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
  formatAmountEdit(value) {
    value = value / 100;

    return Math.round(value);
  },

  formatAmount(value) {
    value = value * 100;

    return Math.round(value);
  },

  formatDateEdit(date) {
    const splittedDate = date.split("/");
    return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
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

const FormCreate = {
  description: document.querySelector("#create input#description"),
  amount: document.querySelector("#create input#amount"),
  date: document.querySelector("#create input#date"),

  getLastId() {
    let lastId = Transaction.all.reduce((a, b) => Math.max(a, b.id), 0);
    return lastId + 1;
  },

  getValues() {
    return {
      id: FormCreate.getLastId(),
      description: FormCreate.description.value,
      amount: FormCreate.amount.value,
      date: FormCreate.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = FormCreate.getValues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { id, description, amount, date } = FormCreate.getValues();

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
    FormCreate.description.value = "";
    FormCreate.amount.value = "";
    FormCreate.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      FormCreate.validateFields();
      const transaction = FormCreate.formatValues();

      Transaction.add(transaction);

      FormCreate.clearFields();
      ModalCreate.close(event);
    } catch (err) {
      alert(err.message);
    }
  },
};

const FormEdit = {
  idUser: 0,
  description: document.querySelector("#edit input#description"),
  amount: document.querySelector("#edit input#amount"),
  date: document.querySelector("#edit input#date"),

  clearFields() {
    FormEdit.description.value = "";
    FormEdit.amount.value = "";
    FormEdit.date.value = "";
  },

  getValues(id) {
    return {
      id: id,
      description: FormEdit.description.value,
      amount: FormEdit.amount.value,
      date: FormEdit.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = FormEdit.getValues(ModalEdit.idUser);
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { id, description, amount, date } = FormEdit.getValues(ModalEdit.idUser);

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      id,
      description,
      amount,
      date,
    };
  },

  getDataTransaction(id) {
    const data = Transaction.all.filter(transaction => {
      if(transaction.id == id){
        return {
          id,
          description,
          amount,
          date,
        };
      }
    });
    return data;
  },

  putData(id){
    const data = FormEdit.getDataTransaction(id);

    FormEdit.idUser = data[0].id;
    FormEdit.description.value = data[0].description;
    FormEdit.amount.value = Utils.formatAmountEdit(data[0].amount);
    FormEdit.date.value = Utils.formatDateEdit(data[0].date);
  },

  submit(event){
    event.preventDefault();

    try {
      FormEdit.validateFields();
      const transaction = FormEdit.formatValues();
      
      Transaction.replace(transaction);

      FormEdit.clearFields();
      ModalEdit.close(event);
    } catch (err) {
      alert(err.message);
    }
  }
};

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
