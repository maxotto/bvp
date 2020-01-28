import _Vue from "vue";
import bvp from './bvp';

export function BvpPlugin(Vue: typeof _Vue, options: BvpPluginOptions): void {
  Vue.prototype.$bvp = new bvp(options.project, options.canvas);
}

export class BvpPluginOptions {
  project: string;
  canvas: HTMLCanvasElement;
}

