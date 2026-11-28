// @ts-ignore: стили подключаются через сборщик Vite
import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { LarekApi } from './components/Communication/LarekApi';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { FormOrder } from './components/View/FormOrder';
import { FormContacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';
import { IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

// 1. Инициализация брокера событий и коммуникации
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

// 2. Создание моделей данных с передачей брокера событий
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// 3. Создание глобальных элементов представления (передаем events в Page)
const page = new Page(ensureElement<HTMLElement>('.page'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

// Шаблоны компонентов
const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Переиспользуемые экземпляры представлений модальных окон
const basketView = new Basket(events, cloneTemplate(basketTemplate));
const orderForm = new FormOrder(events, cloneTemplate(orderTemplate));
const contactsForm = new FormContacts(events, cloneTemplate(contactsTemplate));

// ==========================================
// СВЯЗЫВАНИЕ МОДЕЛЕЙ И ПРЕДСТАВЛЕНИЙ (MVP)
// ==========================================

// Изменился каталог товаров -> рендерим карточки на странице
events.on('items:changed', () => {
    const cards = productsModel.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(catalogCardTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            title: item.title,
            image: `${CDN_URL}${item.image}`,
            category: item.category,
            price: item.price,
        });
    });
    page.catalog = cards;
});

// Клик по карточке в каталоге -> установка превью
events.on('card:select', (item: IProduct) => {
    productsModel.setPreview(item);
});

// Изменился товар для превью -> открываем модальное окно с подробным описанием
events.on('preview:changed', (item: IProduct) => {
    if (!item) return;

    const isInCart = cartModel.hasItem(item.id);
    const isPriceNull = item.price === null;
    const cardPreview = new CardPreview(cloneTemplate(previewCardTemplate), events);
    const previewData = {
        title: item.title,
        image: `${CDN_URL}${item.image}`,
        category: item.category,
        description: item.description,
        price: item.price,
        buttonText: isPriceNull ? 'Не продается' : isInCart ? 'Удалить из корзины' : 'В корзину',
        buttonDisabled: isPriceNull,
    };

    modal.content = cardPreview.render(previewData);
    modal.open();
});

// Клик по кнопке действия в превью (добавить / удалить из корзины)
events.on('card:action', () => {
    const item = productsModel.getPreview();
    if (!item) return;

    if (cartModel.hasItem(item.id)) {
        cartModel.removeItem(item);
    } else {
        cartModel.addItem(item);
    }
    events.emit('preview:changed', item);
});

// Изменилась корзина -> обновляем счётчик в шапке, список товаров и общую стоимость
events.on('cart:changed', () => {
    page.counter = cartModel.getCount();

    const basketItems = cartModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(basketCardTemplate), {
            onClick: () => cartModel.removeItem(item),
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1,
        });
    });

    basketView.items = basketItems;
    basketView.total = cartModel.getTotalPrice();
    basketView.buttonDisabled = cartModel.getCount() === 0;
});

// Открытие корзины из шапки сайта
events.on('basket:open', () => {
    modal.content = basketView.render({});
    modal.open();
});

// Открытие первого шага оформления заказа (способ оплаты и адрес)
events.on('order:open', () => {
    buyerModel.clear();
    modal.content = orderForm.render({
        valid: false,
        errors: '',
        payment: '',
        address: '',
    });
    modal.open();
});

// Изменение полей на любом из шагов форм
events.on(/^order\..*?:change/, (data: { field: string; value: string }) => {
    buyerModel.setData({ [data.field]: data.value });
});

events.on(/^contacts\..*?:change/, (data: { field: string; value: string }) => {
    buyerModel.setData({ [data.field]: data.value });
});

// Изменение данных покупателя -> валидация модели и обновление состояния форм
events.on('buyer:changed', () => {
    const errors = buyerModel.validate();
    
    // Ошибки и валидность для Шага 1 (Оплата и адрес)
    const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = orderErrors;

    // Ошибки и валидность для Шага 2 (Контакты)
    const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = contactsErrors;
});

// Сабмит Шага 1 -> переход на Шаг 2 (Контакты: Email и Телефон)
events.on('order:submit', () => {
    modal.content = contactsForm.render({
        valid: false,
        errors: '',
        email: buyerModel.getData().email,
        phone: buyerModel.getData().phone,
    });
});

// Сабмит Шага 2 -> отправка заказа на сервер через LarekApi
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const orderRequest = {
        ...buyerData,
        total: cartModel.getTotalPrice(),
        items: cartModel.getItems().map((item) => item.id),
    };

    larekApi
        .submitOrder(orderRequest)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    cartModel.clear();
                    buyerModel.clear();
                },
            });
            success.total = result.total;
            modal.content = success.render({});
        })
        .catch((err) => {
            console.error('Ошибка при оформлении заказа:', err);
        });
});

// Управление блокировкой прокрутки страницы при открытии/закрытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

// 4. Загрузка исходных данных каталога с сервера
larekApi
    .getProductList()
    .then((response) => {
        productsModel.setItems(response.items);
    })
    .catch((err) => {
        console.error('Ошибка при получении каталога с сервера:', err);
    });
