import { storageEntities, storageManager } from "./storageService";

function ITask(id, name, text, code, startDate, endDate = startDate, importance = null) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.code = code;
    this.startDate = startDate;
    this.endDate = endDate;
    this.importance = importance;
}

export const taskManager = {
    addOrUpdateCurrentTask(code) {
        const descriptionFormData = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);
        const currentTaskData = this._createTask(descriptionFormData.title, descriptionFormData.description, code);
        storageManager.set(storageEntities.CURRENT_TASK_DATA, currentTaskData);
    },
    /**
     * Сохраняет текущую задачу в коллекцию-архив (берет данные по задаче из current-task-data в LS)
     */
    saveCurrentTask() {
        const tasks = this._getAllTasks();
        const currentTask = storageManager.get(storageEntities.CURRENT_TASK_DATA);
        tasks.push(currentTask);
        storageManager.set(storageEntities.TASKS_DATA, tasks);
    },
    deleteTask(id) {
        const tasks = this._getAllTasks();
        const taskIndex = tasks.findIndex(item => item.id === id);
        tasks.splice(taskIndex, 1);
        storageManager.set(storageEntities.TASKS_DATA, tasks);
    },
    _createTask(name, text, code) {
        const date = new Date();
        const id = Date.now();
        const 
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes();
        const creationDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    
        return new ITask(id, name, text, code, creationDate);
    },
    _getAllTasks() {
        return storageManager.get(storageEntities.TASKS_DATA) || [];
    }
}