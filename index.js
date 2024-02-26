const form = document.querySelector(".value-of-transaction");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];
const income = document.querySelector("#income");
const expense = document.querySelector("#expense");
const balance = document.querySelector("#balance");

console.log(income);
console.log(balance);
console.log(expense);

console.log(incomeList);
console.log(expenseList);


function updateStats(){
    const updatedIncome = transactions
                        .filter(transaction =>transaction.amount > 0)
                        .reduce((total, transaction) => total += transaction.amount, 0);
    income.textContent = updatedIncome;
    const updatedExpance = transactions    
                            .filter(transaction => transaction.amount < 0)
                            .reduce((total, transaction)=> total += Math.abs(transaction.amount), 0)
    expense.textContent = updatedExpance;   

    const updatedBalance = updatedIncome - updatedExpance;
    balance.textContent = updatedBalance;
}

updateStats();

function ganerateTemplate(id, source, amount, time){
    return `<li data-id="${id}">
    <p>
      <span>${source}</span>
      <span id="time">${time}</span>
    </p>
    <span id="value">₹ ${Math.abs(amount)}</span>
    <i class="bi bi-trash delete"></i>
  </li>`;
};

function addTransactionDom(id, source, amount, time){
    if(amount > 0){
        incomeList.innerHTML += ganerateTemplate(id, source, amount, time);
    }else{
        expenseList.innerHTML += ganerateTemplate(id, source, amount, time);
    }
}


function addTransaction(source, amount) {
    const time = new Date();
    const transaction = {
        id: Math.round(Math.random() * 10000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDom(transaction.id, source, amount, transaction.time)
};

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === ""){
        return alert("Plese add Proper value");
    }
    addTransaction(form.source.value.trim(), Number(form.amount.value));
    updateStats();
    form.reset();
})

function getTransaction(){
    transactions.forEach(transaction => {
        if(transaction.amount > 0){
            incomeList.innerHTML += ganerateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }else{
            expenseList.innerHTML += ganerateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    });
}
getTransaction();


function deleteTransaction(id){
    transactions = transactions.filter(transaction =>{
        return transaction.id !== id;
    })
    localStorage.setItem("transactions", JSON.stringify(transactions));
};

incomeList.addEventListener("click", event=>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStats();
    }
    
});

expenseList.addEventListener("click", event=>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        
    }
});


updateStats()