import json
from configparser import ConfigParser
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile

def upload_bucket(storage: Storage, folder:str, bucket_id: str):
    # use the meta file to upload the corresponding files to the bucket
    with open(f"{folder}/{bucket_id}.json", "r") as meta_file:
        meta = json.load(meta_file)
        errorFiles = []
        for file in meta.get("files", []):
            file_name = file.get("name", "")
            try:
                upload_file(
                    storage=storage, 
                    bucket_id=bucket_id,
                    file_id=file.get("$id", ""),
                    file_path=f"{folder}/{file_name}",
                    permissions=file.get("$permissions", []))    
            except:
                errorFiles.append(file)
    # write failed uploads to the error log
    with  open(f"{folder}/{bucket_id}.up.error.json", "w") as errorLog:
        json.dump(errorFiles,errorLog)

def upload_file(storage: Storage, bucket_id: str, file_id: str,file_path: str, permissions: list=[]):
    try:
        res = storage.create_file(
            bucket_id=bucket_id,
            file_id=file_id, 
            file=InputFile.from_path(file_path), 
            permissions=permissions)
        print(res)
    except Exception as eUp:
        print("Error uploading file.", eUp)
        raise Exception("Error uploading file.", eUp)

def bucket_exists(storage: Storage, bucket_id: str) -> bool: 
    try:
        res = storage.get_bucket(bucket_id=bucket_id)
        print(res)
        return True
    except:
        return False

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
    bucket_id = config["STORAGE"]["bucket_id"]
    if bucket_exists(bucket_id=bucket_id):
        upload_bucket(
            storage=storage,folder=config["STORAGE"]["upload_folder"], 
            bucket_id=bucket_id)
    else:
        print(f"Error, the bucket id {bucket_id} does not match a bucket on the Server.")
