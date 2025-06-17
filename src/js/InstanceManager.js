/**
 * Менеджер для хранения и управления экземплярами классов.
 * @constructor
 */
export function InstanceManager() {
    this._instances = {};
}
/**
 * Регистрирует экземпляр по ключу.
 * @param {string} key - Ключ для доступа
 * @param {object} instance - Экземпляр объекта
 */
InstanceManager.prototype.register = function(key, instance) {
    this._instances[key] = instance;
}
/**
 * Возвращает экземпляр по ключу.
 * @param {string} key
 * @returns {object|null}
 */
InstanceManager.prototype.get = function(key) {
    return this._instances[key] || null;
}
/**
 * Удаляет экземпляр по ключу.
 * @param {string} key
 */
InstanceManager.prototype.unregister = function(key) {
    delete this._instances[key];
}
/**
 * Очищает все зарегистрированные экземпляры.
 */
InstanceManager.prototype.clearAll = function() {
    this._instances = {};
}