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
import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/icon/icon';

const taskDescription = document.getElementById('task-description');
const taskSolution = document.getElementById('task-solution');
const root = document.querySelector('html');

function checkUserThemePreference() {
    if (window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

function switchTheme() {
    if (root.classList.contains(`sl-theme-dark`)) {
        root.classList.remove(`sl-theme-dark`)
        root.classList.add(`sl-theme-light`);
    } else {
        root.classList.remove(`sl-theme-light`)
        root.classList.add(`sl-theme-dark`);
    }
}

function renderThemeSwitcher(theme = 'light') {
    const themeSwitcherContainer = document.getElementById('theme-switcher');
    const themeSwitcherIcon = Object.assign(document.createElement('sl-icon'), {
        name: theme === 'light' ? 'cloud-moon' : 'cloud-sun',
        label: 'Сменить тему'
    });
    const themeSwitcherButton = Object.assign(document.createElement('sl-button'),
        {
            circle: true,
            size: 'medium'
        }
    );
    themeSwitcherContainer.append(themeSwitcherButton);
    themeSwitcherButton.append(themeSwitcherIcon);
    
    themeSwitcherButton.addEventListener('click', () => {
        switchTheme()
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const theme = checkUserThemePreference();
    root.classList.add(`sl-theme-${theme}`);
    renderThemeSwitcher(theme);
})

async function loadTask(taskName) {
    try {
        const response$ = await fetch(`./training-tasks/${taskName}.md`);
        const markdown$ = await response$.text();
    
        const solution$ = await fetch(`./training-tasks/${taskName}.js`);
        const solutionCode$ = await solution$.text();

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
loadTask('task-2');