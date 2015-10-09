class Wrapper extends WebControl {
    public get Background() {
        return this.element.style.backgroundColor;
    }

    public set background(value) {
        this.element.style.backgroundColor = value;
    }
}