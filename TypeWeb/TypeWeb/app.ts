///<reference path="WebDocument.ts" />
class MainDocument extends WebDocument {

    private wrapper;
    private toolbar;
    

    OnLoad() {
        this.wrapper = this.find(".container")
        this.wrapper.find('ColorPicker');
        this.toolbar = this.find("#toolbar")
        console.log('Page has been loaded');
        
    }

}


