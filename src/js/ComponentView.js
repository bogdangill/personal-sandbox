export function ComponentView(root, ...elements) {
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

ComponentView.prototype = {
    constructor: ComponentView,
    mount(containerSelector) {
        const isMounted = this.getMountState();
        if (isMounted) return;
        const container = document.querySelector(containerSelector);
        this.appendChildren();
        container.append(this.root);
        this.isMounted(true);
    },
    unmount() {
        const isMounted = this.getMountState();
        if (!isMounted) return;
        this.root.remove();
        this.isMounted(false);
    },
    appendChildren() {
        this.elements.forEach(el => this.root.append(el));
    },
}