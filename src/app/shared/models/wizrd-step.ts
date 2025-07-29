
export interface WizardStep {

  validate(): boolean;

  saveData(): void;

  loadData(): void;
}
