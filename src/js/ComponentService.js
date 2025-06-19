import { InstanceManager } from "./InstanceManager";

export function ComponentService() {
    this.im = new InstanceManager();
}
ComponentService.prototype.registerInstances = function(view, controller) {
    this.im.register('view', view);
    this.im.register('controller', controller);
}
ComponentService.prototype.getController = function() {
    return this.im.get('controller');
}
ComponentService.prototype.clearInstances = function() {
    return this.im.clearAll();
}