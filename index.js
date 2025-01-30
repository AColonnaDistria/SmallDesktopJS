import * as windowManager from "http://localhost:8888/files/window.js";
import * as dock from "http://localhost:8888/files/dock.js";

init();

var window1 = windowManager.createWindow("Window1", "transparent")
var window2 = windowManager.createWindow("Window2", "green");
var window3 = windowManager.createWindow("Window3", "orange");
var window4 = windowManager.createWindow("Window4", "red", 1);

function init() {
    windowManager.initWindows();
    dock.initDock();
}
