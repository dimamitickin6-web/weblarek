export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Доступные способы оплаты
export type TPayment = 'card' | 'cash' | '';

// Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Интерфейс данных покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Тип для объекта ошибок валидации полей покупателя
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Ответ сервера со списком товаров (GET /product/)
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Данные заказа, отправляемые на сервер (POST /order/)
export interface IOrderRequest extends IBuyer {
    total: number;
    items: string[];
}

// Ответ сервера при успешном оформлении заказа (POST /order/)
export interface IOrderResponse {
    id: string;
    total: number;
}

// Интерфейс для передачи обработчиков кликов в компоненты View
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
