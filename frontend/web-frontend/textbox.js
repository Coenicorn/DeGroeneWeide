const cssInject = `@import url(https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap);.main-container,.textbox-container{position:absolute;top:50vh;left:50vw;transform:translate(-50%,-50%)}.fira-mono-regular{font-family:"Fira Mono",serif;font-weight:400;font-style:normal}.fira-mono-medium{font-family:"Fira Mono",serif;font-weight:500;font-style:normal}.fira-mono-bold,.textbox-container{font-family:"Fira Mono",serif;font-weight:700;font-style:normal}.textbox-container{border:3px solid #9c9c9c;background-color:#000;color:#e4e4e4;padding:2em;font-size:1.3em;width:fit-content;height:fit-content}.textbox-textcontent{max-width:30em;margin-bottom:1em;}.textbox-p{margin:0;padding:0;color:white}.textbox-option{color:#949494}.textbox-option:hover{text-decoration:underline;color:#fff;cursor:pointer}`;

async function wait(ms) { return new Promise((resolve) => { setTimeout(resolve, ms); }); }

class TextBoxLine {
    _elm;

    text;

    completeNow;

    constructor(text) {
        this._elm = document.createElement("p");
        this._elm.innerHTML = "";
        this._elm.classList.add("textbox-p");

        this.text = text;
        this.completeNow = false;

        const s = this._elm.style;

        s.margin = "0";
        s.padding = "0";
    }

    async reveal(delayPerLetter) {
        document.addEventListener("keydown", (e) => this.quickComplete(e, this));

        if (delayPerLetter === 0) {
            this._elm.innerHTML = this.text;
            return;
        }

        for (let i = 0; i < this.text.length && !this.completeNow; i++) {
            this._elm.innerHTML += this.text[i];
            await wait(delayPerLetter);
        }

        this._elm.innerHTML = this.text;

        this._revealFinished();
    }

    _revealFinished() {
        document.removeEventListener("keydown", this.quickComplete);
    }

    quickComplete(e, me /* funky event listener shit */) {
        if (e.key !== " ") return;
        me.completeNow = true;
    }
}

class TextBoxOption extends TextBoxLine {
    callback;

    constructor(text, callback) {
        super("* " + text);

        this.callback = callback;

        this._elm.addEventListener("click", callback);
        this._elm.classList.add("textbox-option");

        const s = this._elm.style;
    }
}

class TextBox {
    options;
    lines;

    isAttached;
    isRevealed;

    _elm; /* div */
    _elmTextContent
    _parentElement;

    constructor() {
        this.lines = [];
        this.options = [];

        this._elm = null;
        this._elmTextContent = null;
        this._parentElement = null;

        this.isAttached = false;
        this.isRevealed = false;
    }

    write(text) {
        this.lines.push(new TextBoxLine(text));

        return this;
    }

    /**
     * @param {(() => void) | null} callback
     */
    addOption(text, callback = null) {
        if (callback === null) callback = () => {};
        console.log(callback);
        this.options.push(new TextBoxOption(text, () => {
            this.detach();
            callback();
        }));
    
        return this;
    }

    _buildHTML() {
        this._elm = document.createElement("div");
        this._elm.classList.add("textbox-container");

        this._elmTextContent = document.createElement("div");
        this._elmTextContent.classList.add("textbox-textcontent");
        this._elm.appendChild(this._elmTextContent);

        for (let i = 0; i < this.lines.length; i++) {
            this._elmTextContent.appendChild(this.lines[i]._elm);
        }

        this._elmOptionContainer = document.createElement("div");
        this._elmOptionContainer.classList.add("textbox-options");
        this._elm.appendChild(this._elmOptionContainer);

        for (let i = 0; i < this.options.length; i++) {
            this._elmOptionContainer.appendChild(this.options[i]._elm);
        }

        return this;
    }

    async reveal(delayPerLetter) {
        for (let i = 0; i < this.lines.length; i++) {
            await this.lines[i].reveal(delayPerLetter);
        }
        for (let i = 0; i < this.options.length; i++) {
            await this.options[i].reveal(0);
        }

        this.isRevealed = true;

        return this;
    }

    attach(elm) {
        this._buildHTML();

        elm.appendChild(this._elm);
        this._parentElement = elm;

        this.isAttached = true;

        return this;
    }

    detach() {
        this._parentElement.removeChild(this._elm);

        this.isAttached = false;

        return this;
    }
}

(() => {

    const link = document.createElement('link');
    link.href = `data:text/css;base64,${btoa(cssInject)}`;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);

})();