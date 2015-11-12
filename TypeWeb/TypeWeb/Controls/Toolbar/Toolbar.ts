///<reference path="../../WebControl.ts" />
class Toolbar extends WebControl {

    OnInit() {
        this.element.classList.add("toolbar-web-control");
    }

}

class ToolbarItem extends WebControl {

    OnInit() {
        this.element.classList.add("toolbar-item-web-control");
    }
}

class ToolbarSpliter extends ToolbarItem {

    OnInit() {
        this.element.classList.add("toolbar-item-spliter-web-control");
    }
}