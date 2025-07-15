import { eventBus } from "./eventBus";

//создаю скрытые методы и свойства для объекта StorageService, защищаясь от нечаянного использования 
//или перезаписи при дальнейшем масштабировании кода. Еще их не будет видно в качестве 
//доступных методов при создании и использовании экземпляра StorageService.
const _storageConfig = Symbol('_storageConfig');
const _getConfig = Symbol('_getConfig');
const _getStorage = Symbol('_getStorage');
const _getEventName = Symbol('_getEventName');

export function StorageService() {}
/**
 * Сущности хранилища и их конфигурация:
 * - TASKS_DATA: список всех задач (localStorage).
 * - CURRENT_TASK_DATA: текущая редактируемая или только что созданная задача (localStorage).
 * - CURRENT_THEME: текущая тема оформления приложения
 * - События: `${key}-created` (например, "tasks-data-created").
 */
StorageService.prototype.entities = Object.freeze({
    CURRENT_TASK_DATA: 'currentTaskData',
    TASKS_DATA: 'tasksData',
    CURRENT_THEME: 'currentTheme',
});
StorageService.prototype[_storageConfig] = {
    [StorageService.prototype.entities.CURRENT_TASK_DATA]: {
        key: 'current-task-data',
        storage: 'local',
    },
    [StorageService.prototype.entities.TASKS_DATA]: {
        key: 'tasks-data',
        storage: 'local',
    },
    [StorageService.prototype.entities.CURRENT_THEME]: {
        key: 'current-theme',
        storage: 'local'
    }
};
StorageService.prototype[_getConfig] = function(entity) {
    const config = this[_storageConfig][entity];
    if (!config) throw new Error(`Неизвестная сущность хранилища: ${entity}`);
    return config;
}
StorageService.prototype[_getStorage] = function(type) {
    return type === 'session' ? sessionStorage : localStorage;
}
StorageService.prototype[_getEventName] = function(entity, suffix) {
    const config = this[_getConfig](entity);
    return `${config.key}-${suffix}`;
}
/**
 * забирает данные по ключу из Storage
 * @param {entities} entity - название ключа из Storage
 */
StorageService.prototype.get = function(entity) {
    const config = this[_getConfig](entity);
    const storage = this[_getStorage](config.storage);
    const data = storage.getItem(config.key);

    return data || null;
}
/**
 * устанавливает значение ключа в Storage и публикует соответствующее ему событие(опционально)
 * @param {entities} entity - название ключа из Storage
 */
StorageService.prototype.set = function(entity, data, createEvent = true, eventType = 'created') {
    const config = this[_getConfig](entity);
    const storage = this[_getStorage](config.storage);

    if (typeof data !== 'string') data = JSON.stringify(data);

    storage.setItem(config.key, data);

    if (createEvent) eventBus.dispatch(this[_getEventName](entity, eventType));
}
/**
 * устанавливает данные по ключу в Storage и публикует соответствующее ему событие(опционально)
 * @param {entities} entity - название ключа из Storage
 */
StorageService.prototype.remove = function(entity, createEvent = true) {
    const config = this[_getConfig](entity);
    const storage = this[_getStorage](config.storage);
    const data = storage.getItem(config.key);

    if (data === null) {
        throw new Error(`Невозможно удалить: ${config.key} отсутствует в ${config.storage} хранилище!`);
    }

    storage.removeItem(config.key);
    eventBus.remove(this[_getEventName](entity, 'created'));

    if (createEvent) eventBus.dispatch(this[_getEventName](entity, 'deleted'));
}
/**
 * хук для отлова опубликованного события создания сущности в Storage
 * @param {entities} entity - название ключа из Storage
 * @param {function} cb - коллбэк-функция, которая триггерится во время события
 */
StorageService.prototype.onCreate = function(entity, cb) {
    eventBus.listen(this[_getEventName](entity, 'created'), cb);
}
/**
 * хук для отлова опубликованного события перед изменением сущности в Storage
 * @param {entities} entity - название ключа из Storage
 * @param {function} cb - коллбэк-функция, которая триггерится во время события
 */
StorageService.prototype.beforeUpdate = function(entity, cb) {
    eventBus.listen(this[_getEventName](entity, 'update'), cb);
}
/**
 * хук для отлова опубликованного события после изменения сущности в Storage
 * @param {entities} entity - название ключа из Storage
 * @param {function} cb - коллбэк-функция, которая триггерится во время события
 */
StorageService.prototype.afterUpdate = function(entity, cb) {
    eventBus.listen(this[_getEventName](entity, 'updated'), cb);
}
/**
 * хук для отлова опубликованного события удаленного ключа с данными из Storage
 * @param {entities} entity - название ключа из Storage
 * @param {function} cb - коллбэк-функция, которая триггерится во время события
 */
StorageService.prototype.onRemove = function(entity, cb) {
    eventBus.listen(this[_getEventName](entity, 'deleted'), cb);
}