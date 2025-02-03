document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const input = document.getElementById('task');
  const list = document.getElementById('list');

  let tasks = [];

  // Fetch tasks from the backend and display them
  const fetchTasks = async () => {
    const response = await fetch('http://localhost:3000/tasks');
    const data = await response.json();
    tasks = data;
    renderTasks();
  };

  // Add a task
  const addTask = async (task) => {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task })
    });

    if (response.ok) {
      const newTask = await response.json();
      tasks.push(newTask);
      renderTasks();
    } else {
      alert('Error adding task');
    }
  };

  // Edit task
  const editTask = (index) => {
    const li = list.children[index];
    const taskSpan = li.querySelector('span');
    const editButton = li.querySelector('button.edit');
    const saveButton = li.querySelector('button.save');

    taskSpan.contentEditable = true;
    taskSpan.focus();
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
  };

  // Save task
  const saveTask = async (index) => {
    const li = list.children[index];
    const taskSpan = li.querySelector('span');
    const editButton = li.querySelector('button.edit');
    const saveButton = li.querySelector('button.save');

    taskSpan.contentEditable = false;
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';

    const taskId = tasks[index]._id;
    const updatedTask = taskSpan.innerText;

    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: updatedTask })
    });

    if (response.ok) {
      tasks[index].task = updatedTask;
    } else {
      alert('Error saving task');
    }
  };

  // Delete task
  const deleteTask = async (index) => {
    const taskId = tasks[index]._id;
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      tasks.splice(index, 1);
      renderTasks();
    } else {
      alert('Error deleting task');
    }
  };

  // Toggle completion (strike through) and update database
function toggleCompletion(index) {
  const task = tasks[index];
  task.completed = !task.completed; // Toggle completion state
  
  // Update the task in the database
  fetch(`/tasks/${task._id}/toggle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completed: task.completed })
  })
  .then(response => response.json())
  .then(updatedTask => {
    // Update task locally
    tasks[index] = updatedTask;
    renderTasks();  // Re-render tasks to reflect the changes
  })
  .catch(error => console.error('Error:', error));
}


  // Render tasks to the UI
const renderTasks = () => {
  list.innerHTML = '';
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.innerText = task.task;

    // If the task is marked as completed, apply the 'completed' class
    if (task.completed) {
      span.style.textDecoration = 'line-through';  // Apply strike-through if completed
    } else {
      span.style.textDecoration = 'none';  // Remove strike-through if not completed
    }

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = () => editTask(i);

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.className = 'save';
    saveButton.onclick = () => saveTask(i);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => deleteTask(i);

    // Pass the index to toggleCompletion function
    span.onclick = () => toggleCompletion(i);

    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(saveButton);
    li.appendChild(deleteButton);
    list.appendChild(li);
  }
};




  // Handle form submit
  form.onsubmit = (event) => {
    event.preventDefault();
    const task = input.value.trim();
    if (task !== '') {
      addTask(task);
      input.value = '';
    }
  };

  // Initial fetch of tasks
  fetchTasks();
});
