import { IApi, IOrderRequest, IOrderResponse, IProductListResponse } from '../../types';

export class LarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // Получение списка товаров с сервера (GET /product/)
    getProductList(): Promise<IProductListResponse> {
        return this.api.get<IProductListResponse>('/product/');
    }

    // Отправка данных о заказе на сервер (POST /order/)
    postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}
