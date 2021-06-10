'use strict';

// Data
const account1 = {
  owner: 'Arpit Saxena',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-06-02T17:01:17.194Z',
    '2021-06-01T23:36:17.929Z',
    '2021-05-29T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Maulshree Saxena',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Raahitya Saxena Thapa',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Lakshman Thapa',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const formatMovementdate = (date,locale) => {
  const calcDaysPassed = (date1,date2) => Math.round(Math.abs(date1 - date2) / (1000*60*60*24));
  const daysPassed  = calcDaysPassed(currentDate,date);
  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
}

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

  movs.forEach((mov,i) => {
      const type = (mov > 0) ? 'deposit' : 'withdrawal';
      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementdate(date,acc.locale);
      const html = 
      `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatCur(mov,acc.locale,acc.currency)}</div>
      </div>`;
      containerMovements.insertAdjacentHTML('afterbegin',html);
  });
}

const formatCur = (value,locale,currency) => {
  return new Intl.NumberFormat(locale,{style :'currency',currency: currency}).format(value);
      
}

const createusernames = (accs) => {
  accs.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(" ").map(name => name[0]).join('');
  })
}

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  },0)
  labelBalance.textContent = `${formatCur(acc.balance,acc.locale,acc.currency)}`;
}

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements.filter(mov => mov>0).reduce((acc,mov) => acc+mov,0);
  labelSumIn.textContent = `${formatCur(incomes,acc.locale,acc.currency)}`;

  const out = acc.movements.filter(mov => mov<0).reduce((acc,mov) => acc+mov,0);
  labelSumOut.textContent = `${formatCur(out,acc.locale,acc.currency)}`;

  const interest = acc.movements.filter(mov => mov>0).map(mov => (mov*acc.interestRate)/100).filter(int => int>=1).reduce((acc,mov) => acc+mov,0);
  labelSumInterest.textContent = `${formatCur(interest,acc.locale,acc.currency)}`;
}

const updateUI = (acc) => {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc); 
}

createusernames(accounts);

const startLogoutTimer = () => {
  const tick = ()=>{
    const min=String(Math.trunc(time / 60)).padStart(2,0);
    const sec=String(time % 60).padStart(2,0);
    //in each call, print the remaining time to ui
    labelTimer.textContent = `${min}:${sec}`;
    // when 0 sec stop timer and logout
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = `Login To Get Started`;
    containerApp.style.opacity = 0;
    }
    //dec 1 sec
    time = time - 1;
  };
  //Set Time to  5min
  let time = 300;
  tick();
  //Call the timer every second
  const timer = setInterval(tick,1000);
  return timer;
}

///Event Handler
let currentAccount,timer;
let currentDate;

btnLogin.addEventListener('click',(e) => {
  e.preventDefault(); //prevent form from submitting
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === +(inputLoginPin.value))
  {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    currentDate = new Date();
    // const day = `${currentDate.getDate()}`.padStart(2,0);
    // const month = `${currentDate.getMonth()+1}`.padStart(2,0);
    // const year = currentDate.getFullYear();
    // const hour = `${currentDate.getHours()}`.padStart(2,0);
    // const min = `${currentDate.getMinutes()}`.padStart(2,0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    containerApp.style.opacity = 100;
    const options = {
      hour : 'numeric',
      minute : 'numeric',
      day : 'numeric',
      month : 'numeric',
      year : 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(currentDate);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if(timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click',(e) => {
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
  if(amount > 0 && receiverAcc && amount <= currentAccount.balance && receiverAcc?.username !== currentAccount.username)
  {
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString())
    
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnClose.addEventListener('click',(e) => {
  e.preventDefault();
  let index;
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === +(inputClosePin.value))
  {
    index = accounts.findIndex(acc => acc.username === currentAccount.username);
    inputCloseUsername.value = inputClosePin.value = "";
  }
  accounts.splice(index,1);
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `${currentAccount.owner.split(" ")[0]} Logged out successfully!`
  console.log(accounts);
});

btnLoan.addEventListener('click',(e) => {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);
  if( amount > 0 && currentAccount.movements.some(mov => mov >= amount*0.1))
  {
    setTimeout(()=>{
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    },2500);
    inputLoanAmount.value = "";
  }
  clearInterval(timer);
  timer = startLogoutTimer();
});

let sorted = false;
btnSort.addEventListener('click',(e) => {
  e.preventDefault();
  displayMovements(currentAccount,!sorted);
  sorted = !sorted;
});
