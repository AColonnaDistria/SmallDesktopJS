var currentWorkspace = 0;
var numberOfWorkspaces = 3;

var allWindows = []; // by workspace, by order

export function initWindows() {
    initWindowsStack();
    resetOrder();
}

function initWindowsStack() {
    for (let workspace = 0; workspace < numberOfWorkspaces; ++workspace) {
        allWindows.push([])
        createWorkspaceIndicator(workspace);
    }
}

var currentWindowsDragged = null;
var currentWindowsResized = null;

export function createWindow(title, color, workspace = currentWorkspace) {
    let window = document.createElement("div");
    window.classList.add("window");

    let windowContent = document.createElement("div");
    windowContent.classList.add("window-content");

    let windowResizeZoneTop = document.createElement("div");
    windowResizeZoneTop.classList.add("window-resize-zone-top");

    let windowResizeZoneBottom = document.createElement("div");
    windowResizeZoneBottom.classList.add("window-resize-zone-bottom");

    let windowResizeZoneLeft = document.createElement("div");
    windowResizeZoneLeft.classList.add("window-resize-zone-left");

    let windowResizeZoneRight = document.createElement("div");
    windowResizeZoneRight.classList.add("window-resize-zone-right");

    let windowResizeZoneTopLeftCorner = document.createElement("div");
    windowResizeZoneTopLeftCorner.classList.add("window-resize-zone-top-left-corner");

    let windowResizeZoneTopRightCorner = document.createElement("div");
    windowResizeZoneTopRightCorner.classList.add("window-resize-zone-top-right-corner");

    let windowResizeZoneBottomLeftCorner = document.createElement("div");
    windowResizeZoneBottomLeftCorner.classList.add("window-resize-zone-bottom-left-corner");

    let windowResizeZoneBottomRightCorner = document.createElement("div");
    windowResizeZoneBottomRightCorner.classList.add("window-resize-zone-bottom-right-corner");

    let windowHeaderBar = document.createElement("div");
    windowHeaderBar.classList.add("window-header-bar", "prevent-select");
    windowHeaderBar.textContent = title;

    windowContent.appendChild(windowHeaderBar);
    windowContent.style.backgroundColor = color;

    // Events

    let state = "UP";
    let x_down;
    let y_down;

    let x_offset;
    let y_offset;

    let width;
    let height;

    // Left event
    windowResizeZoneLeft.addEventListener("mousedown", (event) => {
        console.log("left");
        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        width = windowContent.offsetWidth;
        height = windowContent.offsetHeight;

        state = "RESIZE_LEFT";

        currentWindowsResized = window;
        setFocus(window);
    });

    windowResizeZoneRight.addEventListener("mousedown", (event) => {
        console.log("right");
        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        width = windowContent.offsetWidth;
        height = windowContent.offsetHeight;

        state = "RESIZE_RIGHT";

        currentWindowsResized = window;
        setFocus(window);
    });

    windowResizeZoneTop.addEventListener("mousedown", (event) => {
        console.log("top");
        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        width = windowContent.offsetWidth;
        height = windowContent.offsetHeight;

        state = "RESIZE_TOP";

        currentWindowsResized = window;
        setFocus(window);
    });

    windowResizeZoneBottom.addEventListener("mousedown", (event) => {
        console.log("bottom");
        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        width = windowContent.offsetWidth;
        height = windowContent.offsetHeight;

        state = "RESIZE_BOTTOM";

        currentWindowsResized = window;
        setFocus(window);
    });

    windowContent.addEventListener("mousedown", (event) => {
        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        state = "DOWN";

        currentWindowsDragged = window;
        setFocus(window);
    });

    document.addEventListener("mousemove", (event) => {
        if (state == "DOWN" && currentWindowsDragged == window) {
            window.style.left = `${x_offset + (event.clientX - x_down)}px`;
            window.style.top = `${y_offset + (event.clientY - y_down)}px`;
        }
        else if (state == "RESIZE_LEFT" && currentWindowsResized == window) {
            const deltaX = event.clientX - x_down; // Change in mouse X position
            const newLeft = x_offset + deltaX;
            const newWidth = width - deltaX;
            
            window.style.left = `${newLeft}px`;
            windowContent.style.width = `${newWidth}px`;
        }
        else if (state == "RESIZE_RIGHT" && currentWindowsResized == window) {
            const deltaX = event.clientX - x_down; // Change in mouse X position
            const newWidth = width + deltaX;
            
            windowContent.style.width = `${newWidth}px`;
        }
        else if (state == "RESIZE_TOP" && currentWindowsResized == window) {
            const deltaY = event.clientY - y_down; // Change in mouse X position
            const newTop = y_offset + deltaY;
            const newHeight = height - deltaY;
            
            window.style.top = `${newTop}px`;
            windowContent.style.height = `${newHeight}px`;
        }
        else if (state == "RESIZE_BOTTOM" && currentWindowsResized == window) {
            const deltaY = event.clientY - y_down; // Change in mouse X position
            const newHeight = height + deltaY;

            windowContent.style.height = `${newHeight}px`;
        }
    });

    document.addEventListener("mouseup", (event) => {
        setTimeout(() => {
            currentWindowsDragged = null;
            state = "UP";
        }, 200);
    });

    document.addEventListener("mouseleave", (event) => {
        setTimeout(() => {
            currentWindowsDragged = null;
            state = "UP";
        }, 200);
    });

    if (workspace != currentWorkspace) {
        hideWindow(window);
    }
    
    window.appendChild(windowResizeZoneTop);
    window.appendChild(windowResizeZoneBottom);
    window.appendChild(windowResizeZoneLeft);
    window.appendChild(windowResizeZoneRight);

    window.appendChild(windowResizeZoneTopLeftCorner);
    window.appendChild(windowResizeZoneTopRightCorner);
    window.appendChild(windowResizeZoneBottomLeftCorner);
    window.appendChild(windowResizeZoneBottomRightCorner);

    window.appendChild(windowContent);

    document.body.appendChild(window);
    allWindows[workspace].push(window);

    setFocus(window);
    
    return window;
}

function createWorkspaceIndicator(number) {
    let workspaceIndicator = document.createElement("button");
    workspaceIndicator.classList.add("workspace-indicator");
    workspaceIndicator.textContent = `${number + 1}`;

    workspaceIndicator.addEventListener("click", () => {
        console.log(number);
        changeWorkspace(number);
    });

    document.getElementsByClassName("workspace-indicators-group")[0].appendChild(workspaceIndicator);

    return workspaceIndicator;
}

function hideWindow(window) {
    window.style.visibility = "hidden";
}

function showWindow(window) {
    window.style.visibility = "visible";
}

export function changeWorkspace(newWorkspace) {
    for (let window of allWindows[currentWorkspace]) {
        hideWindow(window);
    }
    for (let window of allWindows[newWorkspace]) {
        showWindow(window);
    }
    currentWorkspace = newWorkspace;
}

function setFocus(window) {
    allWindows[currentWorkspace].splice(allWindows[currentWorkspace].indexOf(window), 1);
    allWindows[currentWorkspace].push(window);

    console.log(allWindows[currentWorkspace]);

    resetOrder();
}

function resetOrder() {
    for (let i = 0; i < allWindows[currentWorkspace].length; ++i) {
        allWindows[currentWorkspace][i].style.zIndex = `${100 + 2 * i}`
    }
}