import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loader from './Loader.jsx'

describe('Loader', () => {
  it('shows loading text', () => {
    render(<Loader />)
    expect(screen.getByText('Загрузка данных...')).toBeTruthy()
  })
})
