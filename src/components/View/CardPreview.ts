import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CardCatalog, ICardCatalog } from './CardCatalog';

export interface ICardPreview extends ICardCatalog {
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends CardCatalog {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
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

    render(data?: Partial<ICardPreview>): HTMLElement {
        return super.render(data);
    }
}
