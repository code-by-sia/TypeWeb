///<reference path="WebControl.ts" />

class WebDocument extends WebControl {

    private catchedForDrag: IDraggableWebControl = null;
    private x = 0;
    private y = 0;
    constructor() {
        super(window);
    }

    protected OnInit() {
        super.OnInit();
        this.intialAllControls();
    }

    public catchDrag(control: IDraggableWebControl) {
        this.catchedForDrag = control;
    }

    protected OnMouseDown(args: WebControlMouseEventArgs) {
        this.x = args.X;
        this.y = args.Y;
    }

    protected OnMouseMove(args: WebControlMouseEventArgs) {
        if (this.catchedForDrag) {
            this.catchedForDrag.left = args.X;
            this.catchedForDrag.top = args.Y;

        }

        this.x = args.X;
        this.y = args.Y;
    }
    protected OnMouseUp(args: WebControlMouseEventArgs) {
        this.catchedForDrag = null;
    }


    protected get eventTarget() { return window; }

    public find(selector) {
        let item = <any>document.querySelectorAll(selector)[0];
        if (item) {
            if (!item.control) this.initialControl(item);
            if (item.control) return item.control;
        }
        return null;
    }

    private isWebControlEl(el: HTMLElement) {
        if (el.hasAttribute("control")) return true;
        if (el.hasAttribute("data-type")) return true;
        for (let t in window) if ((t + "").toLowerCase() == el.tagName.toLowerCase()) {
            if (!(window[t + ""] instanceof WebControl))
                return true;
        }
        return false;
    }

    private intialAllControls() {
        for (let i in document.all) {
            let item = document.all[i];
            if (item.hasAttribute)
                if (this.isWebControlEl(<HTMLElement>item))
                    this.initialControl(<HTMLElement>item);
        }
    }

    static Instance: WebDocument = null;
    static Init() {
        if (this.Instance == null)
            this.Instance = new WebDocument();
    }

}

document.onreadystatechange = (ev) => {
    if (ev.isTrusted) {
        WebDocument.Init();
    }
}