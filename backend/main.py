import sys
import os

# Добавляем путь к проекту в sys.path для корректной работы импортов
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from flask import Flask, jsonify
from flask_cors import CORS

# Импортируем компоненты приложения
try:
    from backend.api.orders import orders_bp
    from backend.api.currency import currency_bp
    from backend.database import init_db
    print("Все импорты успешно загружены")
except ImportError as e:
    print(f"Ошибка импорта: {e}")
    exit(1)

def create_app():
    """
    Создает и настраивает Flask-приложение.
    
    Возвращает:
        Flask: Настроенное приложение Flask
    """
    # Создаем экземпляр Flask
    app = Flask(__name__)
    
    # Настройка CORS для всех маршрутов
    CORS(app)
    
    # Проверяем подключение к базе данных
    try:
        init_db()
        print("Подключение к базе данных успешно установлено")
    except Exception as e:
        print(f"Ошибка подключения к базе данных: {e}")
        raise
    
    # Регистрируем Blueprint для API заявок
    # ВАЖНО: УБРАЛ url_prefix='/api' чтобы НЕ ДУБЛИРОВАТЬ префикс
    # (префикс уже указан в самом orders.py)
    app.register_blueprint(orders_bp)
    app.register_blueprint(currency_bp)
    
    # Добавляем маршрут для проверки работоспособности
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """
        Проверяет работоспособность API.
        
        Возвращает:
            JSON-ответ с состоянием системы.
        """
        return jsonify({
            'status': 'ok',
            'message': 'Cargo Manager Лисёнок API работает нормально'
        }), 200
    
    return app

if __name__ == '__main__':
    # Создаем приложение
    app = create_app()
    
    # Запускаем сервер
    print("Запуск Cargo Manager Лисёнок API сервера...")
    print("Сервер доступен по адресу: http://localhost:5000")
    print("Документация API: http://localhost:5000/api/health")
    
    app.run(
        host='localhost',
        port=5000,
        debug=True
    )
