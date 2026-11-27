import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}
