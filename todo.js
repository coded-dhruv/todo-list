document.addEventListener('DOMContentLoaded', () => {
            const addTaskForm = document.getElementById('add-task-form');
            const taskInputField = document.getElementById('task-input-field');
            const taskList = document.getElementById('task-list');
            const taskCounter = document.getElementById('task-counter');
            const filterButtons = document.getElementById('filter-buttons');
            const dateDisplay = document.getElementById('date-display');
            const themeToggleButton = document.getElementById('theme-toggle-btn');
            const themeIcon = document.getElementById('theme-icon');
            const body = document.body;

            const sunIconPath = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 6a6 6 0 100 12 6 6 0 000-12z";
            const moonIconPath = "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z";

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let currentFilter = 'all';

            const applyTheme = (theme) => {
                if (theme === 'light') {
                    body.classList.add('light-theme');
                    themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="${moonIconPath}"></path>`;
                } else {
                    body.classList.remove('light-theme');
                    themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="${sunIconPath}"></path>`;
                }
                localStorage.setItem('theme', theme);
            };

            themeToggleButton.addEventListener('click', () => {
                const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
                applyTheme(newTheme);
            });

            const saveTasks = () => {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            };

            const renderTasks = () => {
                taskList.innerHTML = '';
                const filteredTasks = tasks.filter(task => {
                    if (currentFilter === 'active') return !task.completed;
                    if (currentFilter === 'completed') return task.completed;
                    return true;
                });
                
                if (filteredTasks.length === 0) {
                    taskList.innerHTML = `<li class="empty-list-message p-4">No tasks here. Great job!</li>`;
                } else {
                    filteredTasks.forEach(task => {
                        const taskElement = document.createElement('li');
                        taskElement.dataset.id = task.id;
                        taskElement.className = `task-item flex items-center justify-between py-4 px-2`;
                        if (task.completed) {
                            taskElement.classList.add('completed');
                        }
                        
                        taskElement.innerHTML = `
                            <div class="flex items-center gap-4">
                                <button class="toggle-task-btn flex-shrink-0 w-6 h-6 rounded-full transition-all flex items-center justify-center">
                                    ${task.completed ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
                                </button>
                                <p class="text-lg">${task.text}</p>
                            </div>
                            <button class="delete-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        `;
                        taskList.appendChild(taskElement);
                    });
                }
                updateTaskCounter();
            };
            
            const updateTaskCounter = () => {
                const activeTasks = tasks.filter(task => !task.completed).length;
                taskCounter.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
            };

            const addTask = (text) => {
                if(text.trim() === '') return;
                const newTask = {
                    id: Date.now(),
                    text: text,
                    completed: false
                };
                tasks.unshift(newTask);
                saveTasks();
                renderTasks();
            };

            const toggleTask = (id) => {
                const task = tasks.find(task => task.id === id);
                if (task) {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks();
                }
            };
            
            const deleteTask = (id) => {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
            };

            addTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addTask(taskInputField.value);
                taskInputField.value = '';
            });

            taskList.addEventListener('click', (e) => {
                if (e.target.closest('.toggle-task-btn')) {
                    const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                    toggleTask(taskId);
                }
                if (e.target.closest('.delete-btn')) {
                    const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                    deleteTask(taskId);
                }
            });
            
            filterButtons.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    currentFilter = e.target.dataset.filter;
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    renderTasks();
                }
            });

            const setDate = () => {
                const today = new Date();
                dateDisplay.textContent = today.toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric'
                });
            };
            
            const initializeApp = () => {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                applyTheme(savedTheme);
                setDate();
                renderTasks();
            }

            initializeApp();
        });