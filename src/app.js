import './scss/styles.scss';
import 'highlight.js/scss/an-old-hope.scss';

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

import { screenManager } from './js/screenManager';
import { storageEntities, storageManager } from './js/storageService';
import { themeService } from './js/themeService';
import { UIComponentFactory } from './js/UIComponentFactory';
import { ScreenManager } from './js/ScreenManager.mock';

document.addEventListener('DOMContentLoaded', () => {
    themeService.init();
    const root = document.querySelector('#root');
    const btnCreate = UIComponentFactory.createButton('primary', 'Создать компонент');
    const btnDestroy = UIComponentFactory.createButton('danger', 'Удалить компонент');
    root.append(btnCreate, btnDestroy);

    const manager = new ScreenManager();

    btnCreate.onclick = manager.showComponent.bind(manager);
    btnDestroy.onclick = manager.hideComponent.bind(manager);
    
    return;
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