import { UIComponentFactory } from './UIComponentFactory';
import { notify } from './helpers';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from 'codemirror';
import { customTheme, defineEditorTheme } from './theme';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';

export const taskSolutionFormView = {
    root: UIComponentFactory.createTaskForm(),
    editor: null,
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
        this.root.append(UIComponentFactory.createFormButtons(this.executeButton, this.saveButton));
        this._isMounted = true;
    },
}

export const taskSolutionFormController = {
    form: taskSolutionFormView,
    formElement: taskSolutionFormView.root,

    init(selector) {
        let state = EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                customTheme.of(defineEditorTheme(false)),
                oneDark
            ]
        });
        this.form.editor = new EditorView({
            state,
            parent: taskSolutionFormView.root,
        });
        this.form.mount(selector);
        this.bindEvents();
    },
    /**
     * Отключает кнопку сохранения, если поле с решением пустое.
     */
    disableSubmitButton() {
        // this.form.textarea.addEventListener('input', () => {
        //     this.form.saveButton.disabled = this.form.textarea.value.trim().length <= 0;
        // })
    },
    execute() {
        this.form.executeButton.addEventListener('click', () => {
            //будет запускаться анализ кода решения и выводиться результат выполнения console.log или alert();
            notify('Код выполнился, результат выполнения', 'neutral');
        });
    },
    onSave(cb) {
        this.form.saveButton.addEventListener('click', () => {
            // const data = this.form.textarea.value;
            // cb(data);
        });
    },
    destroy() {
        this.form.unmount();
        this.form.editor.destroy();
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