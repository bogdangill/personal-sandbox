function TaskInterface(id, name, text, code, startDate, endDate = startDate, importance = null) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.code = code;
    this.startDate = startDate;
    this.endDate = endDate;
    this.importance = importance;
}

const currentTask = {};
const tasksData = [];