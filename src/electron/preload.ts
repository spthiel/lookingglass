import {contextBridge, ipcRenderer} from "electron/renderer";
import constants from "shared:constants.js";

contextBridge.exposeInMainWorld("electronAPI", {
    onLookingGlassKey: (fn: (key: string) => void) =>
        ipcRenderer.on(constants.EVENTS.KEY.LOOKINGGLASS, (_event, [key]) => fn(key)),
});
