import { DescriptionService } from "./descriptionService";
import { SolutionService } from "./solutionService";

export function ScreenManager() {
    this.ds = new DescriptionService();
    this.ss = new SolutionService();
}
ScreenManager.prototype.showComponent = function() {
    this.ss.renderCell();
    this.ss.initForm();
}
ScreenManager.prototype.hideComponent = function() {
    this.ss.destroyForm();
    this.ss.destroyCell();
}