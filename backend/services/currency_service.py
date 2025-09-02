from datetime import datetime
from typing import Dict, Tuple

# Simple in-memory currency rates with CNY as base currency
# Example: 1 CNY = 12.00 RUB, 0.1370 USD
_state = {
    'rates': {
        'RUB': 12.00,
        'USD': 0.1370,
    },
    'last_update': datetime.utcnow().isoformat()
}


def get_rates() -> Tuple[Dict[str, float], str]:
    return _state['rates'], _state['last_update']


def update_rates_now() -> Tuple[Dict[str, float], str]:
    # Here you would fetch and update rates; we just refresh the timestamp
    _state['last_update'] = datetime.utcnow().isoformat()
    return get_rates()


def convert_amounts(amount: float, from_code: str) -> Dict[str, float]:
    rates, _ = get_rates()
    from_code = (from_code or 'CNY').upper()

    # Convert arbitrary currency amount to CNY using current rates
    def to_cny(value: float, code: str) -> float:
        if code == 'CNY':
            return value
        if code in rates:
            # rates[code] is how many target units per 1 CNY
            # So 1 target unit = 1 / rates[code] CNY
            return value / rates[code]
        # Unknown currency: treat as CNY to avoid crash (or raise)
        return value

    cny = to_cny(amount, from_code)
    return {
        'CNY': cny,
        'RUB': cny * rates['RUB'],
        'USD': cny * rates['USD'],
    }
