/* Practice coding problems modeled on publicly-discussed patterns from the
   Capital One CodeSignal OA (bank/business-flavored string, simulation, and
   state-machine problems — no DP, no hard graph theory). Sources: Blind/Reddit
   candidate reports and interview-prep write-ups summarized in README.md.

   These are ORIGINAL problems written for practice purposes; they are not
   copies of any real Capital One question. */

window.PROBLEMS = [
  {
    id: "p1",
    title: "Deposit & Withdrawal Ledger",
    difficulty: "Easy",
    points: 15,
    reward: 4,
    entryName: "processLedger",
    prompt: `
      <p>You are given a list of transactions applied in order to an account
      that starts at a balance of <code>0</code>. Each transaction is a
      string in the form <code>"deposit &lt;amount&gt;"</code> or
      <code>"withdraw &lt;amount&gt;"</code>.</p>
      <p>Process the transactions in order. A withdrawal that would make the
      balance negative must be <strong>rejected</strong> (the balance does
      not change for that transaction), and a rejection counter increases by
      one. Deposits always succeed.</p>
      <p>Return an object <code>{ balance, rejected }</code> with the final
      balance and the total number of rejected withdrawals.</p>
      <p><strong>Example:</strong><br>
      <code>processLedger(["deposit 100", "withdraw 30", "withdraw 200"])</code>
      → <code>{ balance: 70, rejected: 1 }</code></p>
    `,
    starterCode:
`function processLedger(transactions) {
  // transactions: string[] like "deposit 100" or "withdraw 30"
  // return { balance: number, rejected: number }

}`,
    callTemplate: "return processLedger(__INPUT__);",
    tests: [
      { input: ["deposit 100", "withdraw 30", "withdraw 200"], expected: { balance: 70, rejected: 1 }, hidden: false },
      { input: ["withdraw 50", "deposit 20", "withdraw 20"], expected: { balance: 0, rejected: 1 }, hidden: false },
      { input: [], expected: { balance: 0, rejected: 0 }, hidden: true },
      { input: ["deposit 1000000", "withdraw 999999", "withdraw 1", "withdraw 1"], expected: { balance: 0, rejected: 1 }, hidden: true },
    ],
  },

  {
    id: "p2",
    title: "Statement Formatter",
    difficulty: "Easy",
    points: 20,
    reward: 5,
    entryName: "formatAmount",
    prompt: `
      <p>Bank statements display amounts stored as integer <strong>cents</strong>
      as dollar strings. Write <code>formatAmount(cents)</code> that:</p>
      <ul>
        <li>Formats the whole-dollar part with thousands separators
        (commas every 3 digits).</li>
        <li>Always shows exactly 2 decimal digits for cents.</li>
        <li>Prefixes with <code>$</code>.</li>
        <li>Wraps negative amounts in parentheses instead of using a minus
        sign, e.g. <code>-105000</code> → <code>"($1,050.00)"</code>.</li>
      </ul>
      <p><strong>Examples:</strong><br>
      <code>formatAmount(250)</code> → <code>"$2.50"</code><br>
      <code>formatAmount(0)</code> → <code>"$0.00"</code><br>
      <code>formatAmount(1000000)</code> → <code>"$10,000.00"</code></p>
    `,
    starterCode:
`function formatAmount(cents) {
  // return a formatted dollar string, e.g. "$1,050.00" or "($500.00)"

}`,
    callTemplate: "return formatAmount(__INPUT__);",
    tests: [
      { input: -105000, expected: "($1,050.00)", hidden: false },
      { input: 250, expected: "$2.50", hidden: false },
      { input: 0, expected: "$0.00", hidden: false },
      { input: 1000000, expected: "$10,000.00", hidden: true },
      { input: -1, expected: "($0.01)", hidden: true },
      { input: 999, expected: "$9.99", hidden: true },
    ],
  },

  {
    id: "p3",
    title: "Simple Bank System",
    difficulty: "Medium",
    points: 30,
    reward: 7,
    entryName: "BankSystem",
    prompt: `
      <p>Implement a class <code>BankSystem</code> that manages
      1-indexed accounts.</p>
      <pre>class BankSystem {
  constructor(balances)        // balances[i] = starting balance of account i+1
  deposit(account, amount)     // returns new balance, or false if account is invalid
  withdraw(account, amount)    // returns new balance, or false if invalid account
                                // or insufficient funds (no partial withdrawal)
  transfer(account1, account2, amount)
                                // returns true on success, or false if either
                                // account is invalid or account1 has insufficient funds
}</pre>
      <p>An account number is valid if it is between <code>1</code> and the
      number of accounts (inclusive). A failed operation must not change any
      balance.</p>
    `,
    starterCode:
`class BankSystem {
  constructor(balances) {

  }
  deposit(account, amount) {

  }
  withdraw(account, amount) {

  }
  transfer(account1, account2, amount) {

  }
}`,
    callTemplate:
`const __input = __INPUT__;
const bank = new BankSystem(__input.balances);
const results = [];
for (const op of __input.ops) {
  if (op.type === 'deposit') results.push(bank.deposit(op.account, op.amount));
  else if (op.type === 'withdraw') results.push(bank.withdraw(op.account, op.amount));
  else if (op.type === 'transfer') results.push(bank.transfer(op.account1, op.account2, op.amount));
}
return results;`,
    tests: [
      {
        input: {
          balances: [10, 20, 30],
          ops: [
            { type: "deposit", account: 1, amount: 5 },
            { type: "withdraw", account: 2, amount: 25 },
            { type: "withdraw", account: 1, amount: 100 },
            { type: "transfer", account1: 3, account2: 1, amount: 15 },
            { type: "deposit", account: 5, amount: 10 },
          ],
        },
        expected: [15, false, false, true, false],
        hidden: false,
      },
      {
        input: {
          balances: [0, 0],
          ops: [
            { type: "deposit", account: 1, amount: 100 },
            { type: "transfer", account1: 1, account2: 2, amount: 50 },
            { type: "withdraw", account: 2, amount: 60 },
            { type: "withdraw", account: 2, amount: 50 },
          ],
        },
        expected: [100, true, false, 0],
        hidden: false,
      },
      {
        input: {
          balances: [500],
          ops: [
            { type: "transfer", account1: 1, account2: 2, amount: 10 },
            { type: "deposit", account: 0, amount: 10 },
          ],
        },
        expected: [false, false],
        hidden: true,
      },
    ],
  },

  {
    id: "p4",
    title: "Card Authorization State Machine",
    difficulty: "Hard",
    points: 35,
    reward: 8,
    entryName: "runCardMachine",
    prompt: `
      <p>Model an ATM card-authorization flow as a state machine and write
      <code>runCardMachine(correctPin, initialBalance, events)</code>, which
      returns an array with one result string per event.</p>
      <p><strong>States:</strong> <code>NO_CARD</code> → <code>AWAITING_PIN</code>
      → <code>UNLOCKED</code>, plus a permanent <code>BLOCKED</code> state.</p>
      <p><strong>Events</strong> (each is an object with a <code>type</code>):</p>
      <ul>
        <li><code>{type:"insertCard"}</code> — if currently <code>NO_CARD</code>,
        move to <code>AWAITING_PIN</code> (reset the wrong-attempt counter) and
        emit <code>"AWAITING_PIN"</code>. If a card is already inserted
        (<code>AWAITING_PIN</code> or <code>UNLOCKED</code>), emit
        <code>"CARD_ALREADY_INSERTED"</code> with no state change.</li>
        <li><code>{type:"enterPin", pin}</code> — only valid while
        <code>AWAITING_PIN</code>; otherwise emit <code>"NO_CARD_INSERTED"</code>.
        If <code>pin === correctPin</code>, move to <code>UNLOCKED</code> and
        emit <code>"PIN_ACCEPTED"</code>. Otherwise increment the wrong-attempt
        counter; on the 3rd wrong attempt move to <code>BLOCKED</code> and emit
        <code>"CARD_BLOCKED"</code>, otherwise emit
        <code>"PIN_REJECTED_ATTEMPTS_LEFT_&lt;n&gt;"</code> where <code>n</code>
        is attempts remaining before block.</li>
        <li><code>{type:"withdraw", amount}</code> — only valid while
        <code>UNLOCKED</code>; otherwise emit <code>"TRANSACTION_DENIED"</code>.
        If <code>amount</code> exceeds the balance, emit
        <code>"INSUFFICIENT_FUNDS"</code> (stay <code>UNLOCKED</code>).
        Otherwise subtract the amount, eject the card back to
        <code>NO_CARD</code>, and emit
        <code>"WITHDRAW_OK_BALANCE_&lt;newBalance&gt;"</code>.</li>
      </ul>
      <p>Once <code>BLOCKED</code>, every subsequent event (of any type) emits
      <code>"CARD_BLOCKED"</code> forever.</p>
    `,
    starterCode:
`function runCardMachine(correctPin, initialBalance, events) {
  // return an array of result strings, one per event

}`,
    callTemplate: "return runCardMachine(__INPUT__.correctPin, __INPUT__.initialBalance, __INPUT__.events);",
    tests: [
      {
        input: {
          correctPin: "1234",
          initialBalance: 1000,
          events: [
            { type: "insertCard" },
            { type: "enterPin", pin: "0000" },
            { type: "enterPin", pin: "1234" },
            { type: "withdraw", amount: 200 },
          ],
        },
        expected: ["AWAITING_PIN", "PIN_REJECTED_ATTEMPTS_LEFT_2", "PIN_ACCEPTED", "WITHDRAW_OK_BALANCE_800"],
        hidden: false,
      },
      {
        input: {
          correctPin: "9999",
          initialBalance: 500,
          events: [
            { type: "insertCard" },
            { type: "enterPin", pin: "1111" },
            { type: "enterPin", pin: "2222" },
            { type: "enterPin", pin: "3333" },
            { type: "insertCard" },
            { type: "enterPin", pin: "9999" },
          ],
        },
        expected: [
          "AWAITING_PIN",
          "PIN_REJECTED_ATTEMPTS_LEFT_2",
          "PIN_REJECTED_ATTEMPTS_LEFT_1",
          "CARD_BLOCKED",
          "CARD_BLOCKED",
          "CARD_BLOCKED",
        ],
        hidden: false,
      },
      {
        input: {
          correctPin: "4444",
          initialBalance: 100,
          events: [
            { type: "enterPin", pin: "4444" },
            { type: "insertCard" },
            { type: "insertCard" },
            { type: "enterPin", pin: "4444" },
            { type: "withdraw", amount: 150 },
            { type: "withdraw", amount: 100 },
          ],
        },
        expected: ["NO_CARD_INSERTED", "AWAITING_PIN", "CARD_ALREADY_INSERTED", "PIN_ACCEPTED", "INSUFFICIENT_FUNDS", "WITHDRAW_OK_BALANCE_0"],
        hidden: true,
      },
    ],
  },
];

/* Alternate problems, one per difficulty slot, so repeated practice runs
   don't always show the exact same four questions. window.buildProblemSet()
   picks one variant per slot at random and mutates window.PROBLEMS in place
   (same array reference other modules already captured). */

const p1_alt = {
  id: "p1-alt",
  title: "Round-Up Savings Tracker",
  difficulty: "Easy",
  points: 15,
  reward: 4,
  entryName: "roundUpSavings",
  prompt: `
    <p>A "round-up savings" feature rounds every purchase up to the next
    whole dollar and sweeps the difference into savings. Write
    <code>roundUpSavings(purchases)</code>, where <code>purchases</code> is
    an array of positive integer purchase amounts in <strong>cents</strong>.</p>
    <p>For each purchase, compute the round-up: if the purchase is already an
    exact whole-dollar amount, the round-up is <code>0</code>; otherwise it's
    the amount needed to reach the next dollar. Return
    <code>{ totalSaved, purchaseCount }</code>, where <code>totalSaved</code>
    is the sum of all round-ups (in cents) and <code>purchaseCount</code> is
    how many purchases had a nonzero round-up.</p>
    <p><strong>Example:</strong><br>
    <code>roundUpSavings([250, 999, 100])</code> →
    <code>{ totalSaved: 51, purchaseCount: 2 }</code>
    (250¢ rounds up 50¢, 999¢ rounds up 1¢, 100¢ needs no round-up)</p>
  `,
  starterCode:
`function roundUpSavings(purchases) {
  // purchases: number[] of positive integer cents
  // return { totalSaved: number, purchaseCount: number }

}`,
  callTemplate: "return roundUpSavings(__INPUT__);",
  tests: [
    { input: [250, 999, 100], expected: { totalSaved: 51, purchaseCount: 2 }, hidden: false },
    { input: [], expected: { totalSaved: 0, purchaseCount: 0 }, hidden: false },
    { input: [100, 200, 300], expected: { totalSaved: 0, purchaseCount: 0 }, hidden: true },
    { input: [1, 2, 3], expected: { totalSaved: 294, purchaseCount: 3 }, hidden: true },
  ],
};

const p2_alt = {
  id: "p2-alt",
  title: "Masked Account Number",
  difficulty: "Easy",
  points: 20,
  reward: 5,
  entryName: "maskAccountNumber",
  prompt: `
    <p>Write <code>maskAccountNumber(number)</code>, where
    <code>number</code> is a string of digits at least 4 characters long.
    Mask every digit except the <strong>last 4</strong> with the bullet
    character <code>•</code>, then split the resulting string into groups of
    4 characters counting from the <strong>left</strong> (the last group may
    be shorter than 4), and join the groups with single spaces.</p>
    <p><strong>Examples:</strong><br>
    <code>maskAccountNumber("4111111111111234")</code> →
    <code>"•••• •••• •••• 1234"</code><br>
    <code>maskAccountNumber("12345678")</code> → <code>"•••• 5678"</code><br>
    <code>maskAccountNumber("0000")</code> → <code>"0000"</code>
    (nothing to mask when the string is only 4 characters)</p>
  `,
  starterCode:
`function maskAccountNumber(number) {
  // return the masked, grouped string described above

}`,
  callTemplate: "return maskAccountNumber(__INPUT__);",
  tests: [
    { input: "4111111111111234", expected: "•••• •••• •••• 1234", hidden: false },
    { input: "12345678", expected: "•••• 5678", hidden: false },
    { input: "1234567890", expected: "•••• ••78 90", hidden: true },
    { input: "0000", expected: "0000", hidden: true },
  ],
};

const p3_alt = {
  id: "p3-alt",
  title: "Multi-Currency Wallet",
  difficulty: "Medium",
  points: 30,
  reward: 7,
  entryName: "Wallet",
  prompt: `
    <p>Implement a class <code>Wallet</code> that holds balances in multiple
    currencies.</p>
    <pre>class Wallet {
  constructor(balances, rates)
    // rates: { USD: 1, EUR: 1.1, ... } — value of 1 unit of that currency in USD.
    // A currency is "supported" if it has a key in rates.
    // balances: starting balance (in cents) per supported currency; missing
    // currencies default to 0.
  deposit(currency, amount)   // amount in cents; returns new balance, or
                              // false if currency unsupported or amount <= 0
  withdraw(currency, amount)  // returns new balance, or false if unsupported,
                              // amount <= 0, or insufficient funds
  convert(from, to, amount)   // moves 'amount' cents out of 'from' into 'to'
                              // at the exchange rate, rounding the converted
                              // amount down (Math.floor). Returns the amount
                              // credited to 'to', or false if either currency
                              // is unsupported, amount <= 0, or insufficient
                              // funds in 'from'. No balances change on false.
}</pre>
    <p><strong>Example:</strong> with rates
    <code>{ USD: 1, EUR: 1.1 }</code>, converting 1000 cents from USD to EUR
    credits <code>Math.floor(1000 * 1 / 1.1) = 909</code> cents to EUR.</p>
  `,
  starterCode:
`class Wallet {
  constructor(balances, rates) {

  }
  deposit(currency, amount) {

  }
  withdraw(currency, amount) {

  }
  convert(from, to, amount) {

  }
}`,
  callTemplate:
`const __input = __INPUT__;
const wallet = new Wallet(__input.balances, __input.rates);
const results = [];
for (const op of __input.ops) {
  if (op.type === 'deposit') results.push(wallet.deposit(op.currency, op.amount));
  else if (op.type === 'withdraw') results.push(wallet.withdraw(op.currency, op.amount));
  else if (op.type === 'convert') results.push(wallet.convert(op.from, op.to, op.amount));
}
return results;`,
  tests: [
    {
      input: {
        balances: { USD: 1000, EUR: 500, GBP: 0 },
        rates: { USD: 1, EUR: 1.1, GBP: 1.25 },
        ops: [
          { type: "deposit", currency: "USD", amount: 200 },
          { type: "withdraw", currency: "EUR", amount: 600 },
          { type: "convert", from: "USD", to: "EUR", amount: 1000 },
          { type: "convert", from: "GBP", to: "USD", amount: 100 },
          { type: "deposit", currency: "JPY", amount: 100 },
          { type: "withdraw", currency: "USD", amount: -5 },
        ],
      },
      expected: [1200, false, 909, false, false, false],
      hidden: false,
    },
    {
      input: {
        balances: { USD: 0, EUR: 500, GBP: 0 },
        rates: { USD: 1, EUR: 1.1, GBP: 1.25 },
        ops: [{ type: "convert", from: "EUR", to: "GBP", amount: 500 }],
      },
      expected: [440],
      hidden: true,
    },
  ],
};

const p4_alt = {
  id: "p4-alt",
  title: "Loan Application State Machine",
  difficulty: "Hard",
  points: 35,
  reward: 8,
  entryName: "runLoanMachine",
  prompt: `
    <p>Model a loan application as a state machine and write
    <code>runLoanMachine(events)</code>, where <code>events</code> is an
    array of event name strings. Return an array with one result string per
    event.</p>
    <p><strong>States:</strong> <code>DRAFT</code> → <code>SUBMITTED</code> →
    <code>UNDER_REVIEW</code> → (<code>APPROVED</code> | <code>REJECTED</code>
    | <code>INFO_REQUESTED</code>), where <code>INFO_REQUESTED</code> returns
    to <code>UNDER_REVIEW</code>. <code>APPROVED</code> and
    <code>REJECTED</code> are terminal.</p>
    <p><strong>Events</strong> (starting state is <code>DRAFT</code>):</p>
    <ul>
      <li><code>"submit"</code> — valid only in <code>DRAFT</code>; moves to
      <code>SUBMITTED</code>, emits <code>"SUBMITTED"</code>. Otherwise emits
      <code>"INVALID_SUBMIT"</code>.</li>
      <li><code>"startReview"</code> — valid only in <code>SUBMITTED</code>;
      moves to <code>UNDER_REVIEW</code>, emits <code>"UNDER_REVIEW"</code>.
      Otherwise emits <code>"INVALID_ACTION"</code>.</li>
      <li><code>"requestInfo"</code> — valid only in
      <code>UNDER_REVIEW</code>; moves to <code>INFO_REQUESTED</code>, emits
      <code>"INFO_REQUESTED"</code>. Otherwise <code>"INVALID_ACTION"</code>.</li>
      <li><code>"respond"</code> — valid only in
      <code>INFO_REQUESTED</code>; moves back to <code>UNDER_REVIEW</code>,
      emits <code>"UNDER_REVIEW"</code>. Otherwise
      <code>"INVALID_ACTION"</code>.</li>
      <li><code>"approve"</code> / <code>"reject"</code> — valid only in
      <code>UNDER_REVIEW</code>; move to <code>APPROVED</code> /
      <code>REJECTED</code> and emit the same word. Otherwise
      <code>"INVALID_ACTION"</code>.</li>
    </ul>
    <p>Once <code>APPROVED</code> or <code>REJECTED</code>, every subsequent
    event emits <code>"APPLICATION_CLOSED"</code> forever.</p>
  `,
  starterCode:
`function runLoanMachine(events) {
  // events: string[] — see the event list above
  // return an array of result strings, one per event

}`,
  callTemplate: "return runLoanMachine(__INPUT__);",
  tests: [
    {
      input: ["submit", "startReview", "requestInfo", "respond", "approve"],
      expected: ["SUBMITTED", "UNDER_REVIEW", "INFO_REQUESTED", "UNDER_REVIEW", "APPROVED"],
      hidden: false,
    },
    {
      input: ["startReview", "submit", "submit"],
      expected: ["INVALID_ACTION", "SUBMITTED", "INVALID_SUBMIT"],
      hidden: false,
    },
    {
      input: ["submit", "startReview", "reject", "approve", "submit"],
      expected: ["SUBMITTED", "UNDER_REVIEW", "REJECTED", "APPLICATION_CLOSED", "APPLICATION_CLOSED"],
      hidden: true,
    },
  ],
};

/* --- Second wave of variants (added to grow the practice bank to 60
   total questions across situational/coding/behavioral). Same difficulty
   tiers and point/reward values as their slot, so the round always totals
   the same points and dollars no matter which variant gets picked. --- */

const p1_alt2 = {
  id: "p1-alt2",
  title: "Daily Spending Limit Tracker",
  difficulty: "Easy",
  points: 15,
  reward: 4,
  entryName: "dailySpendingLimitTracker",
  prompt: `
    <p>Write <code>dailySpendingLimitTracker(transactions, dailyLimit)</code>.
    <code>transactions</code> is an array of strings: either the literal
    string <code>"day"</code> (marks the start of a new day and resets that
    day's running total to 0) or a numeric string representing a purchase
    amount made on the current day.</p>
    <p>For each purchase, if adding it to the current day's running total
    would exceed <code>dailyLimit</code>, the purchase is
    <strong>declined</strong> (it does not count toward the day's total or
    the overall spent total). Otherwise it's accepted and added to both.</p>
    <p>Return <code>{ spent, declined }</code>: the total amount actually
    spent across all days, and the total number of declined purchases.</p>
    <p><strong>Example:</strong><br>
    <code>dailySpendingLimitTracker(["50", "60", "day", "30", "90"], 100)</code>
    → <code>{ spent: 80, declined: 2 }</code> (day 1: 50 accepted, 60
    declined since 50+60&gt;100; day 2 resets: 30 accepted, 90 declined
    since 30+90&gt;100)</p>
  `,
  starterCode:
`function dailySpendingLimitTracker(transactions, dailyLimit) {
  // transactions: string[] — "day" resets the running total, else a purchase amount
  // return { spent: number, declined: number }

}`,
  callTemplate: "return dailySpendingLimitTracker(__INPUT__.transactions, __INPUT__.dailyLimit);",
  tests: [
    { input: { transactions: ["50", "60", "day", "30", "90"], dailyLimit: 100 }, expected: { spent: 80, declined: 2 }, hidden: false },
    { input: { transactions: ["10", "10", "10"], dailyLimit: 100 }, expected: { spent: 30, declined: 0 }, hidden: false },
    { input: { transactions: [], dailyLimit: 100 }, expected: { spent: 0, declined: 0 }, hidden: true },
    { input: { transactions: ["day", "5"], dailyLimit: 0 }, expected: { spent: 0, declined: 1 }, hidden: true },
  ],
};

const p1_alt3 = {
  id: "p1-alt3",
  title: "ATM Bill Dispenser",
  difficulty: "Easy",
  points: 15,
  reward: 4,
  entryName: "atmBillDispenser",
  prompt: `
    <p>An ATM stocks an unlimited supply of $100, $50, $20, and $10 bills.
    Write <code>atmBillDispenser(amount)</code> that returns the bills to
    dispense using as <strong>few bills as possible</strong> (largest
    denominations first).</p>
    <p>Return <code>{ bills, count }</code> where <code>bills</code> is the
    array of bill values used (largest first) and <code>count</code> is
    <code>bills.length</code>. If <code>amount</code> is negative or isn't a
    multiple of 10 (so it can't be made exactly with these bills), return
    <code>false</code>.</p>
    <p><strong>Examples:</strong><br>
    <code>atmBillDispenser(80)</code> → <code>{ bills: [50, 20, 10], count: 3 }</code><br>
    <code>atmBillDispenser(25)</code> → <code>false</code></p>
  `,
  starterCode:
`function atmBillDispenser(amount) {
  // return { bills: number[], count: number } or false

}`,
  callTemplate: "return atmBillDispenser(__INPUT__);",
  tests: [
    { input: 80, expected: { bills: [50, 20, 10], count: 3 }, hidden: false },
    { input: 30, expected: { bills: [20, 10], count: 2 }, hidden: false },
    { input: 25, expected: false, hidden: true },
    { input: 0, expected: { bills: [], count: 0 }, hidden: true },
  ],
};

const p1_alt4 = {
  id: "p1-alt4",
  title: "Balance Threshold Alerts",
  difficulty: "Easy",
  points: 15,
  reward: 4,
  entryName: "balanceThresholdAlerts",
  prompt: `
    <p>Write <code>balanceThresholdAlerts(startBalance, transactions, lowBalanceThreshold)</code>.
    <code>transactions</code> is an array of integers (positive = deposit,
    negative = withdrawal) applied in order to a balance that starts at
    <code>startBalance</code>. Unlike a ledger, transactions always go
    through (the balance is allowed to go below the threshold, and even
    negative) — but every time the balance ends up below
    <code>lowBalanceThreshold</code> immediately after a transaction, that
    counts as one alert.</p>
    <p>Return <code>{ finalBalance, alertCount }</code>.</p>
    <p><strong>Example:</strong><br>
    <code>balanceThresholdAlerts(100, [-60, 20, -30], 50)</code> →
    <code>{ finalBalance: 30, alertCount: 2 }</code> (100-60=40, below 50:
    alert; 40+20=60, fine; 60-30=30, below 50: alert)</p>
  `,
  starterCode:
`function balanceThresholdAlerts(startBalance, transactions, lowBalanceThreshold) {
  // return { finalBalance: number, alertCount: number }

}`,
  callTemplate: "return balanceThresholdAlerts(__INPUT__.startBalance, __INPUT__.transactions, __INPUT__.lowBalanceThreshold);",
  tests: [
    { input: { startBalance: 100, transactions: [-60, 20, -30], lowBalanceThreshold: 50 }, expected: { finalBalance: 30, alertCount: 2 }, hidden: false },
    { input: { startBalance: 100, transactions: [10, 10], lowBalanceThreshold: 50 }, expected: { finalBalance: 120, alertCount: 0 }, hidden: false },
    { input: { startBalance: 50, transactions: [], lowBalanceThreshold: 10 }, expected: { finalBalance: 50, alertCount: 0 }, hidden: true },
  ],
};

const p2_alt2 = {
  id: "p2-alt2",
  title: "Transaction Reference ID Generator",
  difficulty: "Easy",
  points: 20,
  reward: 5,
  entryName: "generateRefs",
  prompt: `
    <p>Write <code>generateRefs(transactions)</code>, where each item in
    <code>transactions</code> is <code>{ type, seq }</code>
    (<code>type</code> a short string like <code>"DEP"</code>, <code>seq</code>
    a non-negative integer). Return an array of reference-id strings in the
    form <code>"&lt;TYPE&gt;-&lt;seq padded to 6 digits with leading
    zeros&gt;"</code>. If <code>seq</code> already has 6 or more digits,
    don't truncate it — just use it as-is.</p>
    <p><strong>Example:</strong><br>
    <code>generateRefs([{type:"DEP",seq:42},{type:"WD",seq:7}])</code> →
    <code>["DEP-000042", "WD-000007"]</code></p>
  `,
  starterCode:
`function generateRefs(transactions) {
  // transactions: { type: string, seq: number }[]
  // return string[]

}`,
  callTemplate: "return generateRefs(__INPUT__);",
  tests: [
    { input: [{ type: "DEP", seq: 42 }, { type: "WD", seq: 7 }], expected: ["DEP-000042", "WD-000007"], hidden: false },
    { input: [{ type: "XFER", seq: 1 }], expected: ["XFER-000001"], hidden: false },
    { input: [], expected: [], hidden: true },
    { input: [{ type: "XFER", seq: 1234567 }], expected: ["XFER-1234567"], hidden: true },
  ],
};

const p2_alt3 = {
  id: "p2-alt3",
  title: "Field Namer (camelCase)",
  difficulty: "Easy",
  points: 20,
  reward: 5,
  entryName: "toFieldName",
  prompt: `
    <p>Internal form labels need matching camelCase field names. Write
    <code>toFieldName(label)</code>, where <code>label</code> is one or more
    lowercase words separated by single spaces. Lowercase the first word
    as-is, capitalize the first letter of every following word (lowercasing
    the rest of it), and join everything with no spaces.</p>
    <p><strong>Examples:</strong><br>
    <code>toFieldName("account holder name")</code> → <code>"accountHolderName"</code><br>
    <code>toFieldName("apr")</code> → <code>"apr"</code></p>
  `,
  starterCode:
`function toFieldName(label) {
  // label: space-separated lowercase words
  // return the camelCase field name

}`,
  callTemplate: "return toFieldName(__INPUT__);",
  tests: [
    { input: "account holder name", expected: "accountHolderName", hidden: false },
    { input: "routing number", expected: "routingNumber", hidden: false },
    { input: "apr", expected: "apr", hidden: true },
    { input: "available credit limit", expected: "availableCreditLimit", hidden: true },
  ],
};

const p2_alt4 = {
  id: "p2-alt4",
  title: "Statement Line Truncator",
  difficulty: "Easy",
  points: 20,
  reward: 5,
  entryName: "truncateLine",
  prompt: `
    <p>Write <code>truncateLine(text, maxLength)</code> for fitting a
    merchant description into a fixed-width statement line.</p>
    <ul>
      <li>If <code>text.length &lt;= maxLength</code>, return it unchanged.</li>
      <li>Otherwise, if <code>maxLength &gt; 3</code>, return the first
      <code>maxLength - 3</code> characters followed by <code>"..."</code>
      (so the result is exactly <code>maxLength</code> characters).</li>
      <li>Otherwise (<code>maxLength &lt;= 3</code>, too short to fit an
      ellipsis meaningfully), just return the first <code>maxLength</code>
      characters with no ellipsis.</li>
    </ul>
    <p><strong>Examples:</strong><br>
    <code>truncateLine("AMAZON MARKETPLACE PMTS", 10)</code> → <code>"AMAZON ..."</code><br>
    <code>truncateLine("STARBUCKS", 20)</code> → <code>"STARBUCKS"</code></p>
  `,
  starterCode:
`function truncateLine(text, maxLength) {
  // return the truncated line described above

}`,
  callTemplate: "return truncateLine(__INPUT__.text, __INPUT__.maxLength);",
  tests: [
    { input: { text: "AMAZON MARKETPLACE PMTS", maxLength: 10 }, expected: "AMAZON ...", hidden: false },
    { input: { text: "STARBUCKS", maxLength: 20 }, expected: "STARBUCKS", hidden: false },
    { input: { text: "SUPERLONGMERCHANTNAME", maxLength: 5 }, expected: "SU...", hidden: true },
    { input: { text: "HELLO", maxLength: 3 }, expected: "HEL", hidden: true },
  ],
};

const p3_alt2 = {
  id: "p3-alt2",
  title: "Joint Account Manager",
  difficulty: "Medium",
  points: 30,
  reward: 7,
  entryName: "JointAccount",
  prompt: `
    <p>Implement a class <code>JointAccount</code> that tracks which owners
    are currently authorized on a shared account.</p>
    <pre>class JointAccount {
  constructor(owners, balance)   // owners: string[] of unique starting owner names
  authorize(owner)   // adds owner if not already authorized; returns true if
                      // added, false if already authorized
  revoke(owner)       // removes owner; returns true if removed, false if not
                       // currently authorized, or if they're the only
                       // remaining owner (can't remove the last owner)
  deposit(owner, amount)    // returns new balance, or false if owner isn't
                             // authorized or amount &lt;= 0
  withdraw(owner, amount)   // returns new balance, or false if owner isn't
                             // authorized, amount &lt;= 0, or insufficient funds
}</pre>
      <p>A failed operation must not change the balance or the authorized set.</p>
  `,
  starterCode:
`class JointAccount {
  constructor(owners, balance) {

  }
  authorize(owner) {

  }
  revoke(owner) {

  }
  deposit(owner, amount) {

  }
  withdraw(owner, amount) {

  }
}`,
  callTemplate:
`const __input = __INPUT__;
const acc = new JointAccount(__input.owners, __input.balance);
const results = [];
for (const op of __input.ops) {
  if (op.type === 'deposit') results.push(acc.deposit(op.owner, op.amount));
  else if (op.type === 'withdraw') results.push(acc.withdraw(op.owner, op.amount));
  else if (op.type === 'authorize') results.push(acc.authorize(op.owner));
  else if (op.type === 'revoke') results.push(acc.revoke(op.owner));
}
return results;`,
  tests: [
    {
      input: {
        owners: ["A", "B"],
        balance: 100,
        ops: [
          { type: "deposit", owner: "A", amount: 50 },
          { type: "withdraw", owner: "B", amount: 30 },
          { type: "authorize", owner: "C" },
          { type: "withdraw", owner: "C", amount: 20 },
          { type: "revoke", owner: "A" },
        ],
      },
      expected: [150, 120, true, 100, true],
      hidden: false,
    },
    {
      input: {
        owners: ["B", "C"],
        balance: 100,
        ops: [
          { type: "withdraw", owner: "A", amount: 10 },
          { type: "revoke", owner: "B" },
          { type: "revoke", owner: "C" },
        ],
      },
      expected: [false, true, false],
      hidden: false,
    },
    {
      input: {
        owners: ["A"],
        balance: 10,
        ops: [
          { type: "authorize", owner: "A" },
          { type: "deposit", owner: "A", amount: 0 },
          { type: "withdraw", owner: "A", amount: 5 },
        ],
      },
      expected: [false, false, 5],
      hidden: true,
    },
  ],
};

const p3_alt3 = {
  id: "p3-alt3",
  title: "Budget Category Allocator",
  difficulty: "Medium",
  points: 30,
  reward: 7,
  entryName: "BudgetAllocator",
  prompt: `
    <p>Implement a class <code>BudgetAllocator</code> for tracking monthly
    spending limits per category.</p>
    <pre>class BudgetAllocator {
  constructor(categories)     // categories: { name: monthlyLimit, ... }
  spend(category, amount)     // if category doesn't exist, amount &lt;= 0, or
                               // amount exceeds the remaining budget for that
                               // category, reject and return false (no
                               // partial spend). Otherwise deduct and return
                               // the new remaining budget for that category.
  remaining(category)         // returns remaining budget, or false if the
                               // category doesn't exist
  resetMonth()                 // resets every category's spent amount back
                                // to 0 (full limit available again); returns true
}</pre>
  `,
  starterCode:
`class BudgetAllocator {
  constructor(categories) {

  }
  spend(category, amount) {

  }
  remaining(category) {

  }
  resetMonth() {

  }
}`,
  callTemplate:
`const __input = __INPUT__;
const b = new BudgetAllocator(__input.categories);
const results = [];
for (const op of __input.ops) {
  if (op.type === 'spend') results.push(b.spend(op.category, op.amount));
  else if (op.type === 'remaining') results.push(b.remaining(op.category));
  else if (op.type === 'resetMonth') results.push(b.resetMonth());
}
return results;`,
  tests: [
    {
      input: {
        categories: { groceries: 200, entertainment: 50 },
        ops: [
          { type: "spend", category: "groceries", amount: 150 },
          { type: "spend", category: "entertainment", amount: 60 },
          { type: "spend", category: "entertainment", amount: 50 },
          { type: "remaining", category: "groceries" },
        ],
      },
      expected: [50, false, 0, 50],
      hidden: false,
    },
    {
      input: {
        categories: { travel: 100 },
        ops: [
          { type: "spend", category: "travel", amount: 100 },
          { type: "resetMonth" },
          { type: "remaining", category: "travel" },
          { type: "remaining", category: "rent" },
        ],
      },
      expected: [0, true, 100, false],
      hidden: false,
    },
    {
      input: {
        categories: { x: 10 },
        ops: [
          { type: "spend", category: "x", amount: 0 },
          { type: "spend", category: "x", amount: -1 },
        ],
      },
      expected: [false, false],
      hidden: true,
    },
  ],
};

const p3_alt4 = {
  id: "p3-alt4",
  title: "Recurring Bill Scheduler",
  difficulty: "Medium",
  points: 30,
  reward: 7,
  entryName: "BillScheduler",
  prompt: `
    <p>Implement a class <code>BillScheduler</code> that pays a list of
    recurring bills against a single balance.</p>
    <pre>class BillScheduler {
  constructor(balance)
  addBill(name, amount)   // registers a bill; returns true if added, false
                           // if amount &lt;= 0 or a bill with that name already
                           // exists
  removeBill(name)         // returns true if removed, false if no bill by
                            // that name is registered
  payAll()                  // attempts to pay every registered bill, IN THE
                             // ORDER THEY WERE ADDED, deducting from the
                             // balance if affordable at that point, otherwise
                             // skipping it (balance unaffected by a skip).
                             // Returns { balance, paid, skipped } — the
                             // ending balance and the names paid/skipped, in
                             // the order they were processed.
}</pre>
  `,
  starterCode:
`class BillScheduler {
  constructor(balance) {

  }
  addBill(name, amount) {

  }
  removeBill(name) {

  }
  payAll() {

  }
}`,
  callTemplate:
`const __input = __INPUT__;
const s = new BillScheduler(__input.balance);
const results = [];
for (const op of __input.ops) {
  if (op.type === 'addBill') results.push(s.addBill(op.name, op.amount));
  else if (op.type === 'removeBill') results.push(s.removeBill(op.name));
  else if (op.type === 'payAll') results.push(s.payAll());
}
return results;`,
  tests: [
    {
      input: {
        balance: 100,
        ops: [
          { type: "addBill", name: "rent", amount: 60 },
          { type: "addBill", name: "rent", amount: 10 },
          { type: "addBill", name: "internet", amount: 30 },
          { type: "addBill", name: "phone", amount: 50 },
          { type: "removeBill", name: "cable" },
          { type: "payAll" },
        ],
      },
      expected: [true, false, true, true, false, { balance: 10, paid: ["rent", "internet"], skipped: ["phone"] }],
      hidden: false,
    },
    {
      input: {
        balance: 200,
        ops: [
          { type: "addBill", name: "rent", amount: 60 },
          { type: "removeBill", name: "rent" },
          { type: "payAll" },
        ],
      },
      expected: [true, true, { balance: 200, paid: [], skipped: [] }],
      hidden: false,
    },
    {
      input: {
        balance: 0,
        ops: [
          { type: "addBill", name: "a", amount: 5 },
          { type: "payAll" },
        ],
      },
      expected: [true, { balance: 0, paid: [], skipped: ["a"] }],
      hidden: true,
    },
  ],
};

const p4_alt2 = {
  id: "p4-alt2",
  title: "Wire Transfer Approval Workflow",
  difficulty: "Hard",
  points: 35,
  reward: 8,
  entryName: "runWireTransferMachine",
  prompt: `
    <p>Model a wire transfer's approval workflow and write
    <code>runWireTransferMachine(events)</code>, where <code>events</code>
    is an array of event name strings. Return an array with one result
    string per event.</p>
    <p><strong>States</strong> (start <code>DRAFTED</code>):
    <code>DRAFTED</code> → <code>PENDING_APPROVAL</code> →
    (<code>APPROVED</code> | <code>REJECTED</code>); <code>APPROVED</code>
    → <code>SENT</code>. <code>SENT</code>, <code>REJECTED</code>, and
    <code>CANCELLED</code> are terminal.</p>
    <ul>
      <li><code>"submit"</code> — valid only in <code>DRAFTED</code>; moves
      to <code>PENDING_APPROVAL</code>, emits <code>"PENDING_APPROVAL"</code>.
      Otherwise <code>"INVALID_ACTION"</code>.</li>
      <li><code>"approve"</code> — valid only in
      <code>PENDING_APPROVAL</code>; moves to <code>APPROVED</code>, emits
      <code>"APPROVED"</code>. Otherwise <code>"INVALID_ACTION"</code>.</li>
      <li><code>"reject"</code> — valid only in
      <code>PENDING_APPROVAL</code>; moves to <code>REJECTED</code>, emits
      <code>"REJECTED"</code>. Otherwise <code>"INVALID_ACTION"</code>.</li>
      <li><code>"send"</code> — valid only in <code>APPROVED</code>; moves to
      <code>SENT</code>, emits <code>"SENT"</code>. Otherwise
      <code>"INVALID_ACTION"</code>.</li>
      <li><code>"cancel"</code> — valid in <code>DRAFTED</code> or
      <code>PENDING_APPROVAL</code>; moves to <code>CANCELLED</code>, emits
      <code>"CANCELLED"</code>. Otherwise <code>"INVALID_ACTION"</code>.</li>
    </ul>
    <p>Once terminal, every subsequent event of any type emits
    <code>"WORKFLOW_CLOSED"</code> forever.</p>
  `,
  starterCode:
`function runWireTransferMachine(events) {
  // events: string[] — see the event list above
  // return an array of result strings, one per event

}`,
  callTemplate: "return runWireTransferMachine(__INPUT__);",
  tests: [
    { input: ["submit", "approve", "send"], expected: ["PENDING_APPROVAL", "APPROVED", "SENT"], hidden: false },
    {
      input: ["approve", "submit", "cancel", "submit"],
      expected: ["INVALID_ACTION", "PENDING_APPROVAL", "CANCELLED", "WORKFLOW_CLOSED"],
      hidden: false,
    },
    {
      input: ["submit", "reject", "approve", "send"],
      expected: ["PENDING_APPROVAL", "REJECTED", "WORKFLOW_CLOSED", "WORKFLOW_CLOSED"],
      hidden: true,
    },
  ],
};

const p4_alt3 = {
  id: "p4-alt3",
  title: "Fraud Hold Review State Machine",
  difficulty: "Hard",
  points: 35,
  reward: 8,
  entryName: "runFraudHoldMachine",
  prompt: `
    <p>Model an account's fraud-hold review flow and write
    <code>runFraudHoldMachine(events)</code>, where <code>events</code> is
    an array of event name strings. Return an array with one result string
    per event.</p>
    <p><strong>States</strong> (start <code>ACTIVE</code>):
    <code>ACTIVE</code> ⇄ <code>HOLD</code>; both can move to the terminal
    <code>CLOSED</code> state.</p>
    <ul>
      <li><code>"flag"</code> — valid only in <code>ACTIVE</code>; moves to
      <code>HOLD</code>, emits <code>"HOLD"</code>. Otherwise
      <code>"INVALID_ACTION"</code>.</li>
      <li><code>"clear"</code> — valid only in <code>HOLD</code>; moves to
      <code>ACTIVE</code>, emits <code>"ACTIVE"</code>. Otherwise
      <code>"INVALID_ACTION"</code>.</li>
      <li><code>"confirmFraud"</code> — valid only in <code>HOLD</code>;
      moves to <code>CLOSED</code>, emits <code>"CLOSED"</code>. Otherwise
      <code>"INVALID_ACTION"</code>.</li>
      <li><code>"closeAccount"</code> — valid in <code>ACTIVE</code> or
      <code>HOLD</code>; moves to <code>CLOSED</code>, emits
      <code>"CLOSED"</code>. Otherwise <code>"INVALID_ACTION"</code>.</li>
    </ul>
    <p>Once <code>CLOSED</code>, every subsequent event emits
    <code>"ACCOUNT_CLOSED"</code> forever.</p>
  `,
  starterCode:
`function runFraudHoldMachine(events) {
  // events: string[] — see the event list above
  // return an array of result strings, one per event

}`,
  callTemplate: "return runFraudHoldMachine(__INPUT__);",
  tests: [
    {
      input: ["flag", "clear", "flag", "confirmFraud", "clear"],
      expected: ["HOLD", "ACTIVE", "HOLD", "CLOSED", "ACCOUNT_CLOSED"],
      hidden: false,
    },
    { input: ["clear", "closeAccount", "flag"], expected: ["INVALID_ACTION", "CLOSED", "ACCOUNT_CLOSED"], hidden: false },
    {
      input: ["flag", "closeAccount", "confirmFraud"],
      expected: ["HOLD", "CLOSED", "ACCOUNT_CLOSED"],
      hidden: true,
    },
  ],
};

const p4_alt4 = {
  id: "p4-alt4",
  title: "Two-Factor Login State Machine",
  difficulty: "Hard",
  points: 35,
  reward: 8,
  entryName: "runLoginMachine",
  prompt: `
    <p>Model a password + 2FA login flow and write
    <code>runLoginMachine(correctPassword, correctCode, events)</code>,
    which returns an array with one result string per event.</p>
    <p><strong>States:</strong> <code>LOGGED_OUT</code> →
    <code>AWAITING_2FA</code> → <code>LOGGED_IN</code>, plus a permanent
    <code>LOCKED</code> state.</p>
    <ul>
      <li><code>{type:"enterPassword", password}</code> — valid only in
      <code>LOGGED_OUT</code>; otherwise emits
      <code>"ALREADY_IN_PROGRESS"</code>. If <code>password ===
      correctPassword</code>, move to <code>AWAITING_2FA</code> (reset the
      wrong-code counter) and emit <code>"AWAITING_2FA"</code>. Otherwise
      emit <code>"INVALID_PASSWORD"</code> and stay in
      <code>LOGGED_OUT</code>.</li>
      <li><code>{type:"enterCode", code}</code> — valid only in
      <code>AWAITING_2FA</code>; otherwise emits
      <code>"NO_2FA_PENDING"</code>. If <code>code === correctCode</code>,
      move to <code>LOGGED_IN</code> and emit <code>"LOGGED_IN"</code>.
      Otherwise increment the wrong-code counter; on the 3rd wrong code
      move to <code>LOCKED</code> and emit <code>"ACCOUNT_LOCKED"</code>,
      otherwise emit <code>"INVALID_CODE_ATTEMPTS_LEFT_&lt;n&gt;"</code>
      where <code>n</code> is attempts remaining before lock.</li>
    </ul>
    <p>Once <code>LOCKED</code>, every subsequent event emits
    <code>"ACCOUNT_LOCKED"</code> forever.</p>
  `,
  starterCode:
`function runLoginMachine(correctPassword, correctCode, events) {
  // return an array of result strings, one per event

}`,
  callTemplate: "return runLoginMachine(__INPUT__.correctPassword, __INPUT__.correctCode, __INPUT__.events);",
  tests: [
    {
      input: {
        correctPassword: "pw1",
        correctCode: "123456",
        events: [
          { type: "enterPassword", password: "wrong" },
          { type: "enterPassword", password: "pw1" },
          { type: "enterCode", code: "000000" },
          { type: "enterCode", code: "123456" },
        ],
      },
      expected: ["INVALID_PASSWORD", "AWAITING_2FA", "INVALID_CODE_ATTEMPTS_LEFT_2", "LOGGED_IN"],
      hidden: false,
    },
    {
      input: {
        correctPassword: "pw1",
        correctCode: "123456",
        events: [
          { type: "enterCode", code: "000000" },
          { type: "enterPassword", password: "pw1" },
          { type: "enterCode", code: "111111" },
          { type: "enterCode", code: "222222" },
          { type: "enterCode", code: "333333" },
          { type: "enterPassword", password: "pw1" },
        ],
      },
      expected: [
        "NO_2FA_PENDING",
        "AWAITING_2FA",
        "INVALID_CODE_ATTEMPTS_LEFT_2",
        "INVALID_CODE_ATTEMPTS_LEFT_1",
        "ACCOUNT_LOCKED",
        "ACCOUNT_LOCKED",
      ],
      hidden: false,
    },
    {
      input: {
        correctPassword: "pw1",
        correctCode: "123456",
        events: [
          { type: "enterPassword", password: "pw1" },
          { type: "enterPassword", password: "pw1" },
          { type: "enterCode", code: "123456" },
        ],
      },
      expected: ["AWAITING_2FA", "ALREADY_IN_PROGRESS", "LOGGED_IN"],
      hidden: true,
    },
  ],
};

window.PROBLEM_SLOTS = [
  [window.PROBLEMS[0], p1_alt, p1_alt2, p1_alt3, p1_alt4],
  [window.PROBLEMS[1], p2_alt, p2_alt2, p2_alt3, p2_alt4],
  [window.PROBLEMS[2], p3_alt, p3_alt2, p3_alt3, p3_alt4],
  [window.PROBLEMS[3], p4_alt, p4_alt2, p4_alt3, p4_alt4],
];

window.buildProblemSet = function () {
  const picked = window.PROBLEM_SLOTS.map((slot) => slot[Math.floor(Math.random() * slot.length)]);
  window.PROBLEMS.length = 0;
  window.PROBLEMS.push(...picked);
};
