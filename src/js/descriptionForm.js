import { UIComponentFactory } from './UIComponentFactory';
import { notify } from './helpers';
import { storageEntities, storageManager } from './storageService';

const taskDescriptionFormView = {
    root: UIComponentFactory.createTaskForm(),
    nameInput: UIComponentFactory.createTaskDescriptionNameInput(),
    textarea: UIComponentFactory.createTaskDescriptionTextarea(),
    submitButton: UIComponentFactory.createButton('primary', 'Создать', true, 'submit'),
    resetButton: UIComponentFactory.createButton('neutral', 'Сбросить'),
    _isMounted: false,

    appendChildren() {
        if (this._isMounted) return; //избегаю повторного монтирования
        this.root.append(this.nameInput);
        this.root.append(this.textarea);
        this.root.append(UIComponentFactory.createFormButtons(this.submitButton, this.resetButton));
        this._isMounted = true;
    },
    mount(containerSelector) {
        const container = document.querySelector(containerSelector);
        this.appendChildren();
        container.append(this.root);
    },
    unmount() {
        if (!this._isMounted) return;
        this.root.remove();
        this._isMounted = false;
    }
}

export const taskDescriptionFormController = {
    form: taskDescriptionFormView,
    formElement: taskDescriptionFormView.root,
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

    async bindEvents() {
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
    },
}