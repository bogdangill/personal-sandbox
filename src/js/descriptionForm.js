import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/textarea/textarea';
import '@shoelace-style/shoelace/dist/components/button/button';
import { notify } from './helpers';
import { storageEntities, storageManager } from './storage';

//фабрика элементов формы из компонентов Shoelace
function createTaskNameInput() {
    return Object.assign(document.createElement('sl-input'), {
        label: 'Название задачи',
        name: 'title',
        placeholder: 'e.g. Bubble sort',
        clearable: true,
        autocomplete: 'off'
    });
}
function createTaskTextarea() {
    return Object.assign(document.createElement('sl-textarea'), {
        label: 'Описание задачи',
        name: 'description',
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
        type: 'reset'
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

//объект-конструктор формы (что-то вроде базового класса)
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

//объект-контроллер формы (что-то вроде расширяемого класса типа class ... extends BaseClass)
const taskDescriptionFormManager = {
    form: taskDescriptionForm,
    formElement: taskDescriptionForm.root,

    /**
     * Отключает кнопку отправки, если текстовое поле пустое.
     * @listens sl-input
     */
    disableSubmitButton() {
        this.form.textarea.addEventListener('sl-input', () => {
            this.form.submitButton.disabled = this.form.textarea.value.trim().length <= 0;
        })
    },
    /**
     * Очищает поля формы и отключает кнопку отправки.
     * @listens HTMLFormElement
     */
    reset() {
        this.formElement.addEventListener('reset', evt => {
            this.formElement.reset();
            this.form.submitButton.disabled = true;
        })
    },
    validate() {
        this.formElement.addEventListener('sl-invalid', evt => {
            evt.preventDefault();
            notify(`Ошибка: ${evt.target.validationMessage}`);
            evt.target.focus();
        },{ capture: true })
    },
    /**
     * Вместо стандартной отправки данных формы отправляет formData в sessionStorage в ключ "description-form-data"
     * @listens HTMLFormElement
     */
    submit() {
        this.formElement.addEventListener('submit', evt => {
            evt.preventDefault();

            const formData = new FormData(this.formElement);
            const data = {};

            formData.forEach((val, key) => {
                data[key] = val
            });

            storageManager.set(storageEntities.DESCRIPTION_FORM_DATA, data);
            this.formElement.reset();

            setTimeout(() => notify('Описание успешно сохранено!', 'success', 'check-square'), 500);
        })
    },

    async bindMethods() {
        await Promise.all([
            customElements.whenDefined('sl-input'),
            customElements.whenDefined('sl-textarea'),
            customElements.whenDefined('sl-button')
        ]).then(() => {
            this.disableSubmitButton();
            this.validate();
            this.submit();
            this.reset();
        });
    }
}

export function renderTaskDescriptionForm() {
    const taskDescription = document.getElementById('task-description');

    const form = taskDescriptionForm;
    form.appendChildren();
    taskDescription.append(form.root);

    const formController = taskDescriptionFormManager;
    formController.bindMethods();
}