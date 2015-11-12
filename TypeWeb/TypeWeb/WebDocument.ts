///<reference path="WebControl" />

class WebDocument extends WebControl {

    constructor() {
        super(window);
    }

    protected OnInit() {
        super.OnInit();
        this.intialAllControls();
    }

    protected get eventTarget() { return window; }

    public init(selector) {
        let item = <any>$(selector)[0];
        if (item) {
            if (!item.control) this.initialControl(item);
            if (item.control) return item.control;
        }
        return null;
    }


    private intialAllControls() {
        $("*").each((i, item) => {
            if (!(<any>item).control && $(item).attr("data-type")) {
                this.initialControl(<HTMLElement>item);
            }
        });
    }


}