import './scss/styles.scss';
import 'highlight.js/scss/an-old-hope.scss';

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

import { definePreferedTheme, renderThemeSwitcher } from './js/theme.js';
import { formManager } from './js/formManager';

document.addEventListener('DOMContentLoaded', () => {
    definePreferedTheme();
    renderThemeSwitcher();
    formManager.manage();
});