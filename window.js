var allWindows = []; // by order

var window1 = createWindow("Hello", "#181818")
var window2 = createWindow("World", "#181818");
var window3 = createWindow("Dark", "#181818");

resetOrder();

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

function createWindow(title, color) {
    let window = document.createElement("div");
    window.classList.add("window");

    let windowHeaderBar = document.createElement("div");
    windowHeaderBar.classList.add("window-header-bar", "prevent-select");
    windowHeaderBar.textContent = title;

    window.appendChild(windowHeaderBar);
    window.style.backgroundColor = color;
    
    setWindowEvent(window);

    document.body.appendChild(window);
    allWindows.push(window);
    
    return window;
}

function setFocus(window) {
    allWindows.splice(allWindows.indexOf(window), 1);
    allWindows.push(window);

    console.log(allWindows);

    resetOrder();
}

function resetOrder() {
    for (let i = 0; i < allWindows.length; ++i) {
        allWindows[i].style.zIndex = `${100 + i}`
    }
}