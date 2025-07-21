/**
 * @namespace
 * Фабрика для создания UI-компонентов.
 * Все методы возвращают готовые DOM-элементы.
 */
export const UIComponentFactory = {
    createTaskDescriptionNameInput() {
        return Object.assign(document.createElement('sl-input'), {
            label: 'Название задачи',
            name: 'name',
            placeholder: 'e.g. Bubble sort',
            clearable: true,
            autocomplete: 'off'
        });
    },
    createTaskDescriptionTextarea() {
        return Object.assign(document.createElement('sl-textarea'), {
            label: 'Описание задачи',
            name: 'text',
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
    createGridCell(title, cellId, containerId) {
        const cell = document.createElement('article');
        const cellHeader = document.createElement('header');
        const cellTitle = document.createElement('h2');
        const cellContainer = document.createElement('div');
        const divider = this.createDivider();

        cell.classList.add('ps-grid__cell');
        cellHeader.classList.add('ps-grid__header');
        cellTitle.classList.add('ps-grid__title');
        cell.id = cellId;
        cellContainer.id = containerId;

        cellTitle.innerText = title;
        cellHeader.append(cellTitle);
        cell.append(cellHeader);
        cell.append(divider);
        cell.append(cellContainer);

        return cell;
    },
    createMenu(options) {
        const menu = document.createElement('sl-menu');
        
        for (let option of options) {
            const item = document.createElement('sl-menu-item');
            item.setAttribute('value', option.value);
            item.innerText = option.text;
            item.onclick = option.handler;
            menu.appendChild(item);
        }

        return menu;
    },
    createDropdown(triggerText, options) {
        const ddTrigger = this.createButton('neutral', triggerText);
        ddTrigger.size = 'small';
        ddTrigger.caret = true;
        ddTrigger.slot = 'trigger';

        const menu = this.createMenu(options);
        const dropdown = document.createElement('sl-dropdown');

        dropdown.appendChild(ddTrigger);
        dropdown.appendChild(menu);

        return dropdown;
    }
}