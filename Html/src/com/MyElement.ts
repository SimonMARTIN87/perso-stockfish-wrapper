export class MyElement {
    el: HTMLDivElement;

    constructor(className: string) {
        this.el = document.createElement<'div'>('div');
        this.el.classList.add(className);
    }

    addToDom(parent?: HTMLElement) {
        if (parent) {
            parent.appendChild(this.el)
        } else {
            document.body.appendChild(this.el);
        }
    }
}