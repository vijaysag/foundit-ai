import os
import json
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.filename = f"db_{name}.json"
        if not os.path.exists(self.filename):
            with open(self.filename, 'w') as f:
                json.dump([], f)
    
    def _read(self):
        try:
            with open(self.filename, 'r') as f:
                return json.load(f)
        except: return []
            
    def _write(self, data):
        with open(self.filename, 'w') as f:
            json.dump(data, f, indent=2)

    async def insert_one(self, doc):
        data = self._read()
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        
        # Prepare for JSON
        serializable_doc = {}
        for k, v in doc.items():
            if isinstance(v, datetime):
                serializable_doc[k] = v.isoformat()
            else:
                serializable_doc[k] = v
        
        data.append(serializable_doc)
        self._write(data)
        
        class Result:
            def __init__(self, id): self.inserted_id = id
        return Result(doc["_id"])

    async def find_one(self, query):
        data = self._read()
        for doc in data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    def find(self, query=None):
        data = self._read()
        if not query:
            results = data
        else:
            results = []
            for doc in data:
                match = True
                for k, v in query.items():
                    if isinstance(v, dict) and "$in" in v:
                        if doc.get(k) not in v["$in"]:
                            match = False
                            break
                    elif doc.get(k) != v:
                        match = False
                        break
                if match: results.append(doc)
        
        class AsyncCursor:
            def __init__(self, data):
                self.data = data
                self._index = 0
            async def to_list(self, length):
                return self.data[:length]
            def __aiter__(self):
                self._index = 0
                return self
            async def __anext__(self):
                if self._index >= len(self.data):
                    raise StopAsyncIteration
                item = self.data[self._index]
                self._index += 1
                return item
        return AsyncCursor(results)

    async def update_one(self, query, update, upsert=False):
        data = self._read()
        found = False
        for i, doc in enumerate(data):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                found = True
                if "$set" in update:
                    for k, v in update["$set"].items():
                        if isinstance(v, datetime): v = v.isoformat()
                        data[i][k] = v
                break
        
        if not found and upsert:
            new_doc = query.copy()
            if "$set" in update:
                for k, v in update["$set"].items():
                    if isinstance(v, datetime): v = v.isoformat()
                    new_doc[k] = v
            if "_id" not in new_doc: new_doc["_id"] = str(uuid.uuid4())
            data.append(new_doc)
            
        self._write(data)

    async def create_index(self, key, unique=False):
        pass

# Initialize Mock Collections
users_collection = MockCollection("users")
lost_items_collection = MockCollection("lost_items")
found_items_collection = MockCollection("found_items")
matches_collection = MockCollection("matches")
claims_collection = MockCollection("claims")

async def setup_indexes():
    print("Local Mock Database initialized (No MongoDB needed)!")
