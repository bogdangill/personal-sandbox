import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip';

const STORAGE_THEME_KEY = 'is-dark-theme';
const DARK_THEME_CLASS = 'sl-theme-dark';

function switchDarkTheme() {
    if (localStorage.getItem(STORAGE_THEME_KEY)) {
        document.documentElement.classList.remove(DARK_THEME_CLASS);
        localStorage.removeItem(STORAGE_THEME_KEY);
    } else {
        document.documentElement.classList.add(DARK_THEME_CLASS);
        localStorage.setItem(STORAGE_THEME_KEY, true);
    }
}

export function definePreferedTheme() {
    if (window.matchMedia('(prefers-color-scheme:dark)')?.matches) {
        localStorage.setItem(STORAGE_THEME_KEY, true);
        document.documentElement.classList.add(DARK_THEME_CLASS);
    }
}

export function renderThemeSwitcher() {
    const themeSwitcherContainer = document.getElementById('theme-switcher');
    const switchIcon = () => localStorage.getItem(STORAGE_THEME_KEY) ? 'cloud-sun' : 'cloud-moon';
    const switchHint = () => localStorage.getItem(STORAGE_THEME_KEY) ? 'Включить светлую тему' : 'Включить темную тему';

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