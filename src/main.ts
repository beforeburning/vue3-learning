import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as buffer from "buffer";

if (typeof (window as any).global === "undefined") {
    (window as any).global = window;
}
if (typeof (window as any).Buffer === "undefined") {
    (window as any).Buffer = buffer.Buffer;
}

createApp(App).use(store).use(router).mount("#app");
