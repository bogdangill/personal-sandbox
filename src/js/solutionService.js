import { UIComponentFactory } from "./UIComponentFactory";
import { notify, showScroll } from "./helpers";
import { SolutionFormController, SolutionFormView } from "./solutionForm";
import { taskManager } from "./tasksService";
// import hljs from 'highlight.js/lib/core';
// import javascript from 'highlight.js/lib/languages/javascript';
import { ComponentService } from "./ComponentService";
// hljs.registerLanguage('javascript', javascript);

export function SolutionService() {
    this.tm = taskManager;
    ComponentService.call(this);
}
SolutionService.prototype = Object.create(ComponentService.prototype);
SolutionService.prototype.constructor = SolutionService;

SolutionService.prototype.initForm = function(data) {
    const view = new SolutionFormView('#task-solution');
    const controller = new SolutionFormController(view);
    this.registerInstances(view, controller);

    controller.init(data);

    const taskSolutionContainer = document.getElementById('task-solution');
    showScroll(taskSolutionContainer);

    controller.onSave(data => {
        // this.tm.saveCurrentTask(data);
        this.tm.updateCurrent({code: data});
        notify('Задача сохранена', 'success', 'check-square');
    });
}
SolutionService.prototype.renderCell = function() {
    const root = document.getElementById('root');
    const solutionCell = UIComponentFactory.createGridCell('💻Решение', 'solution-cell', 'task-solution');
    solutionCell.classList.add('ps-grid__cell--bordered');
    root.append(solutionCell);
}
SolutionService.prototype.destroyForm = function() {
    const controller = this.getController();
    controller.destroy();
    this.clearInstances();
}
SolutionService.prototype.destroyCell = function() {
    const cell = document.getElementById('solution-cell');
    cell.remove();
}
// SolutionService.prototype.renderView = function(data) {
//     const solutionContainer = document.getElementById('task-solution');
//     const currentTaskObj = JSON.parse(data);
//     const {code} = currentTaskObj;
//     const highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;
//     solutionContainer.innerHTML = highlightedCode;
//     showScroll(solutionContainer);
// }