import { MyElement } from "./MyElement";

export class ManualInput extends MyElement {
    form: HTMLFormElement;
    input: HTMLInputElement;
    button: HTMLInputElement;

    constructor(onSubmit: (ev: Event) => any) {
        super('manualInput')
        this.form = document.createElement<'form'>('form');
        
        this.input = document.createElement<'input'>('input');
        this.input.type = 'text';
        this.input.name = 'move';
        this.form.appendChild(this.input);

        this.button = document.createElement<'input'>('input');
        this.button.type = 'submit';
        this.button.value = 'Go';
        this.form.appendChild(this.button);

        this.el.appendChild(this.form);

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            onSubmit(event);
        });        
    }

    reset(): void {
        this.input.value = '';
    }

    get value(): string {
        return this.input.value;
    }
}