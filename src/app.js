import './scss/styles.scss';
import 'highlight.js/scss/an-old-hope.scss';
import SimpleBar from 'simplebar';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

import {marked} from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import { definePreferedTheme, renderThemeSwitcher } from './js/theme.js';

import '@shoelace-style/shoelace/dist/components/drawer/drawer';
import '@shoelace-style/shoelace/dist/components/button/button';

import { renderTaskDescriptionForm } from './js/tasks';

// function renderTasksDrawer() {
//     const tasksDrawerTriggerContainer = document.getElementById('tasks-drawer');
//     const body = document.querySelector('body');
    
//     const tasksDrawer = Object.assign(document.createElement('sl-drawer'), {
//         label: 'Список задач',
//         placement: 'start'
//     });

//     body.append(tasksDrawer);

//     const tasksDrawerTrigger = Object.assign(document.createElement('sl-button'), {
//         caret: true,
//         size: 'small'
//     });
//     tasksDrawerTrigger.textContent = 'Показать остальные';
//     tasksDrawerTrigger.addEventListener('click', () => tasksDrawer.show());
//     tasksDrawerTriggerContainer.append(tasksDrawerTrigger);
// }

const taskDescription = document.getElementById('task-description');
const taskSolution = document.getElementById('task-solution');

async function loadTask(taskName) {
    try {
        const response$ = await fetch(`./training-tasks/${taskName}.md`);
        const markdown$ = await response$.text();
    
        const solution$ = await fetch(`./training-tasks/${taskName}.js`);
        const solutionCode$ = await solution$.text();
        
        tasks.push(new TaskModel('task1', markdown$, solutionCode$));

        localStorage.setItem('tasks-data', JSON.stringify(tasks));

        //-------------------------------------------------------------------------------------
        const highlightedCode = hljs.highlight(solutionCode$, { language: 'javascript' }).value;
    
        taskDescription.innerHTML = marked.parse(markdown$);
        taskSolution.innerHTML = `${highlightedCode}`;

        new SimpleBar(taskDescription, {
            scrollbarMinSize: 20
        });
        new SimpleBar(taskSolution);
    } catch (error) {
        console.error('Ошибка загрузки задачи:', error);
        taskSolution.innerText = `Ошибка: ${error.message}`;
    }
}

//пока так, потом сделаю выбор задач через интерфейс
// loadTask('task-1');

function initApp() {
    definePreferedTheme();
    renderThemeSwitcher();
    renderTaskDescriptionForm();
    // renderTasksDrawer();
}

document.addEventListener('DOMContentLoaded', initApp);