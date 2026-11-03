import { IProduct } from '../../types';

export class Cart {
    protected items: IProduct[] = [];

    // Получение массива товаров, которые находятся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавление товара, который был получен в параметре, в массив корзины
    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
        }
    }

    // Удаление товара, полученного в параметре, из массива корзины
    removeItem(item: IProduct): void {
        this.items = this.items.filter((cartItem) => cartItem.id !== item.id);
    }

    // Очистка корзины
    clear(): void {
        this.items = [];
    }

    // Получение стоимости всех товаров в корзине
    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    // Получение количества товаров в корзине
    getCount(): number {
        return this.items.length;
    }

    // Проверка наличия товара в корзине по его id
    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}
