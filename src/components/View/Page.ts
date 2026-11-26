import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IPage {
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected catalogElement: HTMLElement;
    protected wrapperElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
        this.wrapperElement = ensureElement<HTMLElement>('.page__wrapper', this.container);
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.wrapperElement.classList.toggle('page__wrapper_locked', value);
    }
}
