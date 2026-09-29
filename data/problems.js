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

window.PROBLEM_SLOTS = [
  [window.PROBLEMS[0], p1_alt],
  [window.PROBLEMS[1], p2_alt],
  [window.PROBLEMS[2], p3_alt],
  [window.PROBLEMS[3], p4_alt],
];

window.buildProblemSet = function () {
  const picked = window.PROBLEM_SLOTS.map((slot) => slot[Math.floor(Math.random() * slot.length)]);
  window.PROBLEMS.length = 0;
  window.PROBLEMS.push(...picked);
};
