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

var currentWindow = null;

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

    function resizeDown(event) {
        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        width = windowContent.offsetWidth;
        height = windowContent.offsetHeight;

        currentWindow = window;

        setFocus(window);
    }

    function mouseQuit() {        
        setTimeout(() => {
            currentWindow = null;
            state = "UP";
        }, 200);
    }

    // Left event
    windowResizeZoneLeft.addEventListener("mousedown", (event) => {
        console.log("left");

        resizeDown(event);
        state = "RESIZE_LEFT";
    });

    windowResizeZoneRight.addEventListener("mousedown", (event) => {
        console.log("right");
       
        resizeDown(event);
        state = "RESIZE_RIGHT";
    });

    windowResizeZoneTop.addEventListener("mousedown", (event) => {
        console.log("top");
        
        resizeDown(event);
        state = "RESIZE_TOP";
    });

    windowResizeZoneBottom.addEventListener("mousedown", (event) => {
        console.log("bottom");
        
        resizeDown(event);
        state = "RESIZE_BOTTOM";
    });

    // Corners
    windowResizeZoneTopLeftCorner.addEventListener("mousedown", (event) => {
        console.log("top-left");
        
        resizeDown(event);
        state = "RESIZE_TOP_LEFT";
    });

    windowResizeZoneTopRightCorner.addEventListener("mousedown", (event) => {
        console.log("top-right");
        
        resizeDown(event);
        state = "RESIZE_TOP_RIGHT";
    });

    windowResizeZoneBottomLeftCorner.addEventListener("mousedown", (event) => {
        console.log("bottom-left");
        
        resizeDown(event);
        state = "RESIZE_BOTTOM_LEFT";
    });

    windowResizeZoneBottomRightCorner.addEventListener("mousedown", (event) => {
        console.log("bottom-right");
        
        resizeDown(event);
        state = "RESIZE_BOTTOM_RIGHT";
    });

    windowContent.addEventListener("mousedown", (event) => {
        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        state = "DOWN";

        currentWindow = window;
        setFocus(window);
    });

    document.addEventListener("mousemove", (event) => {
        if (currentWindow == window) {
            if (event.buttons != 1) {
                mouseQuit();
            }
            if (state == "DOWN") {
                window.style.left = `${x_offset + (event.clientX - x_down)}px`;
                window.style.top = `${y_offset + (event.clientY - y_down)}px`;
            }
            else if (state.startsWith("RESIZE")) {
                const deltaX = event.clientX - x_down;
                const deltaY = event.clientY - y_down;

                function resizeLeft() {
                    const newLeft = x_offset + deltaX;
                    const newWidth = width - deltaX;
                    
                    window.style.left = `${newLeft}px`;
                    windowContent.style.width = `${newWidth}px`;
                }

                function resizeRight() {
                    const newWidth = width + deltaX;
                
                    windowContent.style.width = `${newWidth}px`;
                }

                function resizeTop() {
                    const newTop = y_offset + deltaY;
                    const newHeight = height - deltaY;
                    
                    window.style.top = `${newTop}px`;
                    windowContent.style.height = `${newHeight}px`;
                }

                function resizeBottom() {
                    const newHeight = height + deltaY;
    
                    windowContent.style.height = `${newHeight}px`;
                }
    
                if (state == "RESIZE_LEFT") {
                    resizeLeft();
                }
                else if (state == "RESIZE_RIGHT") {            
                    resizeRight();
                }
                else if (state == "RESIZE_TOP") {          
                    resizeTop();  
                }
                else if (state == "RESIZE_BOTTOM") {     
                    resizeBottom();       
                }
                else if (state == "RESIZE_TOP_LEFT") {
                    resizeTop();
                    resizeLeft();
                }
                else if (state == "RESIZE_TOP_RIGHT") {
                    resizeTop();
                    resizeRight();
                }
                else if (state == "RESIZE_BOTTOM_LEFT") {
                    resizeBottom();
                    resizeLeft();
                }
                else if (state == "RESIZE_BOTTOM_RIGHT") {
                    resizeBottom();
                    resizeRight();
                }
            }
        }
    });

    document.addEventListener("mouseup", (event) => {
        mouseQuit();
    });

    document.addEventListener("mouseleave", (event) => {
        mouseQuit();
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