import { StorageService } from "./storageService";

const _storage = Symbol('_storage');

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
    [_storage]: new StorageService(),

    addCurrent(data) {
        const date = new Date();
        const id = Date.now();
        const 
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes();
        const creationDate = `${day}.${month}.${year} ${hours}:${minutes}`;
        const {name, text} = data;
        const taskObj = new ITask(id, name, text, null, creationDate);

        this[_storage].set(this[_storage].entities.CURRENT_TASK_DATA, taskObj);
    },
    updateCurrent(data) {
        const currentTask = JSON.parse(this[_storage].get(this[_storage].entities.CURRENT_TASK_DATA));
        const {name, text, code} = data;
        const updatedTask = new ITask(currentTask.id, name ?? currentTask.name, text ?? currentTask.text, code ?? currentTask.code, currentTask.startDate);
        this[_storage].set(this[_storage].entities.CURRENT_TASK_DATA, updatedTask, true, 'updated');
    },
    /**
     * Сохраняет текущую задачу в коллекцию-архив
     */
    saveCurrentTask(currentTaskData) { //saveToCollection(currentTask)
        const tasks = JSON.parse(this[_storage].get(this[_storage].entities.TASKS_DATA)) || [];
        tasks.push(currentTaskData);
        this[_storage].set(this[_storage].entities.TASKS_DATA, tasks);
    },
    deleteTask(id) {
        const tasks = this[_storage].get(this[_storage].entities.TASKS_DATA);
        if (!tasks) throw new Error(`Отсутствуют данные по ключу ${this[_storage].entities.TASKS_DATA}`);
        const taskIndex = tasks.findIndex(item => item.id === id);
        tasks.splice(taskIndex, 1);
        this[_storage].set(this[_storage].entities.TASKS_DATA, tasks);
    }
}