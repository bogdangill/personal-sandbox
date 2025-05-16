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

const STORAGE_THEME_KEY = 'is-dark-theme';
const DARK_THEME_CLASS = 'sl-theme-dark';

function switchDarkTheme() {
    if (localStorage.getItem(STORAGE_THEME_KEY)) {
        root.classList.remove(DARK_THEME_CLASS);
        localStorage.removeItem(STORAGE_THEME_KEY);
    } else {
        root.classList.add(DARK_THEME_CLASS);
        localStorage.setItem(STORAGE_THEME_KEY, true);
    }
}

function initApp() {
    if (window.matchMedia('(prefers-color-scheme:dark)')?.matches) {
        localStorage.setItem(STORAGE_THEME_KEY, true);
        root.classList.add(DARK_THEME_CLASS);
    }

    renderThemeSwitcher();
}

function renderThemeSwitcher() {
    const themeSwitcherContainer = document.getElementById('theme-switcher');
    const switchIcon = () => localStorage.getItem(STORAGE_THEME_KEY) ? 'cloud-sun' : 'cloud-moon';

    const themeSwitcherIcon = Object.assign(document.createElement('sl-icon'), 
        {
            name: switchIcon(),
            label: 'Сменить тему'
        }
    );
    const themeSwitcherButton = Object.assign(document.createElement('sl-button'),
        {
            circle: true,
            size: 'medium'
        }
    );

    themeSwitcherContainer.append(themeSwitcherButton);
    themeSwitcherButton.append(themeSwitcherIcon);
    
    themeSwitcherButton.addEventListener('click', () => {
        switchDarkTheme();
        themeSwitcherIcon.name = switchIcon();
    })
}

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

document.addEventListener('DOMContentLoaded', initApp);