from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ExpenseCreate(BaseModel):
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None
    date: datetime
