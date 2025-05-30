import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip';
import '@shoelace-style/shoelace/dist/components/textarea/textarea';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/divider/divider';

/**
 * @namespace
 * Фабрика для создания UI-компонентов.
 * Все методы возвращают готовые DOM-элементы.
 */
export const UIComponentFactory = {
    createTaskDescriptionNameInput() {
        return Object.assign(document.createElement('sl-input'), {
            label: 'Название задачи',
            name: 'title',
            placeholder: 'e.g. Bubble sort',
            clearable: true,
            autocomplete: 'off'
        });
    },
    createTaskDescriptionTextarea() {
        return Object.assign(document.createElement('sl-textarea'), {
            label: 'Описание задачи',
            name: 'description',
            resize: 'auto',
            helpText: 'p.s. описание можно оформить в формате markdown - тогда после сохранения оформленный текст будет выводиться обернутый html-тегами',
            minlength: 10
        });
    },
    //временная затычка для демо. скорее всего здесь будет модуль CodeMirror
    createTaskSolutionTextarea() {
        const textarea = document.createElement('textarea');
        textarea.classList.add('solution-textarea');
        textarea.name = 'solution';
        textarea.id = 'solutionTextarea';
        textarea.cols = 30;
        textarea.rows = 10;

        return textarea;
    },
    createButton(variant, text, disabled = false, type = 'button') {
        const button = Object.assign(document.createElement('sl-button'), {
            variant: variant,
            type: type,
            disabled: disabled
        });
        button.innerText = text;
    
        return button;
    },
    createFormButtons(...buttons) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('form-buttons');
        buttonWrapper.append(...buttons);
    
        return buttonWrapper;
    },
    createTaskForm() {
        const taskForm = document.createElement('form');
        taskForm.classList.add('task-form');
    
        return taskForm;
    },
    createTooltip(content, placement) {
        return Object.assign(document.createElement('sl-tooltip'), {
            content: content,
            placement: placement
        })
    },
    createIcon(name, label) {
        return Object.assign(document.createElement('sl-icon'), {
            name: name,
            label: label
        })
    },
    createIconButton() {
        return Object.assign(document.createElement('sl-button'), {
            circle: true,
            size: 'medium'
        })
    },
    createDivider() {
        const divider = document.createElement('sl-divider');
        divider.style = '--spacing: 0;';
        return divider;
    },
    createGridCell(title, id) {
        const cell = document.createElement('article');
        const cellHeader = document.createElement('header');
        const cellTitle = document.createElement('h2');
        const cellContainer = document.createElement('div');
        const divider = this.createDivider();

        cell.classList.add('ps-grid__cell');
        cellHeader.classList.add('ps-grid__header');
        cellTitle.classList.add('ps-grid__title');
        cellContainer.id = id;

        cellTitle.innerText = title;
        cellHeader.append(cellTitle);
        cell.append(cellHeader);
        cell.append(divider);
        cell.append(cellContainer);

        return cell;
    }
}