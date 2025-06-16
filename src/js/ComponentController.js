export function ComponentController(view) {
    this.view = view;
}
ComponentController.prototype.init = function() {
    if (this.view) this.destroy();
    this.view.mount();
    this.bindEvents();
};
ComponentController.prototype.destroy = function() {
    if (!this.view) return;
    this.view.unmount();
};
ComponentController.prototype.bindEvents = function() {
    throw new Error('Метод bindEvents должен быть переопределён!');
};