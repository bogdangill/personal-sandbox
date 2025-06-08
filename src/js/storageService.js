import { eventBus } from "./eventBus";

/**
 * Сущности хранилища и их конфигурация:
 * - DESCRIPTION_FORM_DATA: данные формы описания задачи (sessionStorage).
 * - TASKS_DATA: список всех задач (localStorage).
 * - CURRENT_TASK_DATA: текущая редактируемая задача (localStorage).
 * - События: `${key}-updated` (например, "tasks-data-updated").
 */
export const storageEntities = Object.freeze({
    DESCRIPTION_FORM_DATA: 'descriptionFormData',
    CURRENT_TASK_DATA: 'currentTaskData',
    TASKS_DATA: 'tasksData',
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
    [storageEntities.CURRENT_THEME]: {
        key: 'current-theme',
        storage: 'local'
    }
};

export const storageManager = {
    /**
     * забирает данные по ключу из Storage
     * @param {storageEntities} entity - название ключа из Storage
     * @param {string | object} data
     */
    get(entity) {
        const config = this._getConfig(entity);
        const storage = this._getStorage(config.storage);
        const data = storage.getItem(config.key);

        return data ? typeof data === 'string' ? data : JSON.parse(data) : null;
    },
    /**
     * устанавливает значение ключа в Storage и публикует соответствующее ему событие
     * @param {storageEntities} entity - название ключа из Storage
     * @param {string | object} data
     */
    set(entity, data, createEvent = true) {
        const config = this._getConfig(entity);
        const storage = this._getStorage(config.storage);

        if (typeof data !== 'string') data = JSON.stringify(data);

        storage.setItem(config.key, data);

        if (createEvent) eventBus.dispatch(this._getEventName(entity, 'updated'));
    },
    remove(entity, createEvent = true) {
        const config = this._getConfig(entity);
        const storage = this._getStorage(config.storage);
        const data = storage.getItem(config.key);

        if (data === null) {
            throw new Error(`Невозможно удалить: ${config.key} отсутствует в ${config.storage} хранилище!`);
        }

        storage.removeItem(config.key);
        eventBus.remove(this._getEventName(entity, 'updated'));

        if (createEvent) eventBus.dispatch(this._getEventName(entity, 'deleted'));
    },
    /**
     * хук для отлова опубликованного события обновления Storage
     * @param {storageEntities} entity - название ключа из Storage
     * @param {function} cb - коллбэк-функция, которая триггерится во время события
     */
    onUpdate(entity, cb) {
        eventBus.listen(this._getEventName(entity, 'updated'), cb);
    },
    onRemove(entity, cb) {
        eventBus.listen(this._getEventName(entity, 'deleted'), cb);
    },
    _getConfig(entity) {
        const config = storageConfig[entity];
        if (!config) throw new Error(`Неизвестная сущность хранилища: ${entity}`);
        return config;
    },
    _getStorage(type) {
        return type === 'session' ? sessionStorage : localStorage;
    },
    _getEventName(entity, suffix) {
        const config = this._getConfig(entity);
        return `${config.key}-${suffix}`;
    }
}