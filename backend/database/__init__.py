import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from .models import Base

DATABASE_URL = f"sqlite:///{os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cargo_manager.db')}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Session:
    """Return a new SQLAlchemy session."""
    return SessionLocal()


def init_db() -> None:
    """Create tables based on SQLAlchemy models."""
    Base.metadata.create_all(bind=engine)
