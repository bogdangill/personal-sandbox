import { taskDescriptionFormController } from './descriptionForm';
import { storageEntities, storageManager } from './storageService';
import { taskSolutionFormController } from './solutionForm';
import { UIComponentFactory } from './UIComponentFactory';
import { notify, showScroll } from './helpers';
import {marked} from 'marked';

export const formManager = {
    _initDescriptionForm() {
        const taskDescriptionContainer = document.getElementById('task-description');
        taskDescriptionFormController.init('#task-description');
        showScroll(taskDescriptionContainer);
    
        taskDescriptionFormController.onSubmit(data => {
            storageManager.set(storageEntities.DESCRIPTION_FORM_DATA, data);
            notify('Описание успешно сохранено!', 'success', 'check-square');
        });
    },
    _initSolutionForm() {
        taskSolutionFormController.init('#task-solution');
    },
    _showTaskDescriptionView(data) {
        const taskDescriptionContainer = document.getElementById('task-description');
        const taskDescriptionObject = JSON.parse(data);
        const taskDescription = `# ${taskDescriptionObject.title} \n ${taskDescriptionObject.description}`;
        taskDescriptionContainer.innerHTML = marked.parse(taskDescription);
        showScroll(taskDescriptionContainer);
    },
    _showTaskSolutionForm() {
        const root = document.getElementById('root');
        const solutionCell = UIComponentFactory.createGridCell('💻Решение', 'task-solution');
        solutionCell.classList.add('ps-grid__cell--bordered');
        root.append(solutionCell);
    },
    _showTaskDescriptionForm() {
        const root = document.getElementById('root');
        const descriptionCell = UIComponentFactory.createGridCell('📝Задача', 'task-description');
        root.append(descriptionCell);
    },
    //продумать логику экранов-шагов и мб вынести в отдельную сущность-менеджер или сервис
    _goToSolutionStep(data) {
        taskDescriptionFormController.destroy();
        this._showTaskDescriptionView(data);
        this._showTaskSolutionForm();
        this._initSolutionForm();
    }, 
    manage() {
        const taskDescriptionData = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);
        this._showTaskDescriptionForm();
    
        if (taskDescriptionData) {
            this._goToSolutionStep(taskDescriptionData);
        } else {
            this._initDescriptionForm();

            storageManager.onUpdate(storageEntities.DESCRIPTION_FORM_DATA, () => {
                const data = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);             
                this._goToSolutionStep(data);
            }); 
        }
    }
}