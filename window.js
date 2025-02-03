var currentWorkspace = 0;
var numberOfWorkspaces = 3;

var allWindows = []; // by workspace, by order

class Window {
    // public
    windowElement;
    windowContent;
    windowHeaderBar;

    windowResizeZone = {};

    minWidth = 100;   // Min width in pixels
    minHeight = 100;  // Min height in pixels

    // private
    state = "UP";
    x_down;
    y_down;

    x_offset;
    y_offset;

    width;
    height;

    deltaX;
    deltaY;

    resizeDown(event) {
        this.x_down = event.clientX;
        this.y_down = event.clientY;

        this.x_offset = parseInt(this.windowElement.style.left) || 0;
        this.y_offset = parseInt(this.windowElement.style.top) || 0;

        this.width = this.windowContent.offsetWidth;
        this.height = this.windowContent.offsetHeight;

        currentWindow = this.windowElement;

        setFocus(this.windowElement);
    }

    mouseQuit() {        
        setTimeout(() => {
            currentWindow = null;
            this.state = "UP";
            document.body.style.cursor = "default";
        }, 200);
    }

    resizeLeft() {
        const newWidth = Math.max(this.width - this.deltaX, this.minWidth);
        const newLeft = this.x_offset + this.width - newWidth;
        
        this.windowElement.style.left = `${newLeft}px`;
        this.windowContent.style.width = `${newWidth}px`;
    }

    resizeRight() {
        const newWidth = Math.max(this.width + this.deltaX, this.minWidth);
    
        this.windowContent.style.width = `${newWidth}px`;
    }

    resizeTop() {
        const newHeight = Math.max(this.height - this.deltaY, this.minHeight);
        const newTop = this.y_offset + this.height - newHeight;
        
        this.windowElement.style.top = `${newTop}px`;
        this.windowContent.style.height = `${newHeight}px`;
    }

    resizeBottom() {
        const newHeight = Math.max(this.height + this.deltaY, this.minHeight);

        this.windowContent.style.height = `${newHeight}px`;
    }

    constructor(title, color, workspace = currentWorkspace) {    
        this.windowElement = document.createElement("div");
        this.windowElement.classList.add("window");

        this.windowContent = document.createElement("div");
        this.windowContent.classList.add("window-content");
    
        this.windowHeaderBar = document.createElement("div");
        this.windowHeaderBar.classList.add("window-header-bar", "prevent-select");
        this.windowHeaderBar.textContent = title;
    
        this.windowContent.appendChild(this.windowHeaderBar);
        this.windowContent.style.backgroundColor = color;
    
        for (let s of ["top", "bottom", "left", "right"]) {
            this.windowResizeZone[s] = document.createElement("div");
            this.windowResizeZone[s].classList.add(`window-resize-zone-${s}`);

            this.windowResizeZone[s].addEventListener("mousedown", (event) => {
                console.log(s);

                this.resizeDown(event);
                this.state = "RESIZE_" + s.toUpperCase();
            });

            this.windowElement.appendChild(this.windowResizeZone[s]);
        }

        // Corners
        for (let tb of ["top", "bottom"]) {
            for (let lr of ["left", "right"]) {
                let s = `${tb}-${lr}`;
                let s_underscore = `${tb}_${lr}`;
                
                this.windowResizeZone[s] = document.createElement("div");
                this.windowResizeZone[s].classList.add(`window-resize-zone-${s}`);

                this.windowResizeZone[s].addEventListener("mousedown", (event) => {
                    console.log(s_underscore);

                    this.resizeDown(event);
                    this.state = "RESIZE_" + s_underscore.toUpperCase();
                });

                this.windowElement.appendChild(this.windowResizeZone[s]);
            }
        }

        this.windowElement.appendChild(this.windowContent);

        this.windowContent.addEventListener("mousedown", (event) => {
            this.x_down = event.clientX;
            this.y_down = event.clientY;
    
            this.x_offset = parseInt(this.windowElement.style.left) || 0;
            this.y_offset = parseInt(this.windowElement.style.top) || 0;
    
            this.state = "DOWN";
    
            currentWindow = this.windowElement;
            setFocus(this.windowElement);
        });    

        document.addEventListener("mousemove", (event) => {
            if (currentWindow == this.windowElement) {
                if (event.buttons != 1) {
                    this.mouseQuit();
                }
                if (this.state == "DOWN") {
                    this.windowElement.style.left = `${this.x_offset + (event.clientX - this.x_down)}px`;
                    this.windowElement.style.top = `${this.y_offset + (event.clientY - this.y_down)}px`;
                }
                else if (this.state.startsWith("RESIZE")) {
                    this.deltaX = event.clientX - this.x_down;
                    this.deltaY = event.clientY - this.y_down;

                    if (this.state == "RESIZE_LEFT") {
                        this.resizeLeft();
                        document.body.style.cursor = "w-resize";
                    }
                    else if (this.state == "RESIZE_RIGHT") {            
                        this.resizeRight();
                        document.body.style.cursor = "e-resize";
                    }
                    else if (this.state == "RESIZE_TOP") {          
                        this.resizeTop();  
                        document.body.style.cursor = "n-resize";
                    }
                    else if (this.state == "RESIZE_BOTTOM") {     
                        this.resizeBottom();       
                        document.body.style.cursor = "s-resize";
                    }
                    else if (this.state == "RESIZE_TOP_LEFT") {
                        this.resizeTop();
                        this.resizeLeft();
                        document.body.style.cursor = "nw-resize";
                    }
                    else if (this.state == "RESIZE_TOP_RIGHT") {
                        this.resizeTop();
                        this.resizeRight();
                        document.body.style.cursor = "ne-resize";
                    }
                    else if (this.state == "RESIZE_BOTTOM_LEFT") {
                        this.resizeBottom();
                        this.resizeLeft();
                        document.body.style.cursor = "sw-resize";
                    }
                    else if (this.state == "RESIZE_BOTTOM_RIGHT") {
                        this.resizeBottom();
                        this.resizeRight();
                        document.body.style.cursor = "se-resize";
                    }
                }
            }
        });

        document.addEventListener("mouseup", (event) => {
            this.mouseQuit();
        });
    
        document.addEventListener("mouseleave", (event) => {
            this.mouseQuit();
        });
    
        if (workspace != currentWorkspace) {
            hideWindow(this.windowElement);
        }
        
        document.body.appendChild(this.windowElement);
        allWindows[workspace].push(this.windowElement);
    
        setFocus(this.windowElement);
    }
}

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

export function createWindow(title, color, workspace = currentWorkspace) {
    return new Window(title, color, workspace);
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