import { UIComponentFactory } from "./UIComponentFactory";
import { notify, showScroll } from "./helpers";
import { taskSolutionFormController } from "./solutionForm";
import { storageEntities, storageManager } from "./storageService";
import { taskManager } from "./tasksService";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

export const solutionService = {
    _sm: storageManager,
    _formController: taskSolutionFormController,
    _tm: taskManager,

    initForm(data) {
        // const taskSolutionContainer = document.getElementById('task-solution');
        this._formController.init('#task-solution', data);
        // showScroll(taskSolutionContainer);

        this._formController.onSave(data => {
            this._setData(data);
            notify('Задача сохранена и добавлена в коллекцию!', 'success', 'check-square');
        });
    },
    renderSolutionCell() {
        const root = document.getElementById('root');
        const solutionCell = UIComponentFactory.createGridCell('💻Решение', 'solution-cell', 'task-solution');
        solutionCell.classList.add('ps-grid__cell--bordered');
        root.append(solutionCell);
    },
    destroyForm() {
        this._formController.destroy();
    },
    destroyCell() {
        const cell = document.getElementById('solution-cell');
        cell.remove();
    },
    renderView(data) {
        const solutionContainer = document.getElementById('task-solution');
        const currentTaskObj = JSON.parse(data);
        const {code} = currentTaskObj;
        const highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;
        solutionContainer.innerHTML = highlightedCode;
        showScroll(solutionContainer);
    },
    _getData() {
        return this._sm.get(storageEntities.CURRENT_TASK_DATA);
    },
    _setData(data) {
        return this._tm.addOrUpdateCurrentTask(data);
    }
}