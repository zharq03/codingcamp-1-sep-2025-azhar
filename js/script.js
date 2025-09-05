/// Variables to store todo items
let todoList = [];

/// Function to update real-time clock and date
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateClock, 1000);
updateClock(); // Initial call

/// Function to validate input fields
function validateInput() {
    const todoInput = document.getElementById('todo-input').value.trim();
    const todoDateInput = document.getElementById('todo-date-input').value;

    if (todoInput === '' || todoDateInput === '') {
        alert('Please fill in both the task and due date.');
        return;
    }
    addTodo(todoInput, todoDateInput);
    document.getElementById('todo-input').value = '';
    document.getElementById('todo-date-input').value = '';
}

function addTodo(todo, dueDate) {
    // Add a new todo item with status based on date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // Normalize to midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let status;
    if (due < today) status = 'done';
    else if (due >= tomorrow) status = 'pending';
    else status = 'active';

    const todoItem = {
        task: todo,
        dueDate: dueDate,
        completed: status === 'done',
        active: status === 'active'
    };

    /// Push the new item to the todo list array
    todoList.push(todoItem);

    /// Re-render the todo list
    renderTodoList();
}

function deleteAllTodo() {
    // Clear the todo list array
    todoList = [];

    /// Re-render the todo list
    renderTodoList();
}

function filterTodo() {
    const filterValue = document.getElementById('filter-select').value;
    let filteredList = [...todoList];

    if (filterValue === 'pending') {
        filteredList = todoList.filter(item => !item.completed && !item.active);
    } else if (filterValue === 'active') {
        filteredList = todoList.filter(item => item.active);
    } else if (filterValue === 'done') {
        filteredList = todoList.filter(item => item.completed);
    }

    renderFilteredList(filteredList);
}

function renderTodoList() {
    const todoListContainer = document.getElementById('todo-list');
    todoListContainer.innerHTML = '';

    if (todoList.length === 0) {
        todoListContainer.innerHTML = '<li class="text-[#C4DFE6]">No tasks found</li>';
    } else {
        todoList.forEach((item, index) => {
            todoListContainer.innerHTML += `
                <li class="flex justify-between items-center py-2">
                    <span>${item.task}</span>
                    <span>${item.dueDate}</span>
                    <span>${item.completed ? 'Done' : item.active ? 'Active' : 'Pending'}</span>
                    <button class="text-red-500" onclick="deleteTodo(${index})">Delete</button>
                </li>
            `;
        });
    }
}

function renderFilteredList(filteredList) {
    const todoListContainer = document.getElementById('todo-list');
    todoListContainer.innerHTML = '';

    if (filteredList.length === 0) {
        todoListContainer.innerHTML = '<li class="text-[#C4DFE6]">No tasks match the filter</li>';
    } else {
        filteredList.forEach((item, index) => {
            todoListContainer.innerHTML += `
                <li class="flex justify-between items-center py-2">
                    <span>${item.task}</span>
                    <span>${item.dueDate}</span>
                    <span>${item.completed ? 'Done' : item.active ? 'Active' : 'Pending'}</span>
                    <button class="text-red-500" onclick="deleteTodo(${todoList.indexOf(item)})">Delete</button>
                </li>
            `;
        });
    }
}

function deleteTodo(index) {
    todoList.splice(index, 1);
    renderTodoList();
}