import { UIComponentFactory } from './UIComponentFactory';
import { notify } from './helpers';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from 'codemirror';
import { EditorState, StateEffect } from '@codemirror/state';
import { themeService } from './themeService';
import { tomorrow } from 'thememirror';
import { eventBus } from './eventBus';
import { indentWithTab } from '@codemirror/commands';
import {keymap} from '@codemirror/view';
import { indentUnit } from '@codemirror/language';

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
                this._ts.editorTheme.of(tomorrow),
                keymap.of([indentWithTab]),
                indentUnit.of("    "),
                EditorView.lineWrapping,
            ]
        });
    },
    _createCustomViewStyle() {
        return EditorView.theme({
            "&": {flexGrow: 1},
            ".cm-scroller": {overflow: "auto"}
        });
    },
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

    init(selector, data = null) {
        this.form.mount(selector);
        this.bindEvents();
        
        if (data) {
            const currentTaskObj = JSON.parse(data);
            const value = this.form.editor.instance.state.update({
                changes: {from: 0, insert: currentTaskObj.code}
            });
            this.form.editor.instance.dispatch(value);
        }
    },
    /**
     * Отключает кнопку сохранения, если поле с решением пустое.
     */
    disableSubmitButton() {
        this.form.editor.instance.dispatch({
            effects: StateEffect.appendConfig.of(
                EditorView.updateListener.of(upd => {
                    if (upd.docChanged) {
                        this.form.saveButton.disabled = upd.view.state.doc.length <= 1;
                    }
                })
            )
        });
    },
    execute() {
        this.form.executeButton.addEventListener('click', () => {
            if (!this.form.editor.instance) {
                console.error('Редактор не инициализирован');
                return;
            }

            const code = this.form.editor.instance.state.doc.toString();

            if (code.length <= 1) return;
            
            try {
                new Function(code)();
                notify('Код выполнился, результат в консоли', 'success');
            } catch (error) {
                notify(`Ошибка выполнения: ${error.message}`, 'danger');
            }
        });
    },
    onSave(cb) {
        this.form.saveButton.addEventListener('click', () => {
            const data = this.form.editor.instance.state.doc.toString();
            cb(data);
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