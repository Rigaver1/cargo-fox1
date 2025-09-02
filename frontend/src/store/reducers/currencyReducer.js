const initialState = {
  rates: null,
  lastUpdate: null,
  updateStatus: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
  lastManualUpdate: null
};

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case 'CURRENCY_RATES_LOADING':
      return {
        ...state,
        updateStatus: 'loading',
        error: null
      };
      
    case 'CURRENCY_RATES_SUCCEEDED':
      return {
        ...state,
        rates: action.payload.rates,
        lastUpdate: action.payload.lastUpdate,
        updateStatus: 'succeeded',
        error: null,
        lastManualUpdate: action.payload.isManual ? new Date().toISOString() : state.lastManualUpdate
      };
      
    case 'CURRENCY_RATES_FAILED':
      return {
        ...state,
        updateStatus: 'failed',
        error: action.payload
      };
      
    default:
      return state;
  }
}