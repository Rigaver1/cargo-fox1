import api from './api'

// Форматирует сумму с валютой
export const formatCurrency = (amount, currencyCode, options = {}) => {
  const { 
    symbol = true, 
    decimal = true,
    showFull = false
  } = options;
  
  // Базовые обозначения валют
  const currencySymbols = {
    'RUB': '₽',
    'USD': '$',
    'CNY': '¥'
  };
  
  // Форматируем число
  let formattedAmount;
  if (decimal) {
    formattedAmount = Number(amount).toFixed(2).replace(/\.00$/, '');
  } else {
    formattedAmount = Math.round(amount).toLocaleString();
  }
  
  // Добавляем символ валюты
  if (showFull) {
    const currencyNames = {
      'RUB': 'руб.',
      'USD': 'USD',
      'CNY': 'CNY'
    };
    return `${formattedAmount} ${currencyNames[currencyCode] || currencyCode}`;
  }
  
  if (symbol && currencySymbols[currencyCode]) {
    return `${formattedAmount} ${currencySymbols[currencyCode]}`;
  }
  
  return formattedAmount;
};

// Получает текущие курсы валют
export const loadCurrencyRates = () => async (dispatch) => {
  try {
    dispatch({ type: 'CURRENCY_RATES_LOADING' });
    
    const response = await api.get('/currency/rates');
    dispatch({
      type: 'CURRENCY_RATES_SUCCEEDED',
      payload: {
        rates: response.data.rates,
        lastUpdate: response.data.last_update
      }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CURRENCY_RATES_FAILED',
      payload: error.message
    });
    throw error;
  }
};

// Принудительно обновляет курсы валют
export const refreshCurrencyRates = () => async (dispatch) => {
  try {
    dispatch({ type: 'CURRENCY_RATES_LOADING' });
    
    await api.post('/currency/update-now');
    
    // После обновления получаем новые курсы
    const response = await api.get('/currency/rates');
    dispatch({
      type: 'CURRENCY_RATES_SUCCEEDED',
      payload: {
        rates: response.data.rates,
        lastUpdate: response.data.last_update,
        isManual: true
      }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CURRENCY_RATES_FAILED',
      payload: error.message
    });
    throw error;
  }
};

// Получает конвертированные суммы
export const getConvertedAmounts = (amount, currencyCode) => async (dispatch) => {
  try {
    const response = await api.get('/currency/conversions', {
      params: { amount, from: currencyCode }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};