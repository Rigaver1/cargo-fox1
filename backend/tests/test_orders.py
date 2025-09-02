from backend.services import order_service

def test_get_orders(client, monkeypatch):
    fake_orders = [{'id': 1, 'name': 'Order 1'}]
    monkeypatch.setattr(order_service, 'get_all_orders', lambda: fake_orders)
    resp = client.get('/api/orders')
    assert resp.status_code == 200
    assert resp.get_json() == {'orders': fake_orders}

def test_get_order_found(client, monkeypatch):
    order = {'id': '123', 'name': 'Order 123'}
    monkeypatch.setattr(order_service, 'get_order_by_id', lambda oid: order if oid == '123' else None)
    resp = client.get('/api/orders/123')
    assert resp.status_code == 200
    assert resp.get_json() == order

def test_get_order_not_found(client, monkeypatch):
    monkeypatch.setattr(order_service, 'get_order_by_id', lambda oid: None)
    resp = client.get('/api/orders/999')
    assert resp.status_code == 404

def test_create_order(client, monkeypatch):
    monkeypatch.setattr(order_service, 'create_order', lambda data: 5)
    payload = {
        'client_id': 1,
        'supplier_id': 2,
        'name': 'New order',
        'status': 'в работе'
    }
    resp = client.post('/api/orders', json=payload)
    assert resp.status_code == 201
    assert resp.get_json() == {'id': 5}

def test_create_order_missing_field(client):
    resp = client.post('/api/orders', json={'client_id': 1})
    assert resp.status_code == 400
