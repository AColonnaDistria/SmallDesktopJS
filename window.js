var currentWorkspace = 0;
var numberOfWorkspaces = 3;

var allWindows = []; // by workspace, by order
initWindowsStack();

var window1 = createWindow("Hello", "#181818")
var window2 = createWindow("World", "#181818");
var window3 = createWindow("Dark", "#181818");
var window4 = createWindow("Workspace2", "red", 1);

resetOrder();

function initWindowsStack() {
    for (let workspace = 0; workspace < numberOfWorkspaces; ++workspace) {
        allWindows.push([])
        createWorkspaceIndicator(workspace);
    }
}

function setWindowEvent(window) {
    let state = "UP";
    let x_down;
    let y_down;

    let x_offset;
    let y_offset;

    window.addEventListener("mousedown", (event) => {
        state = "DOWN";

        x_down = event.clientX;
        y_down = event.clientY;

        x_offset = parseInt(window.style.left) || 0;
        y_offset = parseInt(window.style.top) || 0;

        setFocus(window);
    });

    window.addEventListener("mousemove", (event) => {
        if (state == "DOWN") {
            console.log("move");
            window.style.left = `${x_offset + (event.clientX - x_down)}px`;
            window.style.top = `${y_offset + (event.clientY - y_down)}px`;
        }
    });

    document.addEventListener("mouseup", (event) => {
        state = "UP";
    });

    document.addEventListener("mouseleave", (event) => {
        state = "UP";
    });
}

function createWindow(title, color, workspace = currentWorkspace) {
    let window = document.createElement("div");
    window.classList.add("window");

    let windowHeaderBar = document.createElement("div");
    windowHeaderBar.classList.add("window-header-bar", "prevent-select");
    windowHeaderBar.textContent = title;

    window.appendChild(windowHeaderBar);
    window.style.backgroundColor = color;

    if (workspace != currentWorkspace) {
        hideWindow(window);
    }
    
    setWindowEvent(window);

    document.body.appendChild(window);
    allWindows[workspace].push(window);
    
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

function changeWorkspace(newWorkspace) {
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
        allWindows[currentWorkspace][i].style.zIndex = `${100 + i}`
    }
}