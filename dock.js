import * as windowManager from "http://localhost:8888/files/window.js";

var dockButtonNewWindow = document.getElementById("dockButtonNewWindow");

export function initDock() {
    dockButtonNewWindow.addEventListener("click", () => {
        windowManager.createWindow("New Window", "#181818");
    });
}