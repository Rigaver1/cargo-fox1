import sys
import os
from dotenv import load_dotenv

# Добавляем путь к проекту в sys.path для корректной работы импортов
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token

# Загружаем переменные окружения
load_dotenv()

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

    # Настройка CORS с ограничением по доменам
    allowed_origins = ["http://localhost:3000"]
    CORS(app, origins=allowed_origins)

    # Настройка JWT
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')
    JWTManager(app)
    
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

    # Маршрут для получения токена доступа
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json() or {}
        username = data.get('username')
        if not username:
            return jsonify({'msg': 'Missing username'}), 400
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200
    
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

    # Читаем параметры запуска из переменных окружения
    host = os.getenv('HOST', 'localhost')
    port = int(os.getenv('PORT', '5000'))

    # Запускаем сервер
    print("Запуск Cargo Manager Лисёнок API сервера...")
    print(f"Сервер доступен по адресу: http://{host}:{port}")
    print(f"Документация API: http://{host}:{port}/api/health")

    app.run(
        host=host,
        port=port,
        debug=True
    )
