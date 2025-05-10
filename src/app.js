import 'bulma/css/bulma.min.css';
import "./styles.css";
import {marked} from 'marked';

async function loadTask(taskName) {
    try {
        const response$ = await fetch(`./training-tasks/${taskName}.md`);
        const markdown$ = await response$.text();
    
        const solutionModule$ = await import(`./training-tasks/${taskName}.js`);
        const solution = solutionModule$.default;
    
        if (typeof solution !== 'function') {
            throw new Error(`Файл ${taskName}.js не экспортирует функцию по умолчанию.`);
        }
    
        document.getElementById('task-description').innerHTML = marked.parse(markdown$);
        document.getElementById('task-solution').innerText = solution;
    } catch (error) {
        console.error('Ошибка загрузки задачи:', error);
        document.getElementById('task-solution').innerText = `Ошибка: ${error.message}`;
    }
}

//пока так, потом сделаю выбор задач через интерфейс
loadTask('task-1');