from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = AsyncIOMotorClient(MONGO_URL)
database = client[DATABASE_NAME]

expense_collection = database.get_collection("expenses")

async def create_indexes():
    await expense_collection.create_index([("date", -1)])
