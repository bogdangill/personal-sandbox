import { marked } from "marked";
import { UIComponentFactory } from "./UIComponentFactory";
import { DescriptionFormController, DescriptionFormView } from "./descriptionForm";
import { fillDescriptionForm, notify, showScroll } from "./helpers";
import { storageEntities, storageManager } from "./storageService";
import { ComponentService } from "./ComponentService";

export function DescriptionService() {
    this.sm = storageManager;
    ComponentService.call(this);
}
DescriptionService.prototype = Object.create(ComponentService.prototype);
DescriptionService.prototype.constructor = DescriptionService;

DescriptionService.prototype.initForm = function() {
    const view = new DescriptionFormView('#task-description');
    const controller = new DescriptionFormController(view);
    this.registerInstances(view, controller);
    console.log(this.getController());
    controller.init();

    const taskDescriptionContainer = document.getElementById('task-description');
    showScroll(taskDescriptionContainer);
    fillDescriptionForm(controller.form);

    controller.onSubmit(data => {
        this.sm.set(storageEntities.DESCRIPTION_FORM_DATA, data);
        notify('Описание успешно сохранено!', 'success', 'check-square');
    });
}
DescriptionService.prototype.renderCell = function(withOptions = false) {
    const root = document.getElementById('root');
    const descriptionCell = UIComponentFactory.createGridCell('📝Задача', 'description-cell', 'task-description');
    if (withOptions) {
        const header = descriptionCell.querySelector('header');
        const options = [
            {text: 'Изменить', value: 'edit'},
            {text: 'Удалить', value: 'delete', handler: () => {
                this.sm.remove(storageEntities.DESCRIPTION_FORM_DATA)
            }}
        ];
        const dropdown = UIComponentFactory.createDropdown('Редактировать', options);

        header.insertAdjacentElement('beforeend', dropdown);
    }
    root.append(descriptionCell);
}
DescriptionService.prototype.destroyForm = function() { //можно вынести в прототип ComponentService
    const controller = this.getController();
    if (!controller) return;
    controller.destroy();
    this.clearInstances();
}
DescriptionService.prototype.destroyCell = function() {
    const cell = document.getElementById('description-cell');
    cell.remove();
}
DescriptionService.prototype.renderView = function(data) {
    const taskDescriptionContainer = document.getElementById('task-description');
    const taskObj = JSON.parse(data);
    const {name, text} = taskObj;
    const taskDescription = `# ${name} \n ${text}`;
    taskDescriptionContainer.innerHTML = marked.parse(taskDescription);
    showScroll(taskDescriptionContainer);
}