from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
import sys
import os

# Добавляем путь к проекту для корректных импортов
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.services import order_service

# Создаем Blueprint для маршрутов заявок
# ВАЖНО: убираем префикс из Blueprint, чтобы не дублировать его с main.py
orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    """
    Получает список всех заявок.
    
    Возвращает:
        JSON-ответ со списком всех заявок в системе.
        Код состояния: 200 OK
    """
    try:
        orders = order_service.get_all_orders()
        return jsonify({'orders': orders}), 200
    except Exception as e:
        return jsonify({'error': f'Ошибка при получении заявок: {str(e)}'}), 500

@orders_bp.route('/api/orders/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """
    Получает заявку по её идентификатору.
    
    Аргументы:
        order_id (str): Уникальный идентификатор заявки (например, '2024-110')
        
    Возвращает:
        JSON-ответ с данными заявки или сообщением об ошибке.
        Код состояния: 200 OK или 404 Not Found
    """
    try:
        order = order_service.get_order_by_id(order_id)
        if order is None:
            return jsonify({'error': 'Заявка не найдена'}), 404
        return jsonify(order), 200
    except Exception as e:
        return jsonify({'error': f'Ошибка при получении заявки: {str(e)}'}), 500

@orders_bp.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    """
    Создает новую заявку.
    
    Тело запроса:
        JSON с данными новой заявки. Обязательные поля:
        - client_id (int): Идентификатор клиента
        - supplier_id (int): Идентификатор поставщика
        - name (str): Название заявки
        - status (str): Статус заявки
        
    Возвращает:
        JSON-ответ с идентификатором созданной заявки или сообщением об ошибке.
        Код состояния: 201 Created или 400 Bad Request
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Тело запроса должно содержать JSON'}), 400
        
        # Проверяем обязательные поля
        required_fields = ['client_id', 'supplier_id', 'name', 'status']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Отсутствует обязательное поле: {field}'}), 400
        
        # Создаем заявку
        order_id = order_service.create_order(data)
        
        if order_id is None:
            return jsonify({'error': 'Не удалось создать заявку'}), 500
            
        return jsonify({'id': order_id}), 201
    except Exception as e:
        return jsonify({'error': f'Ошибка при создании заявки: {str(e)}'}), 500

@orders_bp.route('/api/orders/<order_id>', methods=['PUT'])
@jwt_required()
def update_order(order_id):
    """
    Обновляет существующую заявку.
    
    Аргументы:
        order_id (str): Уникальный идентификатор заявки для обновления
        
    Тело запроса:
        JSON с полями, которые нужно обновить
        
    Возвращает:
        JSON-ответ с обновленными данными заявки или сообщением об ошибке.
        Код состояния: 200 OK, 404 Not Found или 400 Bad Request
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Тело запроса должно содержать JSON'}), 400
        
        # Проверяем, существует ли заявка
        existing_order = order_service.get_order_by_id(order_id)
        if existing_order is None:
            return jsonify({'error': 'Заявка не найдена'}), 404
        
        # Обновляем заявку
        updated_rows = order_service.update_order(order_id, data)
        
        if updated_rows == 0:
            return jsonify({'error': 'Не удалось обновить заявку'}), 500
        
        # Возвращаем обновленную заявку
        updated_order = order_service.get_order_by_id(order_id)
        return jsonify(updated_order), 200
    except Exception as e:
        return jsonify({'error': f'Ошибка при обновлении заявки: {str(e)}'}), 500

@orders_bp.route('/api/orders/<order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    """
    Удаляет заявку по её идентификатору.
    
    Аргументы:
        order_id (str): Уникальный идентификатор заявки для удаления
        
    Возвращает:
        JSON-ответ с подтверждением удаления или сообщением об ошибке.
        Код состояния: 200 OK или 404 Not Found
    """
    try:
        # Проверяем, существует ли заявка
        existing_order = order_service.get_order_by_id(order_id)
        if existing_order is None:
            return jsonify({'error': 'Заявка не найдена'}), 404
        
        # Удаляем заявку
        deleted_rows = order_service.delete_order(order_id)
        
        if deleted_rows == 0:
            return jsonify({'error': 'Не удалось удалить заявку'}), 500
            
        return jsonify({'message': 'Заявка удалена'}), 200
    except Exception as e:
        return jsonify({'error': f'Ошибка при удалении заявки: {str(e)}'}), 500