import { UIComponentFactory } from './UIComponentFactory';
import { notify } from './helpers';

const taskDescriptionFormView = {
    root: UIComponentFactory.createTaskForm(),
    nameInput: UIComponentFactory.createTaskDescriptionNameInput(),
    textarea: UIComponentFactory.createTaskDescriptionTextarea(),
    submitButton: UIComponentFactory.createButton('primary', 'Создать', true, 'submit'),
    resetButton: UIComponentFactory.createButton('neutral', 'Сбросить'),
    _isMounted: false,

    mount(containerSelector) {
        const container = document.querySelector(containerSelector);
        this._appendChildren();
        container.append(this.root);
    },
    unmount() {
        if (!this._isMounted) return;
        this.root.remove();
        this._isMounted = false;
    },
    _appendChildren() {
        if (this._isMounted) return; //избегаю повторного монтирования
        this.root.append(this.nameInput);
        this.root.append(this.textarea);
        this.root.append(UIComponentFactory.createFormButtons(this.submitButton, this.resetButton));
        this._isMounted = true;
    },
}

export const taskDescriptionFormController = {
    form: taskDescriptionFormView,
    formElement: taskDescriptionFormView.root,

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
        this.formElement.reset();
        this.formElement.addEventListener('reset', () => {
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
     * Регистрирует обработчик отправки формы
     * @param {function(data: Object): void} callback
     */
    onSubmit(cb) {
        this.formElement.addEventListener('submit', evt => {
            evt.preventDefault();

            const formData = new FormData(this.formElement);
            const data = {};

            formData.forEach((val, key) => {
                data[key] = val
            });

            if (typeof callback === 'function') {
                callback(data);
            }

            this.formElement.reset();
        })
    },
    destroy() {
        this.form.unmount();
        this.form = null;
        this.formElement = null;
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