"use strict";

// Data
const account1 = {
  owner: "Trinath Reddy",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, //%
  pin: 1111,
  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-10-28T09:15:04.904Z",
    "2022-12-21T10:17:24.185Z",
    "2023-08-10T14:11:59.604Z",
    "2023-08-11T17:01:17.194Z",
    "2023-08-12T23:36:17.929Z",
    "2023-08-13T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Sumit Kumar",
  movements: [5000, 3400, -150, -790, -3210, -1800, 8500, -500],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Debasis Patro",
  movements: [200, -200, 340, -300, -20, 50, 400, -4600],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Kuldeep Panda",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: "Putti Nandini Reddy",
  movements: [4300, 100, -70, 500, -90],
  interestRate: 1.7,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

//Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// modular function for the code

const formatDate = function (date, locale) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs((day2 - day1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed}: Days Ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();

    // return `${month}/${day}/${year}`;

    return new Intl.DateTimeFormat(currentAccount.locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  console.log(acc.movements.slice());
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatDate(date);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// sort button
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
//////////////////////
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toUpperCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

const timerMod = function () {
  const tick = function () {
    // Calling the timer for every sec
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //display the timer
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(tick);
      labelWelcome.textContent = `Login To Get Started`;
      containerApp.style.opacity = 0;
    }

    // decrease 1 sec from the timer
    time--;
  };
  // Set the required time
  let time = 300;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;
// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back🙏 ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
    // create date by
    // Experiencing API
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    labelDate.textContent = new Intl.DateTimeFormat("en-IN", options).format(
      now
    );

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hrs = `${now.getHours()}`.padStart(2, 0);
    // const mins = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${month}/${day}/${year}, ${hrs}:${mins}`;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Reset timer
    if (timer) clearInterval(timer);

    timer = timerMod();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
  }

  updateUI(currentAccount);

  clearTimeout(timer);
  timer = timerMod();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // add deposit
      currentAccount.movements.push(amount);

      // Add Deposit date
      currentAccount.movementsDates.push(new Date().toISOString());
      // updating UI
      updateUI(currentAccount);
    }, 2500);

    // reset timer
    clearTimeout(timer);
    timer = timerMod();
    // clear field
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    // Deleting the current account
    accounts.splice(index, 4);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

// {

//

// }
 // lectures...........
// const rsToUsd = 82.68;

// const movements = [200, -450, 400, 3000, -650, 130, -70, -100];

// // PIPELINE

// //  to check and debug the movements
// const totalDepositsUSD = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov / rsToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// Maximum Value using Reduce method()

// const max = movements.reduce(function (acc, mov) {
//   if (acc > mov) {
//     return acc;
//   } else return mov;
// }, movements[0]);

// const max = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );

// console.log(max);

// // Test data 1 = [5, 2, 4, 1, 15, 8, 3]
// // Test data 2 =

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAge.filter((age) => age >= 18);
//   const average = adults.reduce(
//     (acc, curr, i, arr) => acc + curr / arr.length,
//     0
//   );

//   return average;
// };

// const first = movements.find((mov) => mov < 0);
// console.log(first);

// const account = accounts.find((acc) => acc.owner === "Sumit Kumar");
// console.log(account);
// // SOME array method
// const sd = movements.some((mov) => mov > 0);
// console.log(sd);

// // Every Array method
// console.log(movements.every((mov) => mov > 0));

// // FLAT method used to convert a nested array into a single array

// const move = accounts.map((mov) => mov.movements);

// console.log(move.flat());

// const move2 = accounts.flatMap((mov) => mov.movements);

// console.log(move2);

// const names = accounts.map((acc) => acc.owner);
// console.log(names.sort());

// // return < 0(-ve) A will be before B
// // return > 09(+ve) B will be before A
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) return 1;
//     if (a < b) return -1;
//   })
// );

// const name = [
//   "apple",
//   "trinath",
//   "Xerox",
//   "āpples",
//   "Joyboy",
//   "Sun-god",
//   "banana",
// ];

// console.log(name.sort((a, b) => a.localeCompare(b)));

// const x = new Array(5);
// x.fill(2, 1, 4);
// console.log(x);

// const y = Array.from({ length: 10 }, () => 2);
// console.log(y);

// const z = Array.from({ length: 10 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener("click", function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll(".movements__value"),
//     (words) => +words.textContent.replace("₹", "")
//   );

//   console.log(movementsUI);
// });

// const ds = [1, 5, 1, 8, 8, 7, 1, 7, 85, 4];
// ds.fill(100, 2, -1);
// console.log(ds);
// // 1. exercise for Array methods
// const bankDeposite = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 0)
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(bankDeposite);

// // 2. exercise for Array methods
// const numDeposite1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// // .filter((mov) => mov >= 1000).length;
// // we can use simple filter(){ method to get deposites above 1000}
// console.log(numDeposite1000);

// // 3. exercise for advance reduce method
// const { deposits, withdrawals } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sums, curr) => {
//       // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
//       sums[curr > 0 ? "deposits" : "withdrawals"] += curr;

//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// // 4.creating a TITLE case --> This Is a Nice Title

// const convertTitleCase = function (title) {
//   const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ["a", "to", "it", "but", "is", "i"];

//   const conversion = title
//     .toLowerCase()
//     .split(" ")
//     .map((word) => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(" ");
//   return capitalize(conversion);
// };

// console.log(convertTitleCase("HELLO every-one hope you havinG a great day"));
// console.log(convertTitleCase("well it is nice to meet you all"));
// console.log(
//   convertTitleCase(
//     "I have to learn many things but i dont know why i am a slow poke"
//   )
// );
// // using a suffix count++ will not give the updated value of count because it will first display the count than increase its value by 1
// let a = 10;
// console.log(a++); // will give a = 10
// console.log(a); //when printed again will show the updated increased value;

// // Instead using a prefix incrementor ++count will first increase the count value than display it
// let b = 10;
// console.log(++b); // here b = 11
// // will first increase and display

// const dogs = [
//   { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//   { weight: 8, curFood: 200, owners: ["Matilda"] },
//   { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
//   { weight: 32, curFood: 340, owners: ["Michael"] },
// ];
// //1.
// dogs.forEach((dog) => {
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
// });
// console.log(dogs);

// // 2.
// const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));
// console.log(dogSarah);

// console.log(
//   `Sarah's dog ${
//     dogSarah.curFood > dogSarah.recommendedFood
//       ? "is eating too much"
//       : "too little"
//   }`
// );

// // 3.
// const ownersEatTooMuch = dogs
//   .filter((dog) => dog.curFood > dog.recommendedFood)
//   .flatMap((dog) => dog.owners);

// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter((dog) => dog.curFood < dog.recommendedFood)
//   .flatMap((dog) => dog.owners);

// console.log(ownersEatTooLittle);

// // 4.
// console.log(
//   `${ownersEatTooMuch.join(
//     ", "
//   )} 's dogs eat too much! & ${ownersEatTooLittle.join(
//     ","
//   )}'s dogs eat too little!`
// );

// // 5.

// console.log(dogs.some((dog) => dog.curFood === dog.recommendedFood));

// // OK Amount of food calculation
// const okAmountFood = (dog) =>
//   dog.curFood > dog.recommendedFood * 0.9 &&
//   dog.curFood < dog.recommendedFood * 1.1;
// // 6.

// console.log(dogs.some(okAmountFood));

// // 7.
// console.log(dogs.filter(okAmountFood));

// // 8.
// console.log(dogs);

// const copy = dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood);

// console.log(copy);
// // Numbers lecture date and time
// console.log(23 === 23.0);

// // Base 10 are 0 to 9,|1/10 = 0.1|(this is easy to represent by the javascript) 3/10 = (this is rather very hard to represent cause it gives) 3.33333333
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3); //this gives an error

// // conversion of string to number
// console.log(+"21");
// console.log(+"21");

// // parsing using parseInt()
// console.log(Number.parseInt("30px")); // this method removes any symbol attached to the INTEGER and just print that INT
// console.log(Number.parseInt("e23")); // but this string should always start with a number  like --> (30)vh <--this

// console.log(Number.parseInt("2.5rem")); // will only give 2
// console.log(Number.parseFloat("2.5rem")); // this works same as parseInt but it is for decimal numbers or float so this returns float number without any symbols attached

// // if value is NOT a Number (isNaN) method
// console.log(Number.isNaN(+"20px"));

// // checking if any value is a real number
// console.log(Number.isFinite(20));

// // if a value is integer
// console.log(Number.isInteger(23.0)); // true

// console.log("-------------------------");
// console.log(Math.sqrt(25));
// console.log(8 ** (1 / 3));
// console.log(Math.PI);
// console.log(Math.PI * Number.parseFloat("10px") ** 2);
// console.log(10 ** 2 * Math.PI);
// console.log(Number.parseFloat("20px"));
// console.log("-------------------------");
// console.log(Math.random() * 6 + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(1, 10));

// console.log(Math.trunc(24.3));
// console.log(Math.trunc(24.8));
// console.log("-------------------------");
// console.log(Math.ceil(25.2));
// console.log(Math.ceil(25.8));
// console.log("-------------------------");
// console.log(Math.round(26.2));
// console.log(Math.round(26.8));
// console.log("-------------------------");
// console.log(Math.floor(27.2));
// console.log(Math.floor(27.8));
// console.log(Math.floor(-27.2));
// console.log(Math.trunc(-27.8));

// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3)); // add more to satisfy hte 3 decimal point ==> 2.700
// console.log((2.758).toFixed(2)); // increases the 2 decimal point to next integer ---> 2.76
// console.log(+(2.758).toFixed(2));

// console.log(5 % 2);
// console.log(8 % 3);

// // labelBalance.addEventListener("click", function () {
// //   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
// //     if (i % 2 === 0) row.style.backgroundColor = "lightblue";

// //     if (i % 3 === 0) row.style.backgroundColor = "lightgreen";
// //   });
// // });

// console.log(+"250854");

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(788874125896325874145697n);
// console.log(BigInt(5) * BigInt(78965412369852147));

// const now22 = new Date();
// console.log(now22);
// console.log(new Date("Aug 12 2023 13:37:43"));
// console.log(new Date(2023, 13, 12, 13, 39));
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// 259200000;

// // console.log(future);
// // console.log(future.getFullYear());
// // console.log(future.getDate());
// // console.log(future.getHours());
// // console.log(future.getMinutes());
// // console.log(future.getSeconds());
// // console.log(future.toISOString());
// // console.log(future.getTime());
// // console.log(new Date(1691829332795));
// // console.log(Date.now());
// // future.setFullYear(2027);
// console.log("<----------------------->");
// const future = new Date(2023, 8, 12, 14, 28);

// console.log(+future);

// // const reveal = calcDate(new Date(2023, 8, 12), new Date(2023, 8, 24));
// // console.log(reveal);

// const number = 8913496.74;
// const options2 = {
//   style: "currency",
//   unit: "mile-per-hour",
//   currency: "USD",
//   useGrouping: false,
// };

// console.log(`US`, new Intl.NumberFormat("en-US", options2).format(number));
// console.log(
//   `Germany:`,
//   new Intl.NumberFormat("de-DE", options2).format(number)
// );
// console.log(`Syria`, new Intl.NumberFormat("ar-SY", options2).format(number));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options2).format(number)
// );
// const friends = ["Sumit", "Kuldeep"];
// const timer1 = setTimeout(
//   (frnd1, frnd2) =>
//     console.log(
//       `"Hello!!!! Trinath and his friends named : ${frnd1} and ${frnd2}"`
//     ),
//   2000,
//   ...friends
// );

// if (friends.includes("Kuldeep")) clearTimeout(timer1);

// // setInterval(function () {
// //   const now = new Date();
// //   const hours = now.getHours();
// //   const minutes = `${now.getMinutes()}`.padStart(2, 0);
// //   const seconds = `${now.getSeconds()}`.padStart(2, 0);

// //   console.log(`${hours}:${minutes}:${seconds}`);
// // }, 1000);
