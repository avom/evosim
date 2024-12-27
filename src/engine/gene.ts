import { Settings } from "./settings";

export class Gene {

  private activeness = 0;

  mutate() {
    this.activeness = (this.activeness + 1) * Settings.bugs.genes.mutation.factor - 1;
  }
}