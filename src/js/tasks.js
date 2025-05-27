import { storageEntities, storageManager } from "./storage";

function ITask(id, name, text, code, startDate, endDate = startDate, importance = null) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.code = code;
    this.startDate = startDate;
    this.endDate = endDate;
    this.importance = importance;
}

const tasksManager = {
    get currentTask() {
        return storageManager.get(storageEntities.CURRENT_TASK_DATA);
    }, 
    set currentTask(data) {
        storageManager.set(storageEntities.CURRENT_TASK_DATA, data);
    },
    create(name, text, code) {
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
    }
}

// function updateTasksData() {
//     if (currentTask) {
//         tasksData.push(currentTask);
//         localStorage.setItem(JSON.stringify(tasksData));
//     }
// }