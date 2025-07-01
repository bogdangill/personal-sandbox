import { StorageService } from "./storageService";

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
    _storage: new StorageService(),

    addCurrent(data) {
        //надо перенести логику из createTask сюда
        const {name, text} = data;
        const taskObj = this._createTask(name, text, null);
        this._storage.set(this._storage.entities.CURRENT_TASK_DATA, taskObj);
    },
    updateCurrent(data) {
        debugger;
        const currentTask = JSON.parse(this._storage.get(this._storage.entities.CURRENT_TASK_DATA));
        const {name, text, code} = data;
        //проблема - createTask обновляет айди и другие статичные данные, которые нет смысла обновлять
        const updatedTask = this._createTask(name ?? currentTask.name, text ?? currentTask.text, code ?? currentTask.code);
        this._storage.set(this._storage.entities.CURRENT_TASK_DATA, updatedTask, false);

        // if (typeof data === 'string') {
        //     const code = data;
        //     this.addCurrent(code, false);
        // } else {
        //     const code = currentTask.code || null;
        //     this.addCurrent(code, false);
        // }
    },
    /**
     * Сохраняет текущую задачу в коллекцию-архив
     */
    saveCurrentTask(currentTaskData) { //saveToCollection(currentTask)
        const tasks = JSON.parse(this._storage.get(this._storage.entities.TASKS_DATA)) || [];
        tasks.push(currentTaskData);
        this._storage.set(this._storage.entities.TASKS_DATA, tasks);
    },
    deleteTask(id) {
        const tasks = this._storage.get(this._storage.entities.TASKS_DATA);
        if (!tasks) throw new Error(`Отсутствуют данные по ключу ${this._storage.entities.TASKS_DATA}`);
        const taskIndex = tasks.findIndex(item => item.id === id);
        tasks.splice(taskIndex, 1);
        this._storage.set(this._storage.entities.TASKS_DATA, tasks);
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
}