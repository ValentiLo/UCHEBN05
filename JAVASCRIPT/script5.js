var list = document.querySelector('.todo-list');
var items = list.querySelectorAll('.todo-list-item');

for (var i = 0; i < items.length; i++) {
  console.log(items[i]);  
}

// Получаем элементы
const form = document.querySelector('.add-form');
const input = document.querySelector('.add-form-input');
const todoList = document.querySelector('.todo-list');
const emptyMessage = document.querySelector('.empty-tasks');
const template = document.getElementById('task-template');

// Функция обновления сообщения о пустом списке
function updateEmptyMessage() {
    const items = document.querySelectorAll('.todo-list-item');
    if (items.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
    }
}

// Функция добавления новой задачи
function addTask(taskText) {
    // Клонируем шаблон
    const newTask = template.content.cloneNode(true);
    const taskItem = newTask.querySelector('.todo-list-item');
    const taskSpan = newTask.querySelector('span');
    const taskCheckbox = newTask.querySelector('.todo-list-input');
    
    // Заполняем текст задачи
    taskSpan.textContent = taskText;
    
    // Добавляем обработчик для удаления при нажатии на чекбокс (опционально)
    taskCheckbox.addEventListener('change', function() {
        if (this.checked) {
            taskItem.remove();
            updateEmptyMessage();
        }
    });
    
    // Добавляем задачу в список
    todoList.appendChild(taskItem);
    updateEmptyMessage();
}

// Обработчик отправки формы
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Отменяем отправку на сервер
    
    const taskText = input.value.trim();
    
    if (taskText !== '') {
        addTask(taskText);
        input.value = ''; // Очищаем поле ввода
        input.focus(); // Возвращаем фокус на поле
    }
});

// Добавляем обработчики для существующих задач (чтобы удалялись при нажатии)
document.querySelectorAll('.todo-list-item .todo-list-input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            this.closest('.todo-list-item').remove();
            updateEmptyMessage();
        }
    });
});

// Проверяем пустой список при загрузке
updateEmptyMessage();