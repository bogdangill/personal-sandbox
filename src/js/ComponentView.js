export function ComponentView(parentSelector, root, ...elements) {
    this.parentSelector = parentSelector;
    this.root = root;
    this.elements = elements;

    let _mountState = false;

    this.getMountState = () => {
        return _mountState;
    };
    this.isMounted = (state) => {
        _mountState = state;
    };
}
ComponentView.prototype.mount = function() {
    const isMounted = this.getMountState();
    if (isMounted) return;
    const container = document.querySelector(this.parentSelector);
    this.appendChildren();
    container.append(this.root);
    this.isMounted(true);
}
ComponentView.prototype.unmount = function() {
    const isMounted = this.getMountState();
    if (!isMounted) return;
    this.root.remove();
    this.isMounted(false);
}
ComponentView.prototype.appendChildren = function() {
    this.elements.forEach(el => this.root.append(el));
}