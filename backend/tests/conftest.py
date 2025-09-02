import pytest
from backend.main import create_app

@pytest.fixture
def app(monkeypatch):
    monkeypatch.setattr('backend.main.init_db', lambda: None)
    app = create_app()
    app.config.update({'TESTING': True})
    return app

@pytest.fixture
def client(app):
    return app.test_client()
