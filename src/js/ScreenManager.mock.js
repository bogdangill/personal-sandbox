import { descriptionService } from "./descriptionService";
import { SolutionService, solutionService } from "./solutionService";

export function ScreenManager() {
    this.ds = descriptionService;
    this.ss = new SolutionService();
}
ScreenManager.prototype.showComponent = function() {
    this.ss.renderCell();
    this.ss.init();
}
ScreenManager.prototype.hideComponent = function() {
    this.ss.destroyForm();
    this.ss.destroyCell();
}