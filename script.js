document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const totalTasksEl = document.getElementById("totalTasks");
  const completedTasksEl = document.getElementById("completedTasks");
  const remainingTasksEl = document.getElementById("remainingTasks");

  // State
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let currentFilter = "all";

  // Initialize
  renderTodos();
  updateStats();

  // Event Listeners
  todoForm.addEventListener("submit", addTodo);
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => filterTodos(btn.dataset.filter));
  });

  // Functions
  function addTodo(e) {
    e.preventDefault();
    const todoText = todoInput.value.trim();

    if (todoText === "") {
      alert("Please enter a task!");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    updateStats();

    todoInput.value = "";
    todoInput.focus();
  }

  function renderTodos() {
    todoList.innerHTML = "";

    if (todos.length === 0) {
      todoList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-tasks"></i>
                            <p>No tasks yet! Add one above.</p>
                        </div>
                    `;
      return;
    }

    let filteredTodos = todos;

    if (currentFilter === "active") {
      filteredTodos = todos.filter((todo) => !todo.completed);
    } else if (currentFilter === "completed") {
      filteredTodos = todos.filter((todo) => todo.completed);
    }

    filteredTodos.forEach((todo) => {
      const todoItem = document.createElement("li");
      todoItem.className = `todo-item ${todo.completed ? "completed" : ""}`;
      todoItem.dataset.id = todo.id;

      todoItem.innerHTML = `
                        <input type="checkbox" class="todo-checkbox" ${
                          todo.completed ? "checked" : ""
                        }>
                        <span class="todo-text">${todo.text}</span>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    `;

      todoList.appendChild(todoItem);

      // Add event listeners to new elements
      const checkbox = todoItem.querySelector(".todo-checkbox");
      const deleteBtn = todoItem.querySelector(".delete-btn");

      checkbox.addEventListener("change", () => toggleComplete(todo.id));
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
    });
  }

  function toggleComplete(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    updateStats();
  }

  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
  }

  function filterTodos(filter) {
    currentFilter = filter;

    // Update active button
    filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    renderTodos();
  }

  function updateStats() {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const remaining = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    remainingTasksEl.textContent = remaining;
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
});
