import sqlite3
import os
from datetime import datetime

def get_db():
    """
    Создает и возвращает подключение к базе данных.
    База данных ищется в папке database проекта.
    """
    # Получаем путь к текущей папке (где находится этот файл)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Собираем путь к файлу базы данных
    db_path = os.path.join(current_dir, 'cargo_manager.db')
    
    # Проверяем, существует ли файл базы данных
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Файл базы данных не найден: {db_path}\n"
                               "Пожалуйста, убедитесь, что вы создали базу данных "
                               "в папке backend/database")
    
    # Создаем подключение к базе данных
    conn = sqlite3.connect(db_path)
    
    # Настраиваем соединение
    conn.row_factory = sqlite3.Row
    
    return conn

def init_db():
    """
    Инициализирует базу данных (проверяет подключение).
    Полезно для проверки, что всё настроено правильно.
    """
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Проверяем, есть ли таблица Currencies (валюты)
        cursor.execute("SELECT COUNT(*) FROM Currencies")
        count = cursor.fetchone()[0]
        
        print(f"✅ Подключение к базе данных установлено. Найдено {count} валют.")
        
        # Проверяем последнее обновление курсов
        cursor.execute("SELECT * FROM CurrencyUpdates ORDER BY last_update DESC LIMIT 1")
        last_update = cursor.fetchone()
        
        if last_update:
            status = "успешно" if last_update['status'] == 'success' else "с ошибкой"
            print(f"Последнее обновление курсов: {last_update['last_update']} ({status})")
        else:
            print("Курс валют еще не обновлялся")
            
        return True
    except Exception as e:
        print(f"❌ Ошибка подключения к базе данных: {str(e)}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("="*50)
    print("Проверка подключения к базе данных")
    print("="*50)
    init_db()
    print("="*50)