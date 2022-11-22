
import json
import uuid
from configparser import ConfigParser
from appwrite.client import Client
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.services.databases import Databases


def _create_db(db: Databases, name: str):
    res = db.create(str(uuid.uuid4()), name)
    print(f"DATABASE ID: {res['$id']}")
    print(f"DATABASE NAME: {res['name']}")
    return res

def _create_collection(db: Databases, name: str, db_id: str): 
    res = db.create_collection(
        db_id, str(uuid.uuid4()),
        name, 
        permissions=[Permission.create(role=Role.users())],
        document_security=True)
    print(f"COLLECTION ID: {res['$id']}")
    print(f"COLLELCTION NAME: {res['name']}")
    return res

def _create_collection_attrs(db:Databases, db_id:str, collection_id: str, schema: list):
    calls = {
        "string": lambda entry_schema:
             db.create_string_attribute(
                database_id=db_id,
                collection_id=collection_id,
                array=entry_schema["array"],
                size=entry_schema["size"],
                required=entry_schema["required"],
                default=entry_schema["default"], 
                key=entry_schema["key"]),
        "boolean": lambda entry_schema:
            db.create_boolean_attribute(
                database_id=db_id,
                collection_id=collection_id,
                array=entry_schema["array"],
                required=entry_schema["required"],
                default=entry_schema["default"], 
                key=entry_schema["key"])
    }
    
    entry: dict
    for entry in schema:
        call = calls.get(entry.get("type"), lambda entry: print("Attribute creation failed!", entry)) # call function or print error
        call(entry)
    

if __name__ == "__main__":
    config = ConfigParser()
    config.read("config.ini")
    print(config["HOST"]["endpoint"])


    client = Client()
    (client
        .set_endpoint(config["HOST"]["endpoint"]) # Your API Endpoint
        .set_project(config["HOST"]["projectid"]) # Your project ID
        .set_key(config["HOST"]["apikey"]) # Your secret API key
    )
    databases = Databases(client)

    try:
        print("creating db...")
        db_res = _create_db(databases, config["DB"]["name"])
        print("creating collection...")    
        coll_res = _create_collection(databases,config["DB"]["collection"], db_res["$id"])
        print("creating attributes...")
        _create_collection_attrs(
            db=databases,
            db_id=db_res["$id"], 
            collection_id=coll_res["$id"], 
            schema=json.loads(config.get("MODEL","schema")))
    except Exception as e:
        print("Database setup failed!", e)
