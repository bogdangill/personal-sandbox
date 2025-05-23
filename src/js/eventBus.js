/**
 * Диспетчер для кастомных событий. Помогает организовать взаимодействие между разными сущностями через кастомные события на глобальном объекте window.
 * @abstract
 */
export const eventBus = {
    dispatch(name, detail = {}) {
        window.dispatchEvent(new CustomEvent(name, { detail }));
    },
    listen(name, callback) {
        window.addEventListener(name, callback);
    },
    remove(name, callback) {
        window.removeEventListener(name, callback);
    }
};