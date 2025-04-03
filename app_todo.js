//variables
let task = { id: 0, task_text: "", task_points: 0 };
let num_tasks = 0;
let num_points = 0;
let taskArr = [];
let checked = false;
const priorityPoints = {
  big: 10,
  medium: 5,
  small: 1,
};

//cached element references
const inputField = document.getElementById("task-input");
const pendingNum = document.getElementById("num_tasks");
const pointsNum = document.getElementById("total-points");

const todoList = document.getElementById("to-do-list");
const addTaskBtn = document.getElementById("add-task-button");
const clearAllBtn = document.getElementById("clear-all-button");

//functions
function addTask(e) {
  e.preventDefault();

  const taskText = inputField.value.trim();

  if (!taskText) return;

  const taskId = Date.now();
  const taskSize = document.querySelector(
    'input[name="priority"]:checked'
  ).value;

  const task = {
    id: taskId,
    task_text: taskText,
    task_points: priorityPoints[taskSize],
  };
  taskArr.push(task);
  num_tasks++;
  render();
}

function updatePointsAndStatus(checkboxEl) {
  const isChecked = checkboxEl.checked;

  const taskRow = checkboxEl.closest("li");
  const taskPoints = Number(taskRow.dataset.points);
  const taskId = Number(taskRow.dataset.id);
  const taskText = taskRow.dataset.task;

  if (isChecked) {
    num_tasks -= 1;
    num_points += taskPoints;
    const index = taskArr.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      taskArr.splice(index, 1);
    }
  } else {
    num_tasks += 1;
    num_points -= taskPoints;
    taskArr.push({ id: taskId, task_text: taskText, task_points: taskPoints });
  }

  pendingNum.textContent = num_tasks;
  pointsNum.textContent = num_points;
}

function deleteTask(trashEl) {
  const taskRow = trashEl.closest("li");
  const taskId = Number(taskRow.dataset.id);

  const index = taskArr.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    taskArr.splice(index, 1);
    num_tasks--;
  }

  render();
}

function clearAllTasks(e) {
  task = { task_text: "", task_points: 0 };
  num_tasks = 0;
  taskArr = [];
  todoList.innerHTML = "";
}

function init() {
  // Reset counters
  num_tasks = 0;
  num_points = 0;
  taskArr = [];

  // Initial render
  render();
}

function render() {
  // Clear existing content
  todoList.innerHTML = "";

  if (taskArr.length > 0) {
    const header = document.createElement("h2");
    header.textContent = "Consolidated Task List";
    todoList.appendChild(header);
  }

  taskArr.forEach((task) => {
    const infoRow = document.createElement("li");
    infoRow.className = "list";
    infoRow.dataset.id = task.id;
    infoRow.dataset.points = task.task_points;
    infoRow.dataset.task = task.task_text;

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("complete-task");

    const taskTextSpan = document.createElement("span");
    taskTextSpan.className = "task";
    taskTextSpan.innerText = task.task_text;

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("trash-icon", "uil", "uil-trash");

    infoRow.append(checkBox, taskTextSpan, trashIcon);
    todoList.appendChild(infoRow);
  });

  // Update counters
  pendingNum.textContent = num_tasks;
  pointsNum.textContent = num_points;
}

//event listeners
addTaskBtn.addEventListener("click", addTask);

todoList.addEventListener("click", function (e) {
  if (e.target.classList.contains("trash-icon")) {
    deleteTask(e.target);
  }

  if (e.target.classList.contains("complete-task")) {
    updatePointsAndStatus(e.target);
  }
});

clearAllBtn.addEventListener("click", clearAllTasks);

// put it all in action
init();
