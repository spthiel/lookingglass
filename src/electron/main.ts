import {app, BrowserWindow, globalShortcut} from "electron";
import path from "node:path";

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
    });

    window.loadFile(path.resolve("dist", "page", "assets", "index.html"));
};

app.whenReady().then(() => {
    createWindow();

    globalShortcut.register("MediaPreviousTrack", () => {
        console.log("Key pressered prev");
    });

    globalShortcut.register("MediaNextTrack", () => {
        console.log("Key pressered next");
    });

    globalShortcut.register("MediaPlayPause", () => {
        console.log("Key pressered pause");
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
    globalShortcut.unregister("MediaTrackPrevious");
});
