import path from "node:path";

import {app, BrowserWindow, globalShortcut} from "electron";
import constants from "shared:constants.js";

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
        },
    });

    window.loadFile(path.resolve("dist", "page", "assets", "index.html"));
};

function getWindow() {
    return BrowserWindow.getAllWindows()[0];
}

function sendEvent(channel: string, ...args: unknown[]) {
    getWindow().webContents.send(channel, ...args);
}

app.whenReady().then(() => {
    createWindow();

    globalShortcut.register("MediaPreviousTrack", () => {
        sendEvent(constants.EVENTS.KEY.LOOKINGGLASS, "previous");
    });

    globalShortcut.register("MediaNextTrack", () => {
        sendEvent(constants.EVENTS.KEY.LOOKINGGLASS, "next");
    });

    globalShortcut.register("MediaPlayPause", () => {
        sendEvent(constants.EVENTS.KEY.LOOKINGGLASS, "reset");
    });

    setInterval(() => {
        console.log("Emitting test");
        getWindow().webContents?.send("test", "arg1");
    }, 1000);

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
    globalShortcut.unregister("MediaTrackPrevious");
});
