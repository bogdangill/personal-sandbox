import { marked } from "marked";
import { UIComponentFactory } from "./UIComponentFactory";
import { taskDescriptionFormController } from "./descriptionForm";
import { notify, showScroll } from "./helpers";
import { storageEntities, storageManager } from "./storageService";

export const descriptionService = {
    _sm: storageManager,
    _formController: taskDescriptionFormController,

    initForm() {
        const taskDescriptionContainer = document.getElementById('task-description');
        this._formController.init('#task-description');
        showScroll(taskDescriptionContainer);
    
        this._formController.onSubmit(data => {
            this._setData(data);
            notify('Описание успешно сохранено!', 'success', 'check-square');
        });
    },
    renderDescriptionCell() {
        const root = document.getElementById('root');
        const descriptionCell = UIComponentFactory.createGridCell('📝Задача', 'task-description');
        root.append(descriptionCell);
    },
    destroyForm() {
        this._formController.destroy();
    },
    renderView(data) {
        const taskDescriptionContainer = document.getElementById('task-description');
        const taskDescriptionObject = JSON.parse(data);
        const {title, description} = taskDescriptionObject;
        const taskDescription = `# ${title} \n ${description}`;
        taskDescriptionContainer.innerHTML = marked.parse(taskDescription);
        showScroll(taskDescriptionContainer);
    },
    _setData(data) {
        return this._sm.set(storageEntities.DESCRIPTION_FORM_DATA, data);
    },
    _getData() {
        return this._sm.get(storageEntities.DESCRIPTION_FORM_DATA);
    },
    _removeData() {
        return this._sm.remove(storageEntities.DESCRIPTION_FORM_DATA);
    }
}