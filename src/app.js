import 'bulma/css/bulma.min.css';
import 'highlight.js/styles/an-old-hope.min.css'
import {marked} from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

async function loadTask(taskName) {
    try {
        const response$ = await fetch(`./training-tasks/${taskName}.md`);
        const markdown$ = await response$.text();
    
        const solutionModule$ = await import(`./training-tasks/${taskName}.js`);
        const solution = solutionModule$.default;
    
        if (typeof solution !== 'function') {
            throw new Error(`Файл ${taskName}.js не экспортирует функцию по умолчанию.`);
        }

        const code = solution.toString()
            .replace(/^\(\)\s*=>\s*\{?|\}$/g, '')
            .trim();
        const highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;
    
        document.getElementById('task-description').innerHTML = marked.parse(markdown$);
        document.getElementById('task-solution').innerHTML = `${highlightedCode}`;
    } catch (error) {
        console.error('Ошибка загрузки задачи:', error);
        document.getElementById('task-solution').innerText = `Ошибка: ${error.message}`;
    }
}

//пока так, потом сделаю выбор задач через интерфейс
loadTask('task-1');