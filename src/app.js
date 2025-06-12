import './scss/styles.scss';
import 'highlight.js/scss/an-old-hope.scss';

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

import { screenManager } from './js/screenManager';
import { storageEntities, storageManager } from './js/storageService';
import { themeService } from './js/themeService';

document.addEventListener('DOMContentLoaded', () => {
    themeService.init();
    const taskDescriptionData = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);
    const currentTaskData = storageManager.get(storageEntities.CURRENT_TASK_DATA);

    if (taskDescriptionData) {
        screenManager.showResolvingStep(taskDescriptionData);
    } else if (currentTaskData) {
        screenManager.showResolvingStep(currentTaskData);
    } else {
        screenManager.showInitialStep();
    }

    storageManager.onUpdate(storageEntities.DESCRIPTION_FORM_DATA, () => {
        const data = storageManager.get(storageEntities.DESCRIPTION_FORM_DATA);

        if (data) {
            screenManager.showResolvingStep(data);
        }
    });
    storageManager.onRemove(storageEntities.DESCRIPTION_FORM_DATA, () => {
        screenManager.hideResolvingStep();
        screenManager.showInitialStep();
    });
});