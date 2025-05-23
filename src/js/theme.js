import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip';
import { storageEntities, storageManager } from './storage';

const THEME_CLASS_DARK = 'sl-theme-dark';

function switchDarkTheme() {
    if (storageManager.get(storageEntities.CURRENT_THEME) === 'dark') {
        document.documentElement.classList.remove(THEME_CLASS_DARK);
        storageManager.set(storageEntities.CURRENT_THEME, 'light');
    } else {
        document.documentElement.classList.add(THEME_CLASS_DARK);
        storageManager.set(storageEntities.CURRENT_THEME, 'dark');
    }
}

export function definePreferedTheme() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme:dark)')?.matches;
    const currentTheme = storageManager.get(storageEntities.CURRENT_THEME);

    if (currentTheme === 'dark') {
        document.documentElement.classList.add(THEME_CLASS_DARK);
    }

    if (prefersDarkMode) {
        storageManager.set(storageEntities.PREFERED_THEME, 'dark');
    } else {
        storageManager.set(storageEntities.PREFERED_THEME, 'light');
    }

    if (prefersDarkMode && !currentTheme) {
        storageManager.set(storageEntities.CURRENT_THEME, 'dark');
        document.documentElement.classList.add(THEME_CLASS_DARK);
    }
}

export function renderThemeSwitcher() {
    const themeSwitcherContainer = document.getElementById('theme-switcher');
    
    const isThemeDark = () => storageManager.get(storageEntities.CURRENT_THEME) === 'dark';
    const switchIcon = () => isThemeDark() ? 'cloud-sun' : 'cloud-moon';
    const switchHint = () => isThemeDark() ? 'Включить светлую тему' : 'Включить темную тему';

    const themeSwitcherTooltip = Object.assign(document.createElement('sl-tooltip'),
        {
            content: switchHint(),
            placement: 'right'
        }
    );
    const themeSwitcherIcon = Object.assign(document.createElement('sl-icon'), 
        {
            name: switchIcon(),
            label: 'Сменить тему'
        }
    );
    const themeSwitcherButton = Object.assign(document.createElement('sl-button'),
        {
            circle: true,
            size: 'medium'
        }
    );

    themeSwitcherContainer.append(themeSwitcherTooltip);
    themeSwitcherTooltip.append(themeSwitcherButton);
    themeSwitcherButton.append(themeSwitcherIcon);
    
    themeSwitcherButton.addEventListener('click', () => {
        switchDarkTheme();
        themeSwitcherIcon.name = switchIcon();
        themeSwitcherTooltip.content = switchHint();
    })
}