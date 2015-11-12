///<reference path="../WebControl.ts" />

class Color extends WebControl {

    public get Value() {
        return this.element.getAttribute("value");
    }

    public set Value(value) {
        this.element.setAttribute("value", value);
    }

    OnInit() {
        this.element.style.background = this.Value;
    }

}

class ColorPicker extends WebControl {

    public Colors: Color[];

    OnInit() {
        super.OnInit();
        this.Colors= this.findAll('color');    
    }
}