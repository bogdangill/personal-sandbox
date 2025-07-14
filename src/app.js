import './scss/styles.scss';
import 'highlight.js/scss/an-old-hope.scss';

//веб-компоненты Шнурков
import '@shoelace-style/shoelace/dist/components/divider/divider.js';

import { screenManager } from './js/screenManager';
import { StorageService } from './js/storageService';
import { themeService } from './js/themeService';
import { UIComponentFactory } from './js/UIComponentFactory';
import { ScreenManager } from './js/ScreenManager.mock';

document.addEventListener('DOMContentLoaded', () => {
    themeService.init();
    // const root = document.querySelector('#root');
    // const btnCreate = UIComponentFactory.createButton('primary', 'Создать компонент');
    // const btnDestroy = UIComponentFactory.createButton('danger', 'Удалить компонент');
    // root.append(btnCreate, btnDestroy);

    // const manager = new ScreenManager();

    // btnCreate.onclick = manager.showComponent.bind(manager);
    // btnDestroy.onclick = manager.hideComponent.bind(manager);
    
    // return;
    const storage = new StorageService();
    const currentTaskData = storage.get(storage.entities.CURRENT_TASK_DATA);

    if (currentTaskData) {
        screenManager.showResolvingStep(currentTaskData);
    } else {
        screenManager.showInitialStep();
    }
    storage.onCreate(storage.entities.CURRENT_TASK_DATA, () => {
        const data = storage.get(storage.entities.CURRENT_TASK_DATA);
        screenManager.showResolvingStep(data);
    });
    storage.onRemove(storage.entities.CURRENT_TASK_DATA, () => {
        screenManager.hideResolvingStep();
        screenManager.showInitialStep();
    });
});