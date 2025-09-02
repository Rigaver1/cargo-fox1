from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float

Base = declarative_base()


class Order(Base):
    """ORM model for orders."""
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, nullable=False)
    supplier_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    total_cny = Column(Float, default=0)
    total_rub = Column(Float, default=0)
    total_usd = Column(Float, default=0)


class CurrencyRate(Base):
    """ORM model for currency rates."""
    __tablename__ = 'currency_rates'

    currency_code = Column(String, primary_key=True)
    rate = Column(Float, nullable=False)
