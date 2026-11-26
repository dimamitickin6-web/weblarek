import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
    valid: boolean;
    errors: string;
}

export abstract class Form<T> extends Component<IFormState & T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, protected container: HTMLFormElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value,
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    render(state: Partial<IFormState & T> = {}): HTMLElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors } as Partial<IFormState & T>);
        Object.assign(this, inputs);
        return this.container;
    }
}
