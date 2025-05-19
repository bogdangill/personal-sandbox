import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/textarea/textarea';
import '@shoelace-style/shoelace/dist/components/button/button';

function Task(id, name, text, code = null, startDate, endDate = startDate, importance = null) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.code = code;
    this.startDate = startDate;
    this.endDate = endDate;
    this.importance = importance;
}

const currentTask = {};
const tasksData = [];

export function renderTaskDescriptionForm() {
    const taskDescription = document.getElementById('task-description');
    taskDescription.innerHTML = `
        <form id="task-description-form">
        </form>
    `;
    const taskDescriptionForm = document.getElementById('task-description-form');
    
    const taskNameInput = Object.assign(document.createElement('sl-input'), {
        label: 'Название задачи',
        placeholder: 'e.g. Bubble sort', //можно каждый раз генерировать рандомное название задачи с помощью Faker.js
        clearable: true,
    });
    const taskTextarea = Object.assign(document.createElement('sl-textarea'), {
        label: 'Описание задачи',
        resize: 'auto',
        helpText: 'p.s. описание можно оформить в формате markdown - тогда после сохранения оформленный текст будет выводиться обернутый html-тегами',
    });
    const submitButton = Object.assign(document.createElement('sl-button'), {
        variant: 'success',
        type: 'submit',
        disabled: true,
    });
    submitButton.innerText = "Сохранить";
    submitButton.style = "width: 100%";

    taskDescriptionForm.append(taskNameInput);
    taskDescriptionForm.append(taskTextarea);
    taskDescriptionForm.append(submitButton);
}