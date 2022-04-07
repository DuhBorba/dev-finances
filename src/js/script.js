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
    ModalEdit.modalElement.addEventListener("click", ModalEdit.clickOutsideBox);
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
  filtered: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(id) {
    Transaction.all = Transaction.all.filter(
      (transaction) => transaction.id !== id
    );

    App.reload();
  },

  replace(trasaction) {
    const index = Transaction.findIndex(trasaction.id);

    Transaction.all.splice(index, 1, {
      id: trasaction.id,
      description: trasaction.description,
      amount: trasaction.amount,
      date: trasaction.date,
    });

    App.reload();
  },

  findIndex(id) {
    return Transaction.all.findIndex((transaction) => transaction.id === id);
  },

  incomes(json) {
    let income = json.reduce((acc, transaction) => {
      if (transaction.amount > 0) {
        acc += transaction.amount;
      }
      return acc;
    }, 0);
    return income;
  },

  expenses(json) {
    let expense = json.reduce((acc, transaction) => {
      if (transaction.amount < 0) {
        acc += transaction.amount;
      }
      return acc;
    }, 0);
    return expense;
  },

  total(json) {
    return Transaction.incomes(json) + Transaction.expenses(json);
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransactionNotFound() {
    const div = document.createElement("div");
    div.innerHTML = `
      <p class="not-found">Nenhuma transação encontrada :(</p>
    `;

    DOM.transactionsContainer.appendChild(div);
  },

  addTransaction(transaction) {
    const tr = document.createElement("tr");
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
        <td>
          <img class="remove-icon" src="assets/edit.svg" alt="Editar Transação" title="Editar" onclick="ModalEdit.init(event, ${transaction.id})" />
          <img class="remove-icon" src="assets/minus.svg" alt="Remover Transação" title="Excluir" onclick="ModalAlert.init(event, ${transaction.id})" />
        </td>
      </tr>
    `;

    return html;
  },

  updateBalance(json) {
    document.querySelector("#income-display").innerHTML = Utils.formatCurrency(
      Transaction.incomes(json)
    );
    document.querySelector("#expense-display").innerHTML = Utils.formatCurrency(
      Transaction.expenses(json)
    );
    document.querySelector("#total-display").innerHTML = Utils.formatCurrency(
      Transaction.total(json)
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  maskDate(date) {
    date = date.replace(/\D/g, "");
    date = date.replace(/(\d{2})(\d)/, "$1/$2");
    date = date.replace(/(\d{2})(\d)/, "$1/$2");
    return date;
  },

  onlyNumbers(date) {
    date = date.replace(/\D/g, "");
    return date;
  },

  formatAmountEdit(value) {
    value = value / 100;

    return Math.round(value);
  },

  formatAmount(value) {
    value = value * 100;

    return Math.round(value);
  },

  convertStringToDate(date) {
    return Utils.convertDate(Utils.formatDateEdit(date));
  },

  convertDate(date) {
    const formatDate = Utils.formatDateEdit(date);

    return new Date(formatDate);
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

  verifyAllFilters() {
    let dataFiltered = FilterBy.verifyDateFilter();

    dataFiltered = FilterBy.verifyPositiveNegativeCheck(dataFiltered);

    if (OrderBy.descricao.classList.contains("add-arrow-down")) {
      dataFiltered = OrderBy.filterDescription(dataFiltered);
    } else if (OrderBy.descricao.classList.contains("add-arrow-up")) {
      dataFiltered = OrderBy.filterDescription(dataFiltered).reverse();
    } else if (OrderBy.valor.classList.contains("add-arrow-down")) {
      dataFiltered = OrderBy.filterAmount(dataFiltered);
    } else if (OrderBy.valor.classList.contains("add-arrow-up")) {
      dataFiltered = OrderBy.filterAmount(dataFiltered).reverse();
    } else if (OrderBy.data.classList.contains("add-arrow-down")) {
      dataFiltered = OrderBy.filterDate(dataFiltered);
    } else if (OrderBy.data.classList.contains("add-arrow-up")) {
      dataFiltered = OrderBy.filterDate(dataFiltered).reverse();
    } else {
      dataFiltered = OrderBy.filterId(dataFiltered);
    }

    dataFiltered = Search.filterTransaction(dataFiltered);

    DOM.updateBalance(dataFiltered);
    App.reloadFilter(dataFiltered);

    console.log(dataFiltered);
    console.log("----------");
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
    let { id, description, amount, date } = FormEdit.getValues(
      ModalEdit.idUser
    );

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
    const data = Transaction.all.filter((transaction) => {
      if (transaction.id == id) {
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

  putData(id) {
    const data = FormEdit.getDataTransaction(id);

    FormEdit.idUser = data[0].id;
    FormEdit.description.value = data[0].description;
    FormEdit.amount.value = Utils.formatAmountEdit(data[0].amount);
    FormEdit.date.value = Utils.formatDateEdit(data[0].date);
  },

  submit(event) {
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
  },
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

const Search = {
  input: document.querySelector("#search input"),

  addEvent() {
    Search.input.addEventListener("keyup", Utils.verifyAllFilters);
  },

  filterTransaction(json) {
    let jsonfiltered = json.filter((transaction) => {
      if (
        transaction.description
          .toLowerCase()
          .trim()
          .includes(Search.input.value.toLowerCase().trim())
      ) {
        return transaction;
      }
    });
    return jsonfiltered;
  },

  // render(transactionFilter) {
  //   DOM.clearTransactions();

  //   transactionFilter.map((transaction) => {
  //     DOM.addTransaction(transaction);
  //   });
  // },

  // renderNotFound() {
  //   DOM.clearTransactions();
  //   DOM.addTransactionNotFound();
  // },

  init() {
    Search.addEvent();
  },
};

const OrderBy = {
  descricao: document.querySelector("th#descricao"),
  valor: document.querySelector("th#valor"),
  data: document.querySelector("th#data"),
  countActiveDescription: 0,
  countActiveAmount: 0,
  countActiveDate: 0,

  addEvent() {
    OrderBy.descricao.addEventListener("click", OrderBy.initDescription);
    OrderBy.valor.addEventListener("click", OrderBy.initAmount);
    OrderBy.data.addEventListener("click", OrderBy.initDate);
  },

  arrowVisible(event) {
    OrderBy.resetClick(event);

    if (event.target.getAttribute("data-click") == 0) {
      OrderBy.removeClass();
      event.target.classList.add("add-arrow-down");

      event.target.setAttribute("data-click", "1");
    } else if (event.target.getAttribute("data-click") == 1) {
      OrderBy.removeClass();
      event.target.classList.add("add-arrow-up");

      event.target.setAttribute("data-click", "2");
    } else if (event.target.getAttribute("data-click") == 2) {
      OrderBy.removeClass();

      event.target.setAttribute("data-click", "0");
    }
  },

  resetClick(event) {
    const elements = [OrderBy.descricao, OrderBy.valor, OrderBy.data];

    elements.map((element) => {
      if (element != event.target) {
        element.setAttribute("data-click", "0");
      }
    });
  },

  removeClass() {
    OrderBy.descricao.classList.remove("add-arrow-up");
    OrderBy.descricao.classList.remove("add-arrow-down");
    OrderBy.valor.classList.remove("add-arrow-up");
    OrderBy.valor.classList.remove("add-arrow-down");
    OrderBy.data.classList.remove("add-arrow-up");
    OrderBy.data.classList.remove("add-arrow-down");
  },

  filterDescription(json) {
    return json.sort((a, b) => a.description.localeCompare(b.description));
  },

  filterAmount(json) {
    return json.sort((a, b) => (a.amount < b.amount ? 1 : -1));
  },

  filterDate(json) {
    return json.sort((a, b) => {
      aConverted = Utils.convertDate(a.date);
      bConverted = Utils.convertDate(b.date);

      return aConverted <= bConverted ? 1 : -1;
    });
  },

  filterId(json) {
    return json.sort((a, b) => (a.id > b.id ? 1 : -1));
  },

  initDescription(event) {
    OrderBy.arrowVisible(event);
    Utils.verifyAllFilters();
  },

  initAmount(event) {
    OrderBy.arrowVisible(event);
    Utils.verifyAllFilters();
  },

  initDate(event) {
    OrderBy.arrowVisible(event);
    Utils.verifyAllFilters();
  },
};

const FilterBy = {
  options: document.querySelector("#options"),
  elementInitialFinalDate: document.querySelector("#initial-final-date"),
  elementMonthYear: document.querySelector("#month-year"),
  elementYear: document.querySelector("#year"),
  elementPositiveMoney: document.querySelector("#positive-money"),
  elementNegativeMoney: document.querySelector("#negative-money"),

  inputInitialDate: document.querySelector("#input-initial-date"),
  inputFinalDate: document.querySelector("#input-final-date"),
  inputMonthYear1: document.querySelector("#input-month-year-1"),
  inputMonthYear2: document.querySelector("#input-month-year-2"),
  inputYear: document.querySelector("#input-year"),

  toggleFilter(event) {
    event.preventDefault();
    FilterBy.options.classList.toggle("active");
  },
  toggleInitialFinalDate(event) {
    event.preventDefault();
    FilterBy.elementInitialFinalDate.classList.toggle("active");
  },
  toggleMonthYear(event) {
    event.preventDefault();
    FilterBy.elementMonthYear.classList.toggle("active");
  },
  toggleYear(event) {
    event.preventDefault();
    FilterBy.elementYear.classList.toggle("active");
  },
  positiveMoney() {
    if (!FilterBy.elementPositiveMoney.classList.contains("active-button")) {
      FilterBy.elementPositiveMoney.classList.add("active-button");
      FilterBy.elementNegativeMoney.classList.remove("active-button");
    } else {
      FilterBy.elementPositiveMoney.classList.remove("active-button");
    }
    Utils.verifyAllFilters();
  },
  negativeMoney() {
    if (!FilterBy.elementNegativeMoney.classList.contains("active-button")) {
      FilterBy.elementNegativeMoney.classList.add("active-button");
      FilterBy.elementPositiveMoney.classList.remove("active-button");
    } else {
      FilterBy.elementNegativeMoney.classList.remove("active-button");
    }
    Utils.verifyAllFilters();
  },
  verifyPositiveNegativeCheck(json) {
    if (FilterBy.elementPositiveMoney.classList.contains("active-button")) {
      let jsonfiltered = json.filter((transaction) =>
        transaction.amount > 0 ? transaction : false
      );
      return jsonfiltered;
    } else if (
      FilterBy.elementNegativeMoney.classList.contains("active-button")
    ) {
      let jsonfiltered = json.filter((transaction) =>
        transaction.amount < 0 ? transaction : false
      );
      return jsonfiltered;
    } else {
      return json;
    }
  },

  addRemoveActive(element) {
    if (!element.classList.contains("active")) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  },
  addEventMaskDate() {
    FilterBy.inputInitialDate.addEventListener("keyup", () => {
      FilterBy.inputMonthYear1.value = "";
      FilterBy.inputMonthYear2.value = "";
      FilterBy.inputYear.value = "";

      let valueMask = Utils.maskDate(FilterBy.inputInitialDate.value);
      FilterBy.inputInitialDate.value = valueMask;
      Utils.verifyAllFilters();
    });
    FilterBy.inputFinalDate.addEventListener("keyup", () => {
      FilterBy.inputMonthYear1.value = "";
      FilterBy.inputMonthYear2.value = "";
      FilterBy.inputYear.value = "";

      let valueMask = Utils.maskDate(FilterBy.inputFinalDate.value);
      FilterBy.inputFinalDate.value = valueMask;
      Utils.verifyAllFilters();
    });
    FilterBy.inputMonthYear1.addEventListener("keyup", () => {
      FilterBy.inputInitialDate.value = "";
      FilterBy.inputFinalDate.value = "";
      FilterBy.inputYear.value = "";

      let valueMask = Utils.onlyNumbers(FilterBy.inputMonthYear1.value);
      FilterBy.inputMonthYear1.value = valueMask;
      Utils.verifyAllFilters();
    });
    FilterBy.inputMonthYear2.addEventListener("keyup", () => {
      FilterBy.inputInitialDate.value = "";
      FilterBy.inputFinalDate.value = "";
      FilterBy.inputYear.value = "";

      let valueMask = Utils.onlyNumbers(FilterBy.inputMonthYear2.value);
      FilterBy.inputMonthYear2.value = valueMask;
      Utils.verifyAllFilters();
    });
    FilterBy.inputYear.addEventListener("keyup", () => {
      FilterBy.inputInitialDate.value = "";
      FilterBy.inputFinalDate.value = "";
      FilterBy.inputMonthYear1.value = "";
      FilterBy.inputMonthYear2.value = "";

      let valueMask = Utils.onlyNumbers(FilterBy.inputYear.value);
      FilterBy.inputYear.value = valueMask;
      Utils.verifyAllFilters();
    });
  },
  initialDateFilter() {
    let json = Transaction.all.filter((transaction) => {
      let transactionDateFormated = Utils.convertStringToDate(transaction.date);
      let inputDateFormated = Utils.convertStringToDate(
        FilterBy.inputInitialDate.value
      );

      return transactionDateFormated >= inputDateFormated ? transaction : false;
    });
    return json;
  },
  finalDateFilter() {
    let json = Transaction.all.filter((transaction) => {
      let transactionDateFormated = Utils.convertStringToDate(transaction.date);
      let inputDateFormated = Utils.convertStringToDate(
        FilterBy.inputFinalDate.value
      );

      return transactionDateFormated <= inputDateFormated ? transaction : false;
    });
    return json;
  },
  initialFinalDateFilter() {
    let json = Transaction.all.filter((transaction) => {
      let transactionDateFormated = Utils.convertStringToDate(transaction.date);

      let inputDateInitialFormated = Utils.convertStringToDate(
        FilterBy.inputInitialDate.value
      );
      let inputDateFinalFormated = Utils.convertStringToDate(
        FilterBy.inputFinalDate.value
      );

      return transactionDateFormated >= inputDateInitialFormated &&
        transactionDateFormated <= inputDateFinalFormated
        ? transaction
        : false;
    });
    return json;
  },
  monthYearFilter() {
    let firstDay = new Date(
      FilterBy.inputMonthYear2.value,
      FilterBy.inputMonthYear1.value - 1,
      1
    );
    let lastDay = new Date(
      FilterBy.inputMonthYear2.value,
      FilterBy.inputMonthYear1.value,
      0
    );

    let json = Transaction.all.filter((transaction) => {
      let transactionDateFormated = Utils.convertStringToDate(transaction.date);

      return transactionDateFormated >= firstDay &&
        transactionDateFormated <= lastDay
        ? transaction
        : false;
    });
    return json;
  },
  yearFilter() {
    let firstMonth = new Date(FilterBy.inputYear.value, 0, 1);
    let lastMonth = new Date(FilterBy.inputYear.value, 12, 0);

    let json = Transaction.all.filter((transaction) => {
      let transactionDateFormated = Utils.convertStringToDate(transaction.date);
      // console.log(transactionDateFormated)
      return transactionDateFormated >= firstMonth &&
        transactionDateFormated <= lastMonth
        ? transaction
        : false;
    });
    return json;
  },
  verifyDateFilter() {
    let json = Transaction.all;

    if (
      FilterBy.inputInitialDate.value.length >= 10 &&
      FilterBy.inputFinalDate.value.length >= 10
    ) {
      return FilterBy.initialFinalDateFilter(json);
    } else if (FilterBy.inputInitialDate.value.length >= 10) {
      return FilterBy.initialDateFilter(json);
    } else if (FilterBy.inputFinalDate.value.length >= 10) {
      return FilterBy.finalDateFilter(json);
    } else if (
      FilterBy.inputMonthYear1.value.length >= 1 &&
      FilterBy.inputMonthYear2.value.length >= 4
    ) {
      return FilterBy.monthYearFilter(json);
    } else if (FilterBy.inputYear.value.length >= 4) {
      return FilterBy.yearFilter(json);
    } else {
      return json;
    }
  },

  clearAllInput() {
    FilterBy.inputInitialDate.value = "";
    FilterBy.inputFinalDate.value = "";
    FilterBy.inputMonthYear1.value = "";
    FilterBy.inputMonthYear2.value = "";
    FilterBy.inputYear.value = "";
    FilterBy.elementPositiveMoney.classList.remove("active-button");
    FilterBy.elementNegativeMoney.classList.remove("active-button");

    App.reload();
  },

  init() {
    FilterBy.addEventMaskDate();
  },
};

const App = {
  init() {
    Utils.verifyAllFilters();
    OrderBy.addEvent();
    Search.init();
    FilterBy.init();
    DarkMode.init();
    Storage.set(Transaction.all);
  },

  reloadFilter(json) {
    DOM.clearTransactions();

    if (json.length == 0) {
      DOM.addTransactionNotFound();
    } else {
      json.map((transaction) => {
        DOM.addTransaction(transaction);
      });
    }
  },

  reload() {
    DOM.clearTransactions();
    Utils.verifyAllFilters();
    Storage.set(Transaction.all);
  },
};

App.init();
