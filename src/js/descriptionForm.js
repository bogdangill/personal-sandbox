import { UIComponentFactory } from './UIComponentFactory';
import { ComponentView } from './ComponentView';
import { notify } from './helpers';

const createTaskDescriptionForm = () => {
    const root = UIComponentFactory.createTaskForm();
    const nameInput = UIComponentFactory.createTaskDescriptionNameInput();
    const textarea = UIComponentFactory.createTaskDescriptionTextarea();
    const submitButton = UIComponentFactory.createButton('primary', 'Создать', true, 'submit');
    const resetButton = UIComponentFactory.createButton('neutral', 'Сбросить', false, 'reset');
    const formButtons = UIComponentFactory.createFormButtons(submitButton, resetButton);
    const view = new ComponentView(root, nameInput, textarea, formButtons);

    Object.assign(view, {
        input: nameInput,
        textarea: textarea,
        submitButton: submitButton,
        resetButton: resetButton
    });

    return view;
}

export const taskDescriptionFormController = {
    form: createTaskDescriptionForm(),

    init(selector) {
        this.form.mount(selector);
        this.bindEvents();
    },
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
        this.form.root.reset();
        this.form.root.addEventListener('reset', () => {
            this.form.submitButton.disabled = true;
        })
    },
    validate() {
        this.form.root.addEventListener('sl-invalid', evt => {
            evt.preventDefault();
            notify(`Ошибка: ${evt.target.validationMessage}`);
            evt.target.focus();
        },{ capture: true })
    },
    /**
     * Регистрирует обработчик отправки формы
     * @param {function(data: Object): void} callback
     */
    onSubmit(cb) {
        this.form.root.addEventListener('submit', evt => {
            evt.preventDefault();

            const formData = new FormData(this.form.root);
            const data = {};

            formData.forEach((val, key) => {
                data[key] = val
            });

            if (typeof cb === 'function') {
                cb(data);
            }
        })
    },
    destroy() {
        this.form.unmount();
    },

    async bindEvents() {
        await Promise.all([
            customElements.whenDefined('sl-input'),
            customElements.whenDefined('sl-textarea'),
            customElements.whenDefined('sl-button')
        ]).then(() => {
            this.disableSubmitButton();
            this.validate();
            this.reset();
        });
    },
}