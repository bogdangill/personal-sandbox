import { descriptionService } from './descriptionService';
import { solutionService } from './solutionService';

export const screenManager = {
    _ds: descriptionService,
    _ss: solutionService,
    _currentStep: 0,

    showInitialStep() {
        this._ds.renderDescriptionCell();
        this._ds.initForm();

        this._currentStep++;
    },
    showResolvingStep(data) {
        this._ds.destroyForm();
        if (this._currentStep) this._ds.destroyCell();

        this._ds.renderDescriptionCell(true);
        this._ds.renderView(data);

        this._ss.renderSolutionCell();
        this._ss.initForm(data);
    },
    hideResolvingStep() {
        this._ss.destroyForm();
        this._ss.destroyCell();
        this._ds.destroyCell();
    },
    showFinalStep(data) {
        this._ss.destroyForm();
        this._ss.renderSolutionCell();
        this._ss.renderView(data);
    },
}