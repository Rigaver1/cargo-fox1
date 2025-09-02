# backend/services/order_service.py

import sqlite3
import logging
from typing import Optional, Dict, List, Any
from backend.database import get_db  # Исправлен импорт

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_all_orders() -> List[Dict[str, Any]]:
    """
    Получает список всех заявок из базы данных.
    
    Возвращает:
        List[Dict]: Список словарей, каждый из которых содержит информацию о заявке:
            - id (int): Уникальный идентификатор заявки
            - client_id (int): Идентификатор клиента
            - supplier_id (int): Идентификатор поставщика
            - name (str): Название заявки
            - status (str): Статус заявки
            - total_cny (float): Сумма в юанях
            - total_rub (float): Сумма в рублях
            - total_usd (float): Сумма в долларах
    """
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            SELECT id, client_id, supplier_id, name, status, 
                   total_cny, total_rub, total_usd 
            FROM orders
        """)
        rows = cursor.fetchall()
        orders = []
        for row in rows:
            orders.append({
                'id': row[0],
                'client_id': row[1],
                'supplier_id': row[2],
                'name': row[3],
                'status': row[4],
                'total_cny': row[5],
                'total_rub': row[6],
                'total_usd': row[7]
            })
        return orders
    except sqlite3.Error as e:
        logger.error(f"Ошибка при получении списка заявок: {e}")
        return []
    finally:
        cursor.close()

def get_order_by_id(order_id: int) -> Optional[Dict[str, Any]]:
    """
    Получает заявку по её уникальному идентификатору.
    
    Аргументы:
        order_id (int): Уникальный идентификатор заявки
        
    Возвращает:
        Optional[Dict]: Словарь с информацией о заявке или None, если заявка не найдена
    """
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            SELECT id, client_id, supplier_id, name, status, 
                   total_cny, total_rub, total_usd 
            FROM orders 
            WHERE id = ?
        """, (order_id,))
        row = cursor.fetchone()
        if row:
            return {
                'id': row[0],
                'client_id': row[1],
                'supplier_id': row[2],
                'name': row[3],
                'status': row[4],
                'total_cny': row[5],
                'total_rub': row[6],
                'total_usd': row[7]
            }
        return None
    except sqlite3.Error as e:
        logger.error(f"Ошибка при получении заявки с ID {order_id}: {e}")
        return None
    finally:
        cursor.close()

def get_currency_rates() -> Dict[str, float]:
    """
    Получает актуальные курсы валют из таблицы CurrencyRates.
    Базовая валюта - CNY (юань).
    
    Возвращает:
        Dict[str, float]: Словарь с курсами валют, где ключи - коды валют,
                          значения - курс по отношению к CNY
    """
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT currency_code, rate FROM currency_rates")
        rows = cursor.fetchall()
        rates = {}
        for row in rows:
            rates[row[0]] = row[1]
        return rates
    except sqlite3.Error as e:
        logger.error(f"Ошибка при получении курсов валют: {e}")
        return {}
    finally:
        cursor.close()

def _convert_amount(amount: float, from_currency: str, to_currency: str, rates: Dict[str, float]) -> float:
    """
    Конвертирует сумму из одной валюты в другую.
    
    Аргументы:
        amount (float): Сумма для конвертации
        from_currency (str): Исходная валюта
        to_currency (str): Целевая валюта
        rates (Dict): Словарь с курсами валют
        
    Возвращает:
        float: Сконвертированная сумма
    """
    if from_currency == to_currency:
        return amount
    
    # Конвертируем в CNY как базовую валюту
    if from_currency != 'CNY':
        amount_in_cny = amount / rates.get(from_currency, 1.0)
    else:
        amount_in_cny = amount
    
    # Конвертируем из CNY в целевую валюту
    if to_currency != 'CNY':
        return amount_in_cny * rates.get(to_currency, 1.0)
    else:
        return amount_in_cny

def create_order(data: Dict[str, Any]) -> Optional[int]:
    """
    Создает новую заявку в базе данных.
    
    Аргументы:
        data (Dict): Словарь с данными заявки, должен содержать:
            - client_id (int): Идентификатор клиента
            - supplier_id (int): Идентификатор поставщика
            - name (str): Название заявки
            - status (str): Статус заявки
            - total_cny (float, опционально): Сумма в юанях
            - total_rub (float, опционально): Сумма в рублях
            - total_usd (float, опционально): Сумма в долларах
            
    Возвращает:
        Optional[int]: Идентификатор созданной заявки или None в случае ошибки
    """
    # Проверяем обязательные поля
    required_fields = ['client_id', 'supplier_id', 'name', 'status']
    for field in required_fields:
        if field not in data:
            logger.error(f"Отсутствует обязательное поле: {field}")
            return None
    
    db = get_db()
    cursor = db.cursor()
    
    try:
        # Получаем курсы валют
        rates = get_currency_rates()
        
        # Инициализируем значения сумм
        total_cny = data.get('total_cny', 0)
        total_rub = data.get('total_rub', 0)
        total_usd = data.get('total_usd', 0)
        
        # Если указана сумма в одной валюте, пересчитываем остальные
        if total_cny > 0:
            total_rub = _convert_amount(total_cny, 'CNY', 'RUB', rates)
            total_usd = _convert_amount(total_cny, 'CNY', 'USD', rates)
        elif total_rub > 0:
            total_cny = _convert_amount(total_rub, 'RUB', 'CNY', rates)
            total_usd = _convert_amount(total_rub, 'RUB', 'USD', rates)
        elif total_usd > 0:
            total_cny = _convert_amount(total_usd, 'USD', 'CNY', rates)
            total_rub = _convert_amount(total_usd, 'USD', 'RUB', rates)
        
        # Выполняем вставку новой заявки
        cursor.execute("""
            INSERT INTO orders (client_id, supplier_id, name, status, 
                               total_cny, total_rub, total_usd)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (data['client_id'], data['supplier_id'], data['name'], 
              data['status'], total_cny, total_rub, total_usd))
        
        db.commit()
        return cursor.lastrowid
    except sqlite3.Error as e:
        logger.error(f"Ошибка при создании заявки: {e}")
        db.rollback()
        return None
    finally:
        cursor.close()

def update_order(order_id: int, data: Dict[str, Any]) -> int:  # Исправлено: добавлен тип данных для data
    """
    Обновляет существующую заявку в базе данных.
    
    Аргументы:
        order_id (int): Идентификатор заявки для обновления
        data (Dict): Словарь с полями для обновления
        
    Возвращает:
        int: Количество обновленных записей (0 или 1)
    """
    if not data:
        return 0
    
    db = get_db()
    cursor = db.cursor()
    
    try:
        # Получаем текущие данные заявки
        cursor.execute("""
            SELECT total_cny, total_rub, total_usd 
            FROM orders 
            WHERE id = ?
        """, (order_id,))
        row = cursor.fetchone()
        
        if not row:
            logger.warning(f"Заявка с ID {order_id} не найдена")
            return 0
        
        # Получаем курсы валют
        rates = get_currency_rates()
        
        # Текущие значения сумм
        current_cny, current_rub, current_usd = row
        
        # Новые значения сумм (если они обновляются)
        new_cny = data.get('total_cny', current_cny)
        new_rub = data.get('total_rub', current_rub)
        new_usd = data.get('total_usd', current_usd)
        
        # Если обновляется сумма в одной валюте, пересчитываем остальные
        if 'total_cny' in data and data['total_cny'] != current_cny:
            new_rub = _convert_amount(new_cny, 'CNY', 'RUB', rates)
            new_usd = _convert_amount(new_cny, 'CNY', 'USD', rates)
        elif 'total_rub' in data and data['total_rub'] != current_rub:
            new_cny = _convert_amount(new_rub, 'RUB', 'CNY', rates)
            new_usd = _convert_amount(new_rub, 'RUB', 'USD', rates)
        elif 'total_usd' in data and data['total_usd'] != current_usd:
            new_cny = _convert_amount(new_usd, 'USD', 'CNY', rates)
            new_rub = _convert_amount(new_usd, 'USD', 'RUB', rates)
        
        # Формируем SQL-запрос для обновления
        update_fields = []
        update_values = []
        
        for key, value in data.items():
            if key in ['client_id', 'supplier_id', 'name', 'status']:
                update_fields.append(f"{key} = ?")
                update_values.append(value)
        
        # Добавляем обновленные суммы
        update_fields.extend(["total_cny = ?", "total_rub = ?", "total_usd = ?"])
        update_values.extend([new_cny, new_rub, new_usd])
        
        # Добавляем ID для WHERE-условия
        update_values.append(order_id)
        
        # Выполняем обновление
        query = f"UPDATE orders SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, update_values)
        
        db.commit()
        return cursor.rowcount
    except sqlite3.Error as e:
        logger.error(f"Ошибка при обновлении заявки с ID {order_id}: {e}")
        db.rollback()
        return 0
    finally:
        cursor.close()

def delete_order(order_id: int) -> int:
    """
    Удаляет заявку из базы данных по её идентификатору.
    
    Аргументы:
        order_id (int): Идентификатор заявки для удаления
        
    Возвращает:
        int: Количество удаленных записей (0 или 1)
    """
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
        db.commit()
        return cursor.rowcount
    except sqlite3.Error as e:
        logger.error(f"Ошибка при удалении заявки с ID {order_id}: {e}")
        db.rollback()
        return 0
    finally:
        cursor.close()