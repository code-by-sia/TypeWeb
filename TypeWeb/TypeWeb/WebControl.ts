///<reference path="WebControlEvent" />

class WebControl {

    private load = new WebControlEvent<WebControlEventArgs>();
    private resize = new WebControlEvent<WebControlEventArgs>();
    private scroll = new WebControlEvent<WebControlEventArgs>();
    private click = new WebControlEvent<WebControlEventArgs>();
    private mouseDown = new WebControlEvent<WebControlMouseEventArgs>();
    private mouseMove = new WebControlEvent<WebControlMouseEventArgs>();
    private mouseUp = new WebControlEvent<WebControlMouseEventArgs>();

    private keyDown = new WebControlEvent<WebControlKeyboardEventArgs>();
    private keyPress = new WebControlEvent<WebControlKeyboardEventArgs>();
    private keyUp = new WebControlEvent<WebControlKeyboardEventArgs>();
    
    public get Load() { return this.load; }
    public get Resize() { return this.resize; }
    public get Scroll() { return this.scroll; }
    public get Click() { return this.click; }
    public get MouseDown() { return this.mouseDown; }
    public get MouseUp() { return this.mouseUp; }
    public get MouseMove() { return this.mouseMove; }
    public get KeyDown() { return this.keyDown; }
    public get KeyUp() { return this.keyUp; }

    protected OnLoad() { }
    protected OnInit() { }
    protected OnResize() { }
    protected OnScroll() { }
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

    public show() { $(this.element).show(); }
    public hide() { $(this.element).hide(); }

    public get height() { return $(this.eventTarget).height(); }
    public set height(value) { $(this.eventTarget).height(value); }
    public get width() { return $(this.eventTarget).width(); }
    public set width(value) { $(this.eventTarget).width(value); }


    public find(selector) { return this.init(selector); }
    public findAll(selector) {
        return this.initAll(selector);
    }

    public initAll(selector) {
        let items = $(this.element).find(selector);
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

    public init(selector) {
        let item = <any>$(this.element).find(selector)[0];
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
        et.addEventListener("scroll", () => { th.OnScroll(); th.scroll.trigger(th) });

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
        if ((<any>element).control) return;
        let type = this.getType(element);
        (<any>element).control = WebControl.provideControl(type, element);
    }

    public static provideControl(type: string, el: Element): WebControl {
        for (let t in window) {
            let winType = t + "";
            if ((winType).toLowerCase() == type.toLowerCase()) {
                return new window[winType](el);
            }
        }
        throw ("no implementation has been found fot type " + type);
    }

}