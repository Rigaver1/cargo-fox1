import api from './api'

export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST'
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS'
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE'

export const FETCH_ORDER_REQUEST = 'FETCH_ORDER_REQUEST'
export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS'
export const FETCH_ORDER_FAILURE = 'FETCH_ORDER_FAILURE'

// Получение списка заявок
export const fetchOrders = () => async (dispatch) => {
  dispatch({ type: FETCH_ORDERS_REQUEST })
  
  try {
    const response = await api.get('/orders')
    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: response.data.orders
    })
  } catch (error) {
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload: error.message || 'Не удалось загрузить заявки'
    })
  }
}

// Получение заявки по ID
export const fetchOrder = (id) => async (dispatch) => {
  dispatch({ type: FETCH_ORDER_REQUEST })
  
  try {
    const response = await api.get(`/orders/${id}`)
    dispatch({
      type: FETCH_ORDER_SUCCESS,
      payload: response.data
    })
  } catch (error) {
    dispatch({
      type: FETCH_ORDER_FAILURE,
      payload: error.message || 'Не удалось загрузить заявку'
    })
  }
}