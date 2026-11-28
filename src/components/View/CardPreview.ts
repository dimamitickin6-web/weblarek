import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { CardCatalog, ICardCatalog } from './CardCatalog';

export interface ICardPreview extends ICardCatalog {
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends CardCatalog {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, actions?: ICardActions) {
        super(container, actions);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:action');
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}
