import './styles.scss';
import 'highlight.js/scss/an-old-hope.scss';

import {marked} from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/button/button';

async function loadTask(taskName) {
    try {
        const response$ = await fetch(`./training-tasks/${taskName}.md`);
        const markdown$ = await response$.text();
    
        const solution$ = await fetch(`./training-tasks/${taskName}.js`);
        const solutionCode$ = await solution$.text();

        const highlightedCode = hljs.highlight(solutionCode$, { language: 'javascript' }).value;
    
        document.getElementById('task-description').innerHTML = marked.parse(markdown$);
        document.getElementById('task-solution').innerHTML = `${highlightedCode}`;
    } catch (error) {
        console.error('Ошибка загрузки задачи:', error);
        document.getElementById('task-solution').innerText = `Ошибка: ${error.message}`;
    }
}

//пока так, потом сделаю выбор задач через интерфейс
loadTask('task-2');