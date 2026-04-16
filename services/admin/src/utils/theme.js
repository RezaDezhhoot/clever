import { nextTick } from "vue";

export async function bootDemoTheme() {
  await nextTick();

  if (window.KTApp && typeof window.KTApp.init === "function") {
    window.KTApp.init();
  }
}
