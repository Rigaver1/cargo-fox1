const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null
};

export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_ORDERS_REQUEST':
    case 'FETCH_ORDER_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case 'FETCH_ORDERS_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload
      };
      
    case 'FETCH_ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
        order: action.payload
      };
      
    case 'FETCH_ORDERS_FAILURE':
    case 'FETCH_ORDER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    default:
      return state;
  }
}