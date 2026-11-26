import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
}

export class Basket extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this.listElement.replaceChildren(...items);
        } else {
            const emptyParagraph = createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста',
            });
            this.listElement.replaceChildren(emptyParagraph);
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}
