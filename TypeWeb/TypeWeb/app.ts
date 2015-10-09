///<reference path="WebDocument" />
class MainDocument extends WebDocument {

    private wrapper;
    private toolbar;

    OnLoad() {
        this.wrapper = this.find(".container")
        this.wrapper.find('ColorPicker');
        this.toolbar = this.find("#toolbar")
        console.log('Page has been loaded');
    }

    OnMouseDown(args: WebControlMouseEventArgs) {
        console.log(args.X);
        this.wrapper.background = '#efefef';
    }
}

let doc = new MainDocument();
doc.MouseUp.subscribe((e: WebControlMouseEventArgs) => {
    console.log(e.X + ' ' + e.Y, 'event attaching test');
});