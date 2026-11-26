import { ICardActions } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Card, ICard } from './Card';

export interface ICardCatalog extends ICard {
    image: string;
    category: string;
}

export class CardCatalog extends Card<ICardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set image(value: string) {
        const imagePath = value.replace(/\.svg$/i, '.png');
        this.setImage(this.imageElement, `${CDN_URL}${imagePath}`, this.titleElement.textContent || '');
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }
}
