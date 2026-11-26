import { IBuyer, TBuyerErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    protected payment: TPayment = '';
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';

    constructor(protected events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment;
        }
        if (data.email !== undefined) {
            this.email = data.email;
        }
        if (data.phone !== undefined) {
            this.phone = data.phone;
        }
        if (data.address !== undefined) {
            this.address = data.address;
        }
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:changed');
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите емэйл';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
