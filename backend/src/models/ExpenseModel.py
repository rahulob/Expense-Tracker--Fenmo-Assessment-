from pydantic import BaseModel
from datetime import datetime

class ExpenseCreate(BaseModel):
    amount: float
    description: str
    category: str  # Food, Transport, etc.
    date: datetime
