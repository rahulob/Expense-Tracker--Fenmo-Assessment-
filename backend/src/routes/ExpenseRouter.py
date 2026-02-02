from bson import ObjectId
from datetime import datetime
from typing import List
from src.models.ExpenseModel import ExpenseCreate
from src.database import expense_collection
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])

def serialize_expense(expense):
    """
    Convert MongoDB document to JSON-serializable dict.
    """
    return {
        "id": str(expense["_id"]),
        "amount": float(expense["amount"]),
        "category": expense["category"],
        "description": expense["description"],
        "date": expense["date"].strftime("%Y-%m-%d"),  # datetime to string
    }

@router.get("/get-all")
async def get_all_expenses(
        category: str = Query(None, description="Optional: Filter by category (Food, Transport, etc.)")
) -> dict:
    """
    Get all expenses. Optional category filter.
    """
    # Build query dynamically
    query: dict = {}
    
    # Add category filter if provided
    if category:
        query["category"] = category.lower()  # Normalize to lowercase
    
    # Query database
    records = expense_collection.find(query).sort("date", -1).limit(100)
    
    # Collect results
    result = []
    async for record in records:
        result.append(serialize_expense(record))
    
    if not result:
        raise HTTPException(status_code=404, detail="No expenses found")
    
    return {"expenses": result}

@router.get("/get-by-date-range")
async def get_expenses_by_date_range(
    month: int = Query(..., ge=0, le=12, description="Month (1-12), or 0 for entire year"),
    year: int = Query(..., description="Year, e.g. 2026"),
    category: str = Query(None, description="Optional: Filter by category (Food, Transport, etc.)")
) -> List[dict]:
    """
    Get all expenses in a specific month/year.
    Optional category filter. month=0 returns entire year data.
    """
    # Date range logic (unchanged)
    if month == 0:
        start_date = datetime(year, 1, 1)
        end_date = datetime(year + 1, 1, 1)
    else:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

    # Build query dynamically
    query: dict = {"date": {"$gte": start_date, "$lt": end_date}}
    
    # Add category filter if provided
    if category:
        query["category"] = category

    records = expense_collection.find(query).sort("date", -1)

    result = []
    async for record in records:
        result.append(serialize_expense(record))

    if not result:
        raise HTTPException(status_code=404, detail="No expenses found for the given period/category")

    return result

@router.put("/update-by-id/{expense_id}")
async def update_expense(expense_id: str, expense: ExpenseCreate):
    # Convert string ID to ObjectId
    obj_id = ObjectId(expense_id)

    # Find the expense first
    existing_expense = await expense_collection.find_one({"_id": obj_id})
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    # Update the expense
    expense_dict = expense.dict(by_alias=False)
    result = await expense_collection.update_one(
        {"_id": obj_id}, 
        {"$set": expense_dict}
    )

    if result.modified_count == 1:
        updated_expense = await expense_collection.find_one({"_id": obj_id})
        return {
            "message": "Expense updated successfully",
            "expense": serialize_expense(updated_expense)
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to update expense")

@router.delete("/delete-by-id/{expense_id}")
async def delete_expense(expense_id: str):
    # Convert string ID to ObjectId
    obj_id = ObjectId(expense_id)

    # Find the expense first
    expense = await expense_collection.find_one({"_id": obj_id})
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    # Delete the expense
    result = await expense_collection.delete_one({"_id": obj_id})

    if result.deleted_count == 1:
        return {"message": "Expense deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete expense")

@router.post("/create")
async def create_expense(expense: ExpenseCreate):
    expense_dict = expense.dict(by_alias=False)
    result = await expense_collection.insert_one(expense_dict)
    return {
        "message": "Expense created successfully",
        "expense_id": str(result.inserted_id)
    }
