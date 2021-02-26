import { MyElement } from "./MyElement";

export class BotButton extends MyElement {
    button: HTMLButtonElement;
    answer: HTMLSpanElement;

    constructor(onSubmit: (ev: Event) => any) {
        super('botButton');

        this.button = document.createElement<'button'>('button');
        this.button.innerHTML = 'Bot';
        this.el.appendChild(this.button);

        this.answer = document.createElement<'span'>('span');
        this.answer.textContent = 'waiting';
        this.el.appendChild(this.answer);

        this.button.addEventListener('click', onSubmit);
    } 

    set label(text: string) {
        this.answer.textContent = text;
    }
}