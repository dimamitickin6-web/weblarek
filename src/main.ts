import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { LarekApi } from './components/Communication/LarekApi';

// 1. Создание экземпляров моделей данных
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

console.log('=== ТЕСТИРОВАНИЕ МОДЕЛИ КАТАЛОГА (Products) ===');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

const sampleProductId = apiProducts.items[0].id;
const foundProduct = productsModel.getItem(sampleProductId);
console.log(`Товар, найденный по id (${sampleProductId}):`, foundProduct);

if (foundProduct) {
    productsModel.setPreview(foundProduct);
    console.log('Товар для подробного отображения (preview):', productsModel.getPreview());
}

console.log('=== ТЕСТИРОВАНИЕ МОДЕЛИ КОРЗИНЫ (Cart) ===');
const item1 = apiProducts.items[0];
const item2 = apiProducts.items[1];

cartModel.addItem(item1);
cartModel.addItem(item2);
console.log('Товары в корзине после добавления 2 позиций:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Общая стоимость корзины:', cartModel.getTotalPrice());
console.log(`Наличие товара "${item1.title}" в корзине:`, cartModel.hasItem(item1.id));

cartModel.removeItem(item1);
console.log('Товары в корзине после удаления первого товара:', cartModel.getItems());
console.log(`Наличие удалённого товара "${item1.title}" в корзине:`, cartModel.hasItem(item1.id));
console.log('Количество товаров после удаления:', cartModel.getCount());
console.log('Общая стоимость после удаления:', cartModel.getTotalPrice());

cartModel.clear();
console.log('Корзина после полной очистки:', cartModel.getItems());
console.log('Количество товаров после очистки:', cartModel.getCount());

console.log('=== ТЕСТИРОВАНИЕ МОДЕЛИ ПОКУПАТЕЛЯ (Buyer) ===');
console.log('Валидация пустой модели покупателя:', buyerModel.validate());

// Сохраняем только часть полей (способ оплаты и адрес)
buyerModel.setData({ payment: 'card', address: 'г. Москва, ул. Строителей, д. 15' });
console.log('Данные покупателя после первого шага:', buyerModel.getData());
console.log('Валидация после заполнения оплаты и адреса:', buyerModel.validate());

// Дополняем оставшиеся поля (email и телефон), проверяя, что первые не затёрлись
buyerModel.setData({ email: 'dev@weblarek.ru', phone: '+7 999 123-45-67' });
console.log('Все данные покупателя после второго шага:', buyerModel.getData());
console.log('Валидация полностью заполненной модели покупателя:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

console.log('=== ВЗАИМОДЕЙСТВИЕ С СЕРВЕРОМ (LarekApi) ===');
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

larekApi
    .getProductList()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log('Массив товаров, полученный с сервера и сохранённый в модели каталога:', productsModel.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при получении данных с сервера:', err);
    });
