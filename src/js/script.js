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

// Transactions

const Transaction = {
  all: [
    {
      description: "Luz",
      amount: -50001,
      date: "23/01/2022",
    },
    {
      description: "Criação website",
      amount: 500000,
      date: "23/01/2022",
    },
    {
      description: "Internet",
      amount: -20012,
      date: "23/01/2022",
    },
    {
      description: "Freela Landing Page",
      amount: 200000,
      date: "23/01/2022",
    },
  ],

  add(transaction){
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index){
    Transaction.all.splice(index,1)
  },

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
  },

  clearTransactions(){
    DOM.transactionsContainer.innerHTML = "";
  }
};

// Formatter Numbers

const Utils = {
  formatAmount(value){
    value = Number(value.replace(/\,\./g, "")) * 100;

    return value;
  },
  
  formatDate(date){
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

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

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields(){
    const { description, amount, date } = Form.getValues();
    if(description.trim() === "" || amount.trim() === "" || date.trim() === "" ){
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues(){
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    };
  },

  clearFields(){
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event){
    event.preventDefault();

    try{
      Form.validateFields();
      const transaction = Form.formatValues();

      console.log(transaction)

      Transaction.add(transaction);

      Form.clearFields();
      Modal.toggle(event);
      
    } catch (err){
      alert(err.message);
    }
  }
}

const App = {
  init(){
    Transaction.all.map(transaction => {
      DOM.addTransaction(transaction);
    });
    
    DOM.updateBalance();
  },

  reload(){
    DOM.clearTransactions();
    App.init();
  }
}

App.init();

Transaction.add({
  description: 'Alo',
  amount: 2000,
  date: '23/02/2022'
})
