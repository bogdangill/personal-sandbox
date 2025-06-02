import { UIComponentFactory } from './UIComponentFactory';
import { notify } from './helpers';

const taskSolutionFormView = {
    root: UIComponentFactory.createTaskForm(),
    textarea: UIComponentFactory.createTaskSolutionTextarea(),
    executeButton: UIComponentFactory.createButton('warning', 'Выполнить'),
    saveButton: UIComponentFactory.createButton('success', 'Сохранить', true),
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
        this.root.append(this.textarea);
        this.root.append(UIComponentFactory.createFormButtons(this.executeButton, this.saveButton));
        this._isMounted = true;
    },
}

export const taskSolutionFormController = {
    form: taskSolutionFormView,
    formElement: taskSolutionFormView.root,

    init(selector) {
        this.form.mount(selector);
        this.bindEvents();
    },
    /**
     * Отключает кнопку сохранения, если поле с решением пустое.
     */
    disableSubmitButton() {
        this.form.textarea.addEventListener('input', () => {
            this.form.saveButton.disabled = this.form.textarea.value.trim().length <= 0;
        })
    },
    execute() {
        this.form.executeButton.addEventListener('click', () => {
            //будет запускаться анализ кода решения и выводиться результат выполнения console.log или alert();
            notify('Код выполнился, результат выполнения', 'neutral');
        });
    },
    onSave(cb) {
        this.form.saveButton.addEventListener('click', () => {
            const data = this.form.textarea.value;
            cb(data);
        });
        //вынеси в tasks.js
            
        // const descriptionFormData = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);
        // const currentTaskData = createTaskData(descriptionFormData.title, descriptionFormData.description, this.form.textarea.value);

        // storageManager.set(storageEntities.CURRENT_TASK_DATA, currentTaskData);

        // setTimeout(() => notify('Задача сохранена и добавлена в коллекцию!', 'success', 'check-square'), 500);

    },
    destroy() {
        this.form.unmount();
        this.form = null;
        this.formElement = null;
    },

    async bindEvents() {
        await Promise.all([
            customElements.whenDefined('sl-button')
        ]).then(() => {
            this.disableSubmitButton();
            this.execute();
        });
    }
}