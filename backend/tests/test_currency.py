import backend.api.currency as currency_api


def test_get_rates(client, monkeypatch):
    monkeypatch.setattr(currency_api, 'get_rates', lambda: ({'USD': 1.1}, 'time'))
    resp = client.get('/api/currency/rates')
    assert resp.status_code == 200
    assert resp.get_json() == {'rates': {'USD': 1.1}, 'last_update': 'time'}


def test_update_now(client, monkeypatch):
    monkeypatch.setattr(currency_api, 'update_rates_now', lambda: ({'USD': 1.2}, 'now'))
    resp = client.post('/api/currency/update-now')
    assert resp.status_code == 200
    body = resp.get_json()
    assert body['status'] == 'success'
    assert body['rates'] == {'USD': 1.2}


def test_conversions(client, monkeypatch):
    monkeypatch.setattr(currency_api, 'convert_amounts', lambda amount, code: {'CNY': 10, 'RUB': 20, 'USD': 30})
    resp = client.get('/api/currency/conversions?amount=5&from=CNY')
    assert resp.status_code == 200
    assert resp.get_json()['RUB'] == 20


def test_conversions_missing_amount(client):
    resp = client.get('/api/currency/conversions')
    assert resp.status_code == 400
