const canvasContainer = document.getElementById("visual-architecture");
let canvas;
let context;
let websocket;

const visual_database_elm = document.getElementById("img-4");
const visual_server_elm = document.getElementById("img-3");
const visual_admin_elm = document.getElementById("img-2");
const visual_client_elm = document.getElementById("img-1");
const visual_reader_elm = document.getElementById("img-5");

const postColor = "#7730e3";
const getColor = "#961485";
const insertColor = "#149629";
const selectColor = "#15a38e";
const deleteColor = "#961414";
const updateColor = "#969214";

const server_log_elm = document.getElementById("server-log");
const database_log_elm = document.getElementById("database-log");
const server_log_out_elm = document.getElementById("server-log-out");
const site_log = document.getElementById("site-log");

const legend_elm = document.getElementById("visual-legend");

function addLegendEntry(title, color) {
    const newElm = document.createElement("div");
    newElm.innerHTML = `<p><span style='color:${color}' class="legend-color">◼</span> ${title}</p>`;
    legend_elm.appendChild(newElm);
}

function fillOutLegend() {
    addLegendEntry("post", postColor);
    addLegendEntry("get", getColor);
    addLegendEntry("select", selectColor);
    addLegendEntry("insert", insertColor);
    addLegendEntry("update", updateColor);
    addLegendEntry("delete", deleteColor);
}

function sourceToElm(entity) {
    switch (entity) {
        case DataViewTypes.ENTITY_CLIENT: return visual_client_elm;
        case DataViewTypes.ENTITY_ADMIN: return visual_admin_elm;
        case DataViewTypes.ENTITY_SERVER: return visual_server_elm;
        case DataViewTypes.ENTITY_DATABASE: return visual_database_elm;
        case DataViewTypes.ENTITY_READER: return visual_reader_elm;
        default: return visual_client_elm;
    }
}

function methodToColor(f) {
    switch (f) {
        case DataViewTypes.F_POST: return postColor;
        case DataViewTypes.F_GET: return getColor;
        case DataViewTypes.F_SELECT: return selectColor;
        case DataViewTypes.F_INSERT: return insertColor;
        case DataViewTypes.F_UPDATE: return updateColor;
        case DataViewTypes.F_DELETE: return deleteColor;
    }
}

class Line {
    p1x;
    p1y;
    p2x;
    p2y;
    color;
    alpha;
    constructor(p1x, p1y, p2x, p2y, color) {
        this.p1x = p1x;
        this.p1y = p1y;
        this.p2x = p2x;
        this.p2y = p2y;
        this.color = color;
        this.alpha = 1;
    }

    draw() {
        context.globalAlpha = this.alpha;
        context.strokeStyle = this.color;
        context.beginPath();
        context.moveTo(this.p1x, this.p1y);
        context.lineTo(this.p2x, this.p2y);
        context.stroke();
        context.globalAlpha = 1;
    }
}

const constantLines = [];
const lines = [];
const alphaChange = 0.03;

function updateCanvas() {

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 10;
    context.lineCap = "round";

    // draw constant lines
    for (let line of constantLines) {
        line.draw();
    }
    // draw other lines
    for (let line of lines) {
        line.draw();
        line.alpha -= alphaChange;
    }
    // clean up
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].alpha < 0) lines.splice(i, 1);
    }

    requestAnimationFrame(updateCanvas);
}

function lineFromElm(elm1, elm2, color = "blue") {
    const b1 = elm1.getBoundingClientRect();
    const b2 = elm2.getBoundingClientRect();

    return new Line(

        b1.x + b1.width / 2,
        b1.y + b1.height / 2,
        b2.x + b2.width / 2,
        b2.y + b2.height / 2,
        color

    );
}

function addResponseTooltip(elm, data) {
    if (!data.response) return;
    console.log(data);

    elm.classList.add("tooltip-parent");

    let wrapper = document.createElement("div");
    wrapper.classList.add("tooltip-content-wrapper");

    let newToolAbsWrapper = document.createElement("div");
    newToolAbsWrapper.classList.add("tooltip-absolute-wrapper");

    let newToolTitle = document.createElement("div");
    newToolTitle.classList.add("tooltip-title");
    newToolTitle.innerText = "response";

    let newToolText = document.createElement("p");
    newToolText.classList.add("tooltip-text");
    newToolText.innerText = JSON.stringify(data.response, null, 2);
    newToolText.classList.add("code");

    wrapper.append(newToolTitle);
    wrapper.append(newToolText);

    elm.appendChild(wrapper);
}

function addLogLine(parent, title, content, color, data, func) {
    let newElm = document.createElement("div");
    newElm.classList.add("log-item");
    newElm.innerHTML = `<p class="log-text" style="background-color: ${color}"><span>${new Date().toLocaleTimeString().split(" ")[0]}</span><span>method:<b>${title}</b></span>${data.source?"<span>from:<b>"+data.source+"</b></span>":""}<span class="view-content code">${content}</span><span style="background-color:white; height: fit-content; color:${data.isResponse?'red':'green'}"><b>${data.isResponse?"[->":"[<-"}</b></span>${(data.isResponse && data.responseCode)?"<span>" + data.responseCode + "</span>":""}</p>`;
    newElm.onclick = func;
    func();
    addResponseTooltip(newElm, data);
    parent.prepend(newElm);
}

function handleIncomingData(data) {

    // draw correct lines
    const source = data.source;
    const destination = data.destination;
    const method = data.method;
    const content = data.content;
    let elm;

    // if (source === DataViewTypes.ENTITY_DATABASE) return;
    if (destination === DataViewTypes.ENTITY_DATABASE || source === DataViewTypes.ENTITY_DATABASE) {
        elm = database_log_elm;
    } else {
        if (!content.trim().toLowerCase().startsWith("/api") && source === DataViewTypes.ENTITY_CLIENT) {
            elm = site_log;
        }
        else if (data.isResponse) elm = server_log_out_elm;
        else elm = server_log_elm;
    }

    addLogLine(
        elm,
        method,
        content,
        methodToColor(method),
        data,
        () => lines.push(lineFromElm(sourceToElm(source), sourceToElm(destination), methodToColor(method)))
    );

}

function initWebSocket() {
    console.log("(re)connecting...");

    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    websocket = new WebSocket(wsProtocol + window.location.host + "/ws");

    websocket.onopen = () => console.log("connected");
    websocket.onmessage = (ev) => handleIncomingData(JSON.parse(ev.data));
    websocket.onclose = () => initWebSocket();
}

function reloadCanvasDimensions() {
    
    // init canvas dimensions
    const containerDims = canvasContainer.getBoundingClientRect();
    canvas.width = containerDims.width
    canvas.height = containerDims.height;

    constantLines.splice(0);

    constantLines.push(lineFromElm(visual_admin_elm, visual_server_elm, "rgb(36, 36, 36)"));
    constantLines.push(lineFromElm(visual_client_elm, visual_server_elm, "rgb(36, 36, 36)"));
    constantLines.push(lineFromElm(visual_reader_elm, visual_server_elm, "rgb(36, 36, 36)"));
    constantLines.push(lineFromElm(visual_server_elm, visual_database_elm, "rgb(36, 36, 36)"));
}

function main() {

    initWebSocket();
    fillOutLegend();

    setTimeout(() => {

        canvas = document.getElementById("visual-canvas");
        context = canvas.getContext("2d");

        reloadCanvasDimensions();
        window.addEventListener("resize", reloadCanvasDimensions);
    
        requestAnimationFrame(updateCanvas);
        
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => setTimeout(main, 500));