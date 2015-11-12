///<reference path="WebControlEvent.ts" />

class WebControl {




    private load = new WebControlEvent<WebControlEventArgs>();
    private resize = new WebControlEvent<WebControlEventArgs>();
    private click = new WebControlEvent<WebControlEventArgs>();
    private mouseDown = new WebControlEvent<WebControlMouseEventArgs>();
    private mouseMove = new WebControlEvent<WebControlMouseEventArgs>();
    private mouseUp = new WebControlEvent<WebControlMouseEventArgs>();

    private keyDown = new WebControlEvent<WebControlKeyboardEventArgs>();
    private keyPress = new WebControlEvent<WebControlKeyboardEventArgs>();
    private keyUp = new WebControlEvent<WebControlKeyboardEventArgs>();

    private controls: WebControl[] = [];

    public get Load() { return this.load; }
    public get Resize() { return this.resize; }
    public get Click() { return this.click; }
    public get MouseDown() { return this.mouseDown; }
    public get MouseUp() { return this.mouseUp; }
    public get MouseMove() { return this.mouseMove; }
    public get KeyDown() { return this.keyDown; }
    public get KeyUp() { return this.keyUp; }


    private controlsOf(el) {
        let result: WebControl[] = [];
        var kids = el.children;
        for (let i = 0; i < kids.length; i++) {
            let kid = kids[i];
            if ((<any>kid).control)
                result.push((<any>kid).control);
            else {
                let results = this.controlsOf(kid);
                for (let j = 0; j < results.length; j++)
                    result.push(results[j]);
            }
        }
        return result;
    }

    public get Controls() {
        return this.controlsOf(this.element);
    }

    public get Parent() {
        let el = this.element.parentElement;
        while (el) {
            if (el.hasOwnProperty('control'))
                return <WebControl>((<any>el).control);
            el = el.parentElement;
        }
        return null;
    }

    protected OnLoad() { }
    protected OnInit() { }
    protected OnResize() { }
    protected OnMouseDown(args: WebControlMouseEventArgs) { }
    protected OnMouseMove(args: WebControlMouseEventArgs) { }
    protected OnMouseUp(args: WebControlMouseEventArgs) { }
    protected OnKeyDown(args: WebControlKeyboardEventArgs) { }
    protected OnKeyPress(args: WebControlKeyboardEventArgs) { }
    protected OnKeyUp(args: WebControlKeyboardEventArgs) { }

    constructor(protected node) {
        this.setEvents();
        if (!(<any>node).control)
            (<any>node).control = this;
        this.OnInit();
    }

    protected get eventTarget() { return <EventTarget>this.node; }
    protected get element() { return <HTMLElement>this.node; }

    public show() { this.element.style.display = 'block'; }
    public hide() { this.element.style.display = 'none'; }

    public get height() { return (<HTMLElement>this.eventTarget).clientHeight; }
    public set height(value) { (<HTMLElement>this.eventTarget).clientHeight = value; }
    public get width() { return (<HTMLElement>this.eventTarget).clientWidth; }
    public set width(value) { (<HTMLElement>this.eventTarget).clientWidth = value; }


    public findAll(selector) {
        let items = this.element.querySelectorAll(selector);
        let results = [];
        for (let i = 0; i < items.length; i++) {
            let item = <any>items[i];

            if (item) {
                if (!item.control) this.initialControl(item);
                if (item.control) results.push(item.control);
            }
        }


        return results;
    }

    public find(selector) {
        let item = <any>this.element.querySelectorAll(selector)[0];
        if (item) {
            if (!item.control) this.initialControl(item);
            if (item.control) return item.control;

        }
        return null;
    }

    private setEvents() {

        let et = this.node;
        let th = this;

        et.addEventListener("load", () => { th.OnLoad(); th.load.trigger(th) });
        et.addEventListener("resize", () => { th.OnResize(); th.resize.trigger(th) });

        et.addEventListener("mousedown", (e: MouseEvent) => {
            let args = { AltKey: e.altKey, ControlKey: e.ctrlKey, ShiftKey: e.shiftKey, X: e.x, Y: e.y };
            th.OnMouseDown(args);
            th.mouseDown.trigger(th, args)
        });
        et.addEventListener("mousemove", (e: MouseEvent) => {
            let args = { AltKey: e.altKey, ControlKey: e.ctrlKey, ShiftKey: e.shiftKey, X: e.x, Y: e.y };
            th.OnMouseMove(args);
            th.mouseMove.trigger(th, args);
        });
        et.addEventListener("mouseup", (e: MouseEvent) => {
            let args = { AltKey: e.altKey, ControlKey: e.ctrlKey, ShiftKey: e.shiftKey, X: e.x, Y: e.y };
            th.OnMouseUp(args);
            th.mouseUp.trigger(th, args);
        });

        et.addEventListener("keydown", (e: KeyboardEvent) => {
            let args = { AltKey: e.altKey, ControlKey: e.ctrlKey, ShiftKey: e.shiftKey, KeyCode: e.keyCode };
            this.OnKeyDown(args);
            th.keyDown.trigger(th, args);
        });
        et.addEventListener("keypress", (e: KeyboardEvent) => {
            let args = { AltKey: e.altKey, ControlKey: e.ctrlKey, ShiftKey: e.shiftKey, KeyCode: e.keyCode };
            th.OnKeyPress(args);
            th.keyPress.trigger(th, args)
        });
        et.addEventListener("keyup", (e: KeyboardEvent) => {
            let args = { AltKey: e.altKey, ControlKey: e.ctrlKey, ShiftKey: e.shiftKey, KeyCode: e.keyCode };
            th.OnKeyUp(args);
            th.keyUp.trigger(th, args)
        });


    }

    private getType(element: HTMLElement) {
        if (element.dataset["type"])
            return element.dataset["type"];
        return element.tagName;
    }

    protected initialControl(element: HTMLElement) {
        if ((<any>element).control) {
            this.controls.push((<any>element).control);
            return;
        };
        let type = this.getType(element);
        let control = WebControl.provideControl(type, element);
        (<any>element).control = control;
        this.controls.push(control);
    }

    public static provideControl(typeName: string, el: Element): WebControl {
        for (let t in window) if (((t + "").toLowerCase() == typeName.toLowerCase())) {

            if (!(window[typeName] instanceof WebControl)) {
                return new window[t + ""](el);
            }
        }
        throw ("no implementation has been found fot type " + typeName);
    }

}

interface IDraggableWebControl {
    left: number;
    top: number;
    moveTo(x, y);
}

class DraggableWebControl extends WebControl implements IDraggableWebControl {

    public get left() { return this.element.clientLeft - this.element.offsetLeft; }
    public get top() { return this.element.offsetTop + this.element.clientTop; }

    public set left(value) {
        this.element.style.left = value + 'px';
    }
    public set top(value) {
        this.element.style.top = value + 'px';
    }


    moveTo(x: number, y: number) {
        this.left = x;
        this.top = y;
    }

}
