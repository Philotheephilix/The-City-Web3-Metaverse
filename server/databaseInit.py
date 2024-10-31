import json
from pymongo import MongoClient

# MongoDB connection settings
MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'thoonga_nagaram'

def create_database_and_collections(client):
    # Check if the database exists
    if DB_NAME in client.list_database_names():
        print(f"Database '{DB_NAME}' already exists.")
    else:
        print(f"Database '{DB_NAME}' does not exist. It will be created upon the first insert.")

    # Get the database (this will create it if it doesn't exist)
    db = client[DB_NAME]

    # List of collections to create
    collections = ['users', 'products']

    # Create collections if they do not exist
    for collection in collections:
        if collection not in db.list_collection_names():
            db.create_collection(collection)
            print(f"Created collection: {collection}")
        else:
            print(f"Collection '{collection}' already exists.")

    return db

def insert_data_from_json(db):
    # Load data from JSON file
    with open('data.json') as f:
        data = json.load(f)

    # Insert data into each collection
    for collection_name, records in data.items():
        if collection_name in db.list_collection_names():
            result = db[collection_name].insert_many(records)
            print(f"Inserted {len(result.inserted_ids)} documents into {collection_name}.")
        else:
            print(f"Collection '{collection_name}' does not exist. Please create it first.")

if __name__ == '__main__':
    # Connect to MongoDB
    client = MongoClient(MONGO_URI)

    # Create database and collections
    db = create_database_and_collections(client)

    # Insert data from JSON
    insert_data_from_json(db)

    print("Database setup complete.")
