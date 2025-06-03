import './scss/styles.scss';
import 'highlight.js/scss/an-old-hope.scss';

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

import { definePreferedTheme, renderThemeSwitcher } from './js/theme.js';
import { screenManager } from './js/screenManager';
import { storageEntities, storageManager } from './js/storageService';

document.addEventListener('DOMContentLoaded', () => {
    definePreferedTheme();
    renderThemeSwitcher();

    const taskDescriptionData = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);

    if (taskDescriptionData) {
        screenManager.showResolvingStep(taskDescriptionData);
    } else {
        screenManager.showInitialStep();
    }

    storageManager.onUpdate(storageEntities.DESCRIPTION_FORM_DATA, () => {
        const data = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);

        if (data) {
            screenManager.showResolvingStep(data);
        }
    })
});