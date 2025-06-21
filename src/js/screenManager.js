import { DescriptionService } from './descriptionService';
import { SolutionService } from './solutionService';

export const screenManager = {
    _ds: new DescriptionService(),
    _ss: new SolutionService(),
    _currentStep: 0,

    showInitialStep() {
        this._ds.renderCell();
        this._ds.initForm();

        this._currentStep++;
    },
    showResolvingStep(data) {
        this._ds.destroyForm();
        if (this._currentStep) this._ds.destroyCell();

        this._ds.renderCell(true);
        this._ds.renderView(data);

        this._ss.renderCell();
        this._ss.initForm(data);
    },
    hideResolvingStep() {
        this._ss.destroyForm();
        this._ss.destroyCell();
        this._ds.destroyCell();
    },
    showFinalStep(data) {
        this._ss.destroyForm();
        this._ss.renderCell();
        this._ss.renderView(data);
    },
}