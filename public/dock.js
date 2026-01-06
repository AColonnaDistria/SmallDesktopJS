import * as windowManager from "/window.js";

var dockButtonNewWindow = document.getElementById("dockButtonNewWindow");

export function initDock() {
    dockButtonNewWindow.addEventListener("click", () => {
        windowManager.createWindow("New Window", "#181818");
    });
}
