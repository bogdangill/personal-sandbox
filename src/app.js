import './scss/styles.scss';
import 'highlight.js/scss/an-old-hope.scss';
import SimpleBar from 'simplebar';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

import {marked} from 'marked';

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

import { definePreferedTheme, renderThemeSwitcher } from './js/theme.js';
import { taskDescriptionFormController } from './js/descriptionForm';
import { storageEntities, storageManager } from './js/storageService';
import { taskSolutionFormController } from './js/solutionForm';
import { UIComponentFactory } from './js/UIComponentFactory';
import { notify } from './js/helpers';

const showScroll = (container) => new SimpleBar(container, {
    scrollbarMinSize: 20
});

function initDescriptionForm() {
    taskDescriptionFormController.init('#task-description');

    taskDescriptionFormController.onSubmit(data => {
        storageManager.set(storageEntities.DESCRIPTION_FORM_DATA, data);
        notify('Описание успешно сохранено!', 'success', 'check-square');
    });
}

function manageForms() {
    const taskDescriptionContainer = document.getElementById('task-description');
    const taskDescriptionData = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);

    if (taskDescriptionData) {
        taskDescriptionFormController.destroy();
        showTaskDescriptionView(taskDescriptionData);
        initSolutionForm();
        showScroll(taskDescriptionContainer);
    } else {
        initDescriptionForm();
        showScroll(taskDescriptionContainer);

        storageManager.onUpdate(storageEntities.DESCRIPTION_FORM_DATA, () => {
            const data = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);
            taskDescriptionFormController.destroy();
            showTaskDescriptionView(data);
            initSolutionForm();
            showScroll(taskDescriptionContainer);
        }); 
    }
}

function showTaskDescriptionView(data) {
    const taskDescriptionContainer = document.getElementById('task-description');
    const taskDescriptionData = data;
    const taskDescriptionObject = JSON.parse(taskDescriptionData);
    const taskDescription = `# ${taskDescriptionObject.title} \n ${taskDescriptionObject.description}`;
    taskDescriptionContainer.innerHTML = marked.parse(taskDescription);
}

function initSolutionForm() {
    const root = document.getElementById('root');
    const solutionCell = UIComponentFactory.createGridCell('💻Решение');
    solutionCell.classList.add('ps-grid__cell--bordered');
    root.append(solutionCell);
    taskSolutionFormController.init('#task-solution');
}

function initApp() {
    definePreferedTheme();
    renderThemeSwitcher();
    manageForms();
}

initApp();