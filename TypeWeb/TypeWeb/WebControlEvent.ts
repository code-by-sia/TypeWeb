interface IWebControlEventArgs { }

interface IWebControlEventHandler<T> {
    (sender, args?: IWebControlEventArgs): void;
}

interface IWebControlEvent<T> {
    subscribe(handler: IWebControlEventHandler<T>): void;
    unsubscribe(handler:IWebControlEventHandler<T>): void;
}

class WebControlEventArgs implements IWebControlEventArgs { }

class WebControlEvent<T> implements IWebControlEvent<T> {
    private handlers: IWebControlEventHandler<T>[] = [];

    subscribe(handler: IWebControlEventHandler<T>) {
        this.handlers.push(handler);
    } 

    unsubscribe(handler: IWebControlEventHandler<T>) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    trigger(sender, args?: IWebControlEventArgs) {
        for (let i = 0; i < this.handlers.length; i++) {
            let handler = this.handlers[i];
            handler(sender, args);
        }
    }
}



interface WebControlMouseEventArgs extends IWebControlEventArgs {
    X: number;
    Y: number;
    ControlKey: boolean;
    ShiftKey: boolean;
    AltKey: boolean;
}

interface WebControlKeyboardEventArgs extends IWebControlEventArgs {
    KeyCode: number,
    ControlKey: boolean;
    ShiftKey: boolean;
    AltKey: boolean;
}