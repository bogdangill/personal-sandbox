import { UIComponentFactory } from './UIComponentFactory';
import { notify } from './helpers';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { themeService } from './themeService';
import { tomorrow } from 'thememirror';
import { eventBus } from './eventBus';

export const editorCreationEvt = 'editor-created';

export const editorView = {
    instance: null,
    _eb: eventBus,
    _ts: themeService,
    
    create(parent) {
        this.instance = new EditorView({
            state: this._createState(),
            parent: parent
        });
        
        this._ts.setEditorView(this.instance);
        this._eb.dispatch(editorCreationEvt);

        return this.instance;
    },
    destroy() {
        if (this.instance) {
            this.instance.dom.remove();
            this.instance.destroy();
            this.instance = null;
            this._ts.setEditorView(null); // Очищаем ссылку
        }
    },
    _createState() {
        return EditorState.create({
            extensions: [
                basicSetup,
                javascript(),
                this._createCustomViewStyle(),
                this._ts.editorTheme.of(tomorrow)
            ]
        });
    },
    _createCustomViewStyle() {
        return EditorView.theme({
            "&": {flexGrow: 1},
            ".cm-scroller": {overflow: "auto"}
        });
    }
}

const taskSolutionFormView = {
    root: UIComponentFactory.createTaskForm(),
    editor: null,
    executeButton: UIComponentFactory.createButton('warning', 'Выполнить'),
    saveButton: UIComponentFactory.createButton('success', 'Сохранить', true),
    _isMounted: false,

    mount(containerSelector) {
        const container = document.querySelector(containerSelector);
        this.editor = editorView;
        this.editor.create(this.root);
        this._appendChildren();
        container.append(this.root);
    },
    unmount() {
        if (!this._isMounted) return;
        this.editor.destroy()
        this.editor = null;
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