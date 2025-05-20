import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/textarea/textarea';
import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/alert/alert';
import '@shoelace-style/shoelace/dist/components/icon/icon';

function Task(id, name, text, code = null, startDate, endDate = startDate, importance = null) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.code = code;
    this.startDate = startDate;
    this.endDate = endDate;
    this.importance = importance;
}

let currentTask = {};
const tasksData = JSON.parse(localStorage.getItem('data')) || [];

//helpers
function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}
function notify(message, variant = 'warning', icon = 'exclamation-triangle', duration = 3000) {
    const formAlert = Object.assign(document.createElement('sl-alert'), {
        duration: duration,
        closable: true,
        countdown: 'rtl',
        variant: variant,
        innerHTML: `
            <sl-icon name="${icon}" slot="icon"></sl-icon>
            ${escapeHtml(message)}
        `
    });

    document.body.append(formAlert);
    return formAlert.toast();
}

//фабрика элементов формы из компонентов Shoelace
function createTaskNameInput() {
    return Object.assign(document.createElement('sl-input'), {
        label: 'Название задачи',
        placeholder: 'e.g. Bubble sort',
        clearable: true,
        autocomplete: 'off'
    });
}
function createTaskTextarea() {
    return Object.assign(document.createElement('sl-textarea'), {
        label: 'Описание задачи',
        resize: 'auto',
        helpText: 'p.s. описание можно оформить в формате markdown - тогда после сохранения оформленный текст будет выводиться обернутый html-тегами',
        minlength: 10
    });
}
function createSubmitButton() {
    const submitButton = Object.assign(document.createElement('sl-button'), {
        variant: 'primary',
        type: 'submit',
        disabled: true
    });
    submitButton.innerText = "Сохранить";

    return submitButton;
}
function createResetButton() {
    const resetButton = Object.assign(document.createElement('sl-button'), {
        variant: 'neutral',
    });
    resetButton.innerText = "Сбросить";

    return resetButton;
}
function createFormButtons(...buttons) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('form-buttons');
    buttonWrapper.append(...buttons);

    return buttonWrapper;
}
function createTaskDescriptionForm() {
    const taskDescriptionForm = document.createElement('form');
    taskDescriptionForm.setAttribute('id', 'task-description-form');

    return taskDescriptionForm;
}

const taskDescriptionForm = {
    root: createTaskDescriptionForm(),
    nameInput: createTaskNameInput(),
    textarea: createTaskTextarea(),
    submitButton: createSubmitButton(),
    resetButton: createResetButton(),
    
    appendChildren() {
        this.root.append(this.nameInput);
        this.root.append(this.textarea);
        this.root.append(createFormButtons(this.submitButton, this.resetButton));
    }
}

const FormManager = {
    form: taskDescriptionForm,

    clearInputs() {
        this.form.nameInput.value = '';
        this.form.textarea.value = '';
    },
    async disableSubmitButton() {
        await Promise.all([
            customElements.whenDefined('sl-textarea'),
            customElements.whenDefined('sl-button')
        ]).then(() => {
            this.form.textarea.addEventListener('sl-input', () => {
                this.form.submitButton.disabled = this.form.textarea.value.length <= 0;
            })
        });
    },
    async reset() {
        await Promise.all([
            customElements.whenDefined('sl-input'),
            customElements.whenDefined('sl-textarea'),
            customElements.whenDefined('sl-button')
        ]).then(() => {
            this.form.addEventListener('reset', () => {
                this.clearInputs();
                this.form.submitButton.disabled = true;
            })
        });
    },
    async validate() {
        await Promise(customElements.whenDefined('sl-textarea'))
            .then(() => {
                this.form.addEventListener('sl-invalid', evt => {
                    evt.preventDefault();
                    notify(`Ошибка: ${evt.target.validationMessage}`);
                    evt.target.focus();
                },{ capture: true })
            });
    },
    async submit() {
        await Promise.all([
            customElements.whenDefined('sl-input'),
            customElements.whenDefined('sl-textarea'),
            customElements.whenDefined('sl-button')
        ]).then(() => {
            this.form.addEventListener('submit', evt => {
                evt.preventDefault();
                //здесь должен быть метод из объекта TaskDataManager(или хз как его назвать пока) который будет добавлять данные задачи из формы в конструктор и отправлять в LS
                this.clearInputs();
                this.form.submitButton.disabled = true;
                setTimeout(() => notify('Описание успешно сохранено!', 'success', 'check-square'), 500);
            })
        });
    }
}

export function renderTaskDescriptionForm() {
    const taskDescription = document.getElementById('task-description');
    const form = taskDescriptionForm;
    form.appendChildren();
    taskDescription.append(form.root);

    function createTaskDescription(name, text) {
        const date = new Date();
        const id = Date.now();
        const 
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes();
        const creationDate = `${day}.${month}.${year} ${hours}:${minutes}`;

        return new Task(id, name, text, null, creationDate);
    }
    function validateForm() {
        if (!taskTextarea.value.trim()) {
            notify('Отсутствует текст описания задачи!');
        } else if (taskTextarea.value.length <= 10) {
            notify('Текст описания должен быть больше 10 символов');
        } else {
            return true;
        }
    }

    taskDescriptionForm.addEventListener('submit', (evt) => {
        evt.preventDefault();

        if (validateForm()) {
            currentTask = createTaskDescription(taskNameInput.value, taskTextarea.value);
            tasksData.push(currentTask);
            localStorage.setItem('data', JSON.stringify(tasksData));
            notify('Описание успешно сохранено!', 'success', 'check-square');
            clearFormInputs();
        }
    });
}