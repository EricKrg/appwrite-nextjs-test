import json
from configparser import ConfigParser
from appwrite.client import Client
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.services.storage import Storage



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

    storage = Storage(client)

    try:
        result = storage.create_bucket(
            bucket_id=config["STORAGE"]["bucket_id"], 
            name=config["STORAGE"]["bucket_name"],
            compression=config["STORAGE"]["compression"],
            antivirus=json.loads(config["STORAGE"]["antivirus"]),
            file_security=json.loads(config["STORAGE"]["fileSec"]),
            encryption=json.loads(config["STORAGE"]["encrypt"]),
            maximum_file_size=config["STORAGE"]["maxFile"],
            permissions=[Permission.create(role=Role.users())],
            )
        print(f"successfull created bucket {result}")
    except Exception as e:
         print(f"Error creating bucket {e}",)

    

