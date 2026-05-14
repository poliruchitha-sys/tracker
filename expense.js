function ExpenseTrackerApp() {
  const { useState, useEffect, useRef, useMemo, useCallback } = React;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const titleRef = useRef(null);

  // Focus on title field when app loads
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Fetch mock data from API
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );
        const data = await response.json();

        const formattedExpenses = data.map((item, index) => ({
          id: item.id,
          title: item.title.substring(0, 15),
          amount: (index + 1) * 100,
          category: ["Food", "Travel", "Shopping", "Bills", "Other"][
            index % 5
          ],
        }));

        setExpenses(formattedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  // Add Expense
  const addExpense = useCallback(
    (e) => {
      e.preventDefault();

      if (!title || !amount) {
        alert("Please fill all fields");
        return;
      }

      const newExpense = {
        id: Date.now(),
        title,
        amount: Number(amount),
        category,
      };

      setExpenses((prev) => [...prev, newExpense]);
      setTitle("");
      setAmount("");
      setCategory("Food");

      titleRef.current.focus();
    },
    [title, amount, category]
  );

  // Delete Expense
  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) =>
      expense.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [expenses, search]);

  // Total Amount
  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }, [filteredExpenses]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Expense Tracker
        </h1>

        {/* Form */}
        <form
          onSubmit={addExpense}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <input
            ref={titleRef}
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold transition"
          >
            Add Expense
          </button>
        </form>

        {/* Search */}
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Total */}
        <div className="bg-green-100 text-green-700 p-4 rounded-2xl mb-6 text-lg font-semibold text-center">
          Total Expense: ₹{totalExpense}
        </div>

        {/* Expense List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500">No expenses found.</p>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex flex-col md:flex-row justify-between items-center bg-gray-50 border rounded-2xl p-4 shadow-sm"
              >
                <div>
                  <h2 className="font-semibold text-lg">{expense.title}</h2>
                  <p className="text-gray-500">{expense.category}</p>
                </div>

                <div className="flex items-center gap-4 mt-3 md:mt-0">
                  <span className="font-bold text-blue-600 text-lg">
                    ₹{expense.amount}
                  </span>

                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hooks Used */}
        <div className="mt-8 bg-gray-100 p-4 rounded-2xl text-sm text-gray-700">
          <h2 className="font-bold mb-2">React Hooks Used</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>useState</strong> → Manage form inputs and expenses.
            </li>
            <li>
              <strong>useEffect</strong> → Fetch mock API data.
            </li>
            <li>
              <strong>useRef</strong> → Focus title input field.
            </li>
            <li>
              <strong>useMemo</strong> → Optimize total and filtered expenses.
            </li>
            <li>
              <strong>useCallback</strong> → Prevent unnecessary function recreation.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}