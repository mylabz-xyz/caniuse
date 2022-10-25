import * as lite from "caniuse-lite";
export class CanIUseService {
  constructor() {
    console.log(lite.features);
  }

  public getFeature(feature: string) {}
}
