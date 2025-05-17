import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip';

const THEME_KEY_PREFERED = 'prefered-theme';
const THEME_KEY_CURRENT = 'current-theme';
const THEME_CLASS_DARK = 'sl-theme-dark';

function switchDarkTheme() {
    if (localStorage.getItem(THEME_KEY_CURRENT) === 'dark') {
        document.documentElement.classList.remove(THEME_CLASS_DARK);
        localStorage.setItem(THEME_KEY_CURRENT, 'light');
    } else {
        document.documentElement.classList.add(THEME_CLASS_DARK);
        localStorage.setItem(THEME_KEY_CURRENT, 'dark');
    }
}

export function definePreferedTheme() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme:dark)')?.matches;
    const currentTheme = localStorage.getItem(THEME_KEY_CURRENT);

    if (currentTheme === 'dark') {
        document.documentElement.classList.add(THEME_CLASS_DARK);
    }

    if (prefersDarkMode) {
        localStorage.setItem(THEME_KEY_PREFERED, 'dark');
    } else {
        localStorage.setItem(THEME_KEY_PREFERED, 'light');
    }

    if (prefersDarkMode && !currentTheme) {
        localStorage.setItem(THEME_KEY_CURRENT, 'dark');
        document.documentElement.classList.add(THEME_CLASS_DARK);
    }
}

export function renderThemeSwitcher() {
    const themeSwitcherContainer = document.getElementById('theme-switcher');
    const isThemeDark = localStorage.getItem(THEME_KEY_CURRENT) === 'dark';
    
    const switchIcon = () => isThemeDark ? 'cloud-sun' : 'cloud-moon';
    const switchHint = () => isThemeDark ? 'Включить светлую тему' : 'Включить темную тему';

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