from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from backend.services.currency_service import get_rates, update_rates_now, convert_amounts


currency_bp = Blueprint('currency', __name__)


@currency_bp.route('/api/currency/rates', methods=['GET'])
@jwt_required()
def rates():
    rates, last_update = get_rates()
    return jsonify({'rates': rates, 'last_update': last_update}), 200


@currency_bp.route('/api/currency/update-now', methods=['POST'])
@jwt_required()
def update_now():
    rates, last_update = update_rates_now()
    return jsonify({'status': 'success', 'rates': rates, 'last_update': last_update}), 200


@currency_bp.route('/api/currency/conversions', methods=['GET'])
@jwt_required()
def conversions():
    amount = request.args.get('amount', type=float)
    from_code = request.args.get('from', default='CNY', type=str)
    if amount is None:
        return jsonify({'error': 'Query param "amount" is required'}), 400
    try:
        result = convert_amounts(amount, from_code)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

