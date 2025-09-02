import logging
from typing import Optional, Dict, List, Any

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.database.models import Order, CurrencyRate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _order_to_dict(order: Order) -> Dict[str, Any]:
    return {
        'id': order.id,
        'client_id': order.client_id,
        'supplier_id': order.supplier_id,
        'name': order.name,
        'status': order.status,
        'total_cny': order.total_cny,
        'total_rub': order.total_rub,
        'total_usd': order.total_usd,
    }


def get_all_orders() -> List[Dict[str, Any]]:
    """Получает список всех заявок из базы данных."""
    session: Session = get_db()
    try:
        orders = session.query(Order).all()
        return [_order_to_dict(o) for o in orders]
    except SQLAlchemyError as e:
        logger.error(f"Ошибка при получении списка заявок: {e}")
        return []
    finally:
        session.close()


def get_order_by_id(order_id: int) -> Optional[Dict[str, Any]]:
    """Получает заявку по её уникальному идентификатору."""
    session: Session = get_db()
    try:
        order = session.get(Order, order_id)
        return _order_to_dict(order) if order else None
    except SQLAlchemyError as e:
        logger.error(f"Ошибка при получении заявки с ID {order_id}: {e}")
        return None
    finally:
        session.close()


def get_currency_rates() -> Dict[str, float]:
    """Получает актуальные курсы валют из таблицы CurrencyRate."""
    session: Session = get_db()
    try:
        rates = session.query(CurrencyRate).all()
        return {r.currency_code: r.rate for r in rates}
    except SQLAlchemyError as e:
        logger.error(f"Ошибка при получении курсов валют: {e}")
        return {}
    finally:
        session.close()


def _convert_amount(amount: float, from_currency: str, to_currency: str, rates: Dict[str, float]) -> float:
    """Конвертирует сумму из одной валюты в другую."""
    if from_currency == to_currency:
        return amount
    if from_currency != 'CNY':
        amount_in_cny = amount / rates.get(from_currency, 1.0)
    else:
        amount_in_cny = amount
    if to_currency != 'CNY':
        return amount_in_cny * rates.get(to_currency, 1.0)
    return amount_in_cny


def create_order(data: Dict[str, Any]) -> Optional[int]:
    """Создает новую заявку в базе данных."""
    required_fields = ['client_id', 'supplier_id', 'name', 'status']
    for field in required_fields:
        if field not in data:
            logger.error(f"Отсутствует обязательное поле: {field}")
            return None

    session: Session = get_db()
    try:
        rates = get_currency_rates()
        total_cny = data.get('total_cny', 0)
        total_rub = data.get('total_rub', 0)
        total_usd = data.get('total_usd', 0)

        if total_cny > 0:
            total_rub = _convert_amount(total_cny, 'CNY', 'RUB', rates)
            total_usd = _convert_amount(total_cny, 'CNY', 'USD', rates)
        elif total_rub > 0:
            total_cny = _convert_amount(total_rub, 'RUB', 'CNY', rates)
            total_usd = _convert_amount(total_rub, 'RUB', 'USD', rates)
        elif total_usd > 0:
            total_cny = _convert_amount(total_usd, 'USD', 'CNY', rates)
            total_rub = _convert_amount(total_usd, 'USD', 'RUB', rates)

        new_order = Order(
            client_id=data['client_id'],
            supplier_id=data['supplier_id'],
            name=data['name'],
            status=data['status'],
            total_cny=total_cny,
            total_rub=total_rub,
            total_usd=total_usd,
        )
        session.add(new_order)
        session.commit()
        session.refresh(new_order)
        return new_order.id
    except SQLAlchemyError as e:
        logger.error(f"Ошибка при создании заявки: {e}")
        session.rollback()
        return None
    finally:
        session.close()


def update_order(order_id: int, data: Dict[str, Any]) -> int:
    """Обновляет существующую заявку."""
    if not data:
        return 0

    session: Session = get_db()
    try:
        order = session.get(Order, order_id)
        if not order:
            logger.warning(f"Заявка с ID {order_id} не найдена")
            return 0

        rates = get_currency_rates()

        new_cny = data.get('total_cny', order.total_cny)
        new_rub = data.get('total_rub', order.total_rub)
        new_usd = data.get('total_usd', order.total_usd)

        if 'total_cny' in data and data['total_cny'] != order.total_cny:
            new_rub = _convert_amount(new_cny, 'CNY', 'RUB', rates)
            new_usd = _convert_amount(new_cny, 'CNY', 'USD', rates)
        elif 'total_rub' in data and data['total_rub'] != order.total_rub:
            new_cny = _convert_amount(new_rub, 'RUB', 'CNY', rates)
            new_usd = _convert_amount(new_rub, 'RUB', 'USD', rates)
        elif 'total_usd' in data and data['total_usd'] != order.total_usd:
            new_cny = _convert_amount(new_usd, 'USD', 'CNY', rates)
            new_rub = _convert_amount(new_usd, 'USD', 'RUB', rates)

        order.client_id = data.get('client_id', order.client_id)
        order.supplier_id = data.get('supplier_id', order.supplier_id)
        order.name = data.get('name', order.name)
        order.status = data.get('status', order.status)
        order.total_cny = new_cny
        order.total_rub = new_rub
        order.total_usd = new_usd

        session.commit()
        return 1
    except SQLAlchemyError as e:
        logger.error(f"Ошибка при обновлении заявки с ID {order_id}: {e}")
        session.rollback()
        return 0
    finally:
        session.close()


def delete_order(order_id: int) -> int:
    """Удаляет заявку по её идентификатору."""
    session: Session = get_db()
    try:
        order = session.get(Order, order_id)
        if not order:
            return 0
        session.delete(order)
        session.commit()
        return 1
    except SQLAlchemyError as e:
        logger.error(f"Ошибка при удалении заявки с ID {order_id}: {e}")
        session.rollback()
        return 0
    finally:
        session.close()
