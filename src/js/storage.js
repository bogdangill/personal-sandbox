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