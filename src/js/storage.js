export const storageEntities = Object.freeze({
    DESCRIPTION_FORM_DATA: 'descriptionFormData',
    CURRENT_TASK_DATA: 'currentTaskData',
    TASKS_DATA: 'tasksData',
    PREFERED_THEME: 'preferedTheme',
    CURRENT_THEME: 'currentTheme',
});

const storageConfig = {
    [storageEntities.DESCRIPTION_FORM_DATA]: {
        key: 'description-form-data',
        storage: 'session',
    },
    [storageEntities.CURRENT_TASK_DATA]: {
        key: 'current-task-data',
        storage: 'local',
    },
    [storageEntities.TASKS_DATA]: {
        key: 'tasks-data',
        storage: 'local',
    },
    [storageEntities.PREFERED_THEME]: {
        key: 'prefered-theme',
        storage: 'local',
    },
    [storageEntities.CURRENT_THEME]: {
        key: 'current-theme',
        storage: 'local'
    }
};

export const storageManager = {
    get(entity) {
        const config = storageConfig[entity];
        if (!config) throw new Error(`Unknown storage entity: ${entity}`);

        const storage = config.storage === 'session'
            ? sessionStorage
            : localStorage;

        const data = storage.getItem(config.key);
        return data ? JSON.parse(data) : null;
    },

    set(entity, data) {
        const config = storageConfig[entity];
        if (!config) throw new Error(`Unknown storage entity: ${entity}`);

        const storage = config.storage === 'session'
            ? sessionStorage
            : localStorage;

        storage.setItem(config.key, JSON.stringify(data));
        eventBus.dispatch(`${config.key}-updated`, data);
    },
}