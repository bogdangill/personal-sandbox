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
        placeholder: 'e.g. Bubble sort',
        clearable: true,
    });
    const taskTextarea = Object.assign(document.createElement('sl-textarea'), {
        label: 'Описание задачи',
        resize: 'auto',
        helpText: 'p.s. описание можно оформить в формате markdown - тогда после сохранения оформленный текст будет выводиться обернутый html-тегами',
    });
    const submitButton = Object.assign(document.createElement('sl-button'), {
        variant: 'primary',
        type: 'submit',
        disabled: true
    });
    const resetButton = Object.assign(document.createElement('sl-button'), {
        variant: 'neutral',
    });

    submitButton.innerText = "Сохранить";
    resetButton.innerText = "Сбросить";

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('form-buttons');

    taskDescriptionForm.append(taskNameInput);
    taskDescriptionForm.append(taskTextarea);
    taskDescriptionForm.append(buttonWrapper);
    buttonWrapper.append(submitButton);
    buttonWrapper.append(resetButton);

    taskTextarea.addEventListener('sl-input', () => {
        submitButton.disabled = taskTextarea.value.length <= 0;
    });
    resetButton.addEventListener('click', () => {
        taskNameInput.value = '';
        taskTextarea.value = '';
        submitButton.disabled = true;
    });

    function validateForm() {
        if (!taskTextarea.value.trim()) {
            notify('Отсутствует текст описания задачи!');
        } else if (taskTextarea.value.length <= 10) {
            notify('Текст описания должен быть больше 10 символов');
        } else {
            notify('Описание успешно сохранено!', 'success', 'check-square', Infinity);
        }
    }
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

    taskDescriptionForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        validateForm();
    });
}