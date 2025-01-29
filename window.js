var allWindows = []; // by order

var window1 = document.getElementById("window1");
var window2 = document.getElementById("window2");

allWindows.push(window1);
allWindows.push(window2);

window1.style.backgroundColor = "red";
window2.style.backgroundColor = "blue";

resetWindowOrder();
setWindowEvents();

function setWindowEvents() {
    for (let window of document.getElementsByClassName("window")) {
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

            setFocus(event.target);
        });

        window.addEventListener("mousemove", (event) => {
            if (state == "DOWN") {
                console.log("move");
                event.target.style.left = `${x_offset + (event.clientX - x_down)}px`;
                event.target.style.top = `${y_offset + (event.clientY - y_down)}px`;
            }
        });

        document.addEventListener("mouseup", (event) => {
            state = "UP";
        });

        document.addEventListener("mouseleave", (event) => {
            state = "UP";
        });
    }
}

function setFocus(window) {
    allWindows.splice(allWindows.indexOf(window), 1);
    allWindows.push(window);

    console.log(allWindows);

    resetWindowOrder();
}

function resetWindowOrder() {
    for (let i = 0; i < allWindows.length; ++i) {
        allWindows[i].style.zIndex = `${100 + i}`
    }
}