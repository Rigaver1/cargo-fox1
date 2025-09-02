import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import OrdersList from './OrdersList.jsx'

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: (selector) => selector({
    orders: {
      orders: [
        { id: 1, name: 'Первый', status: 'в работе', created_date: '2024-01-01', total_cny: 100, total_rub: 1000, total_usd: 10 },
        { id: 2, name: 'Второй', status: 'доставлен', created_date: '2024-01-02', total_cny: 200, total_rub: 2000, total_usd: 20 }
      ],
      loading: false,
      error: null
    }
  })
}))

vi.mock('../../services/orderActions', () => ({
  fetchOrders: () => ({ type: 'FETCH_ORDERS' })
}))

describe('OrdersList', () => {
  it('renders orders from store', () => {
    render(
      <MemoryRouter>
        <OrdersList />
      </MemoryRouter>
    )
    expect(screen.getByText('Первый')).toBeTruthy()
    expect(screen.getByText('Второй')).toBeTruthy()
  })

  it('updates search input value', () => {
    render(
      <MemoryRouter>
        <OrdersList />
      </MemoryRouter>
    )
    const searchInput = screen.getAllByPlaceholderText('Поиск...')[0]
    fireEvent.change(searchInput, { target: { value: 'Второй' } })
    expect(searchInput.value).toBe('Второй')
  })
})
