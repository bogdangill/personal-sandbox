import { UIComponentFactory } from './UIComponentFactory';
import { ComponentView } from './ComponentView';
import { notify } from './helpers';
import { ComponentController } from './ComponentController';

function DescriptionFormView(parent) {
    this.input = UIComponentFactory.createTaskDescriptionNameInput();
    this.textarea = UIComponentFactory.createTaskDescriptionTextarea();
    this.submitButton = UIComponentFactory.createButton('primary', 'Создать', true, 'submit');
    this.resetButton = UIComponentFactory.createButton('neutral', 'Сбросить', false, 'reset');

    const root = UIComponentFactory.createTaskForm();
    const formButtons = UIComponentFactory.createFormButtons(this.submitButton, this.resetButton);

    ComponentView.call(this, parent, root, this.input, this.textarea, formButtons);
}
DescriptionFormView.prototype = Object.create(ComponentView.prototype);
DescriptionFormView.prototype.constructor = DescriptionFormView;

export function DescriptionFormController(parent) {
    this.form = new DescriptionFormView(parent);
    ComponentController.call(this, this.form); //вызываю конструктор ComponentController (super)
}
DescriptionFormController.prototype = Object.create(ComponentController.prototype); //наследую (extends)
DescriptionFormController.prototype.constructor = DescriptionFormController;

DescriptionFormController.prototype.disableSubmitButton = function() {
    this.form.textarea.addEventListener('sl-input', () => {
        this.form.submitButton.disabled = this.form.textarea.value.trim().length <= 0;
    })
}
DescriptionFormController.prototype.reset = function() {
    this.form.root.reset();
    this.form.root.addEventListener('reset', () => {
        this.form.submitButton.disabled = true;
    })
}
DescriptionFormController.prototype.validate = function() {
    this.form.root.addEventListener('sl-invalid', evt => {
        evt.preventDefault();
        notify(`Ошибка: ${evt.target.validationMessage}`);
        evt.target.focus();
    },{ capture: true })
}
DescriptionFormController.prototype.onSubmit = function(cb) {
    this.form.root.addEventListener('submit', evt => {
        evt.preventDefault();

        const formData = new FormData(this.view.root);
        const data = {};

        formData.forEach((val, key) => {
            data[key] = val
        });

        if (typeof cb === 'function') {
            cb(data);
        }
    })
}
DescriptionFormController.prototype.bindEvents = async function() {
    await Promise.all([
        customElements.whenDefined('sl-input'),
        customElements.whenDefined('sl-textarea'),
        customElements.whenDefined('sl-button')
    ]).then(() => {
        this.disableSubmitButton();
        this.validate();
        this.reset();
    });
}