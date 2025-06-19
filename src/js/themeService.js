import { Compartment } from "@codemirror/state";
import { UIComponentFactory } from "./UIComponentFactory";
import { storageEntities, storageManager } from "./storageService";
import { barf, tomorrow } from "thememirror";
import { eventBus } from "./eventBus";

const themeSwitcherData = Object.freeze({
    'dark': {
        tooltipText: 'Включить темную тему',
        iconName: 'cloud-moon'
    },
    'light': {
        tooltipText: 'Включить светлую тему',
        iconName: 'cloud-sun'
    },
});
const themeServiceData = Object.freeze({
    classDark: 'sl-theme-dark',
    keyDark: 'dark',
    keyLight: 'light',
});

const themeSwitcherView = {
    tooltip: UIComponentFactory.createTooltip(null, 'right'),
    icon: UIComponentFactory.createIcon(null, 'Сменить тему'),
    button: UIComponentFactory.createIconButton(),
    _isMounted: null,

    mount(containerSelector) {
        const container = document.querySelector(containerSelector);
        this._appendChildren();
        container.append(this.tooltip);
    },
    unmount() {
        if (!this._isMounted) return;
        this.tooltip.remove();
        this._isMounted = false;
    },
    _appendChildren() {
        if (this._isMounted) return;
        this.button.append(this.icon);
        this.tooltip.append(this.button);
        this._isMounted = true;
    },
}

const toggleState = (key) => {
    const {keyDark, keyLight} = themeServiceData;
    return key === keyDark ? keyLight : keyDark;
}

const themeSwitcherController = {
    elem: themeSwitcherView,

    init(selector) {
        this.elem.mount(selector);
    },
    updateState(key) {
        const state = toggleState(key);
        this.elem.tooltip.content = themeSwitcherData[state].tooltipText;
        this.elem.icon.name = themeSwitcherData[state].iconName;
    },
    onSwitching(cb) {
        this.elem.button.addEventListener('click', cb);
    }
}

export const themeService = {
    editorTheme: new Compartment(),
    _sm: storageManager,
    _eb: eventBus,
    _switcherController: themeSwitcherController,
    _editorView: null,

    init() {
        this._switcherController.init('#theme-switcher');
        const current = this._getCurrentKey();
        const themeState = current || this._getSystemPrefered(); 

        if (!current) {
            this._applySystemPrefered();
        } else {
            this._setCurrentClass(current);
        }

        this._switcherController.updateState(themeState);

        this._switcherController.onSwitching(() => {
            const currentTheme = this._sm.get(storageEntities.CURRENT_THEME);
            const newTheme = toggleState(currentTheme);

            this._setCurrentKey(newTheme);
            this._setCurrentClass(newTheme);
            this._switcherController.updateState(newTheme);
            this._setEditorTheme(newTheme);
        });
    },
    setEditorView(view) {
        this._editorView = view;
        const currentTheme = this._getCurrentKey() || this._getSystemPrefered();
        this._setEditorTheme(currentTheme);
    }, 
    _setCurrentClass(key) {
        if (key === themeServiceData.keyDark) {
            document.documentElement.classList.add(themeServiceData.classDark);
        } else {
            document.documentElement.classList.remove(themeServiceData.classDark);
        }
    },
    _setEditorTheme(key) {
        if (!this._editorView) return;

        const theme = key === themeServiceData.keyDark ? barf : tomorrow;
        this._editorView.dispatch({
            effects: this.editorTheme.reconfigure(theme)
        });
    },
    _setCurrentKey(theme) {
        if (theme === themeServiceData.keyDark) {
            this._sm.set(storageEntities.CURRENT_THEME, themeServiceData.keyDark, false);
        } else {
            this._sm.set(storageEntities.CURRENT_THEME, themeServiceData.keyLight, false);
        }
    },
    _getCurrentKey() {
        return this._sm.get(storageEntities.CURRENT_THEME);
    },
    _getSystemPrefered() {
        return window.matchMedia('(prefers-color-scheme:dark)').matches ? themeServiceData.keyDark : themeServiceData.keyLight;
    },
    _applySystemPrefered() {
        const systemPrefered = this._getSystemPrefered();

        if (systemPrefered === themeServiceData.keyDark) {
            this._setCurrentKey(themeServiceData.keyDark);
            this._setCurrentClass(themeServiceData.keyDark);
        }
    },
}