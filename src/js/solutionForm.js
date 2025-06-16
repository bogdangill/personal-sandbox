import { UIComponentFactory } from './UIComponentFactory';
import { notify } from './helpers';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from 'codemirror';
import { EditorState, StateEffect } from '@codemirror/state';
import { themeService } from './themeService';
import { tomorrow } from 'thememirror';
import { indentWithTab } from '@codemirror/commands';
import {keymap} from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { ComponentView } from './ComponentView';
import { ComponentController } from './ComponentController';

export function SolutionEditorView(parent) {
    this.parent = parent;
    this.ts = themeService;
    this.instance = new EditorView({
        state: this.createState(),
        parent: this.parent
    });
    this.ts.setEditorView(this.instance);

    return this.instance
}
SolutionEditorView.prototype.createState = function() {
    return EditorState.create({
        extensions: [
            basicSetup,
            javascript(),
            this.createCustomViewStyle(),
            this.ts.editorTheme.of(tomorrow),
            keymap.of([indentWithTab]),
            indentUnit.of("    "),
            EditorView.lineWrapping,
        ]
    });
}
SolutionEditorView.prototype.createCustomViewStyle = function() {
    return EditorView.theme({
        "&": {flexGrow: 1},
        ".cm-scroller": {overflow: "auto"}
    });
}

function SolutionFormView(parent) {
    const root = UIComponentFactory.createTaskForm();

    this.editor = new SolutionEditorView(root);
    this.executeButton = UIComponentFactory.createButton('warning', 'Выполнить');
    this.saveButton = UIComponentFactory.createButton('success', 'Сохранить', true);

    const formButtons = UIComponentFactory.createFormButtons(this.executeButton, this.saveButton);

    ComponentView.call(this, parent, root, formButtons);
}
SolutionFormView.prototype = Object.create(ComponentView.prototype);
SolutionFormView.prototype.constructor = SolutionFormView;

export function SolutionFormController(parent) {
    this.form = new SolutionFormView(parent);
    ComponentController.call(this, this.form);
}
SolutionFormController.prototype = Object.create(ComponentController.prototype);
SolutionFormController.prototype.constructor = SolutionFormController;

SolutionFormController.prototype.init = function(data = null) {
    //вызываю оригинальный init из родительского прототипа для расширения
    ComponentController.prototype.init.call(this);

    if (data) {
        const currentTaskObj = JSON.parse(data);
        const value = this.form.editor.state.update({
            changes: {from: 0, insert: currentTaskObj.code}
        });
        this.form.editor.dispatch(value);
    }
}
SolutionFormController.prototype.disableSaveButton = function() {
    this.form.editor.dispatch({
        effects: StateEffect.appendConfig.of(
            EditorView.updateListener.of(upd => {
                if (upd.docChanged) {
                    this.form.saveButton.disabled = upd.view.state.doc.length <= 1;
                }
            })
        )
    });
}
SolutionFormController.prototype.execute = function() {
    this.form.executeButton.addEventListener('click', () => {
        const code = this.form.editor.state.doc.toString();

        if (code.length <= 1) return;
        
        try {
            new Function(code)();
            notify('Код выполнился, результат в консоли', 'success');
        } catch (error) {
            notify(`Ошибка выполнения: ${error.message}`, 'danger');
        }
    });
}
SolutionFormController.prototype.onSave = function(cb) {
    this.form.saveButton.addEventListener('click', () => {
        const data = this.form.editor.state.doc.toString();
        cb(data);
    });
}
SolutionFormController.prototype.bindEvents = async function() {
    await Promise.all([
        customElements.whenDefined('sl-button')
    ]).then(() => {
        this.disableSaveButton();
        this.execute();
    });
}