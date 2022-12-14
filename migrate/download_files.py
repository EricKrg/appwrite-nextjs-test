import json
import os
import datetime
from configparser import ConfigParser
from appwrite.client import Client
from appwrite.services.storage import Storage


def download_bucket(bucket_id: str, storage: Storage, folder: str):
    res: dict = None
    try:
        res = storage.list_files(bucket_id=bucket_id)
        if not os.path.exists(folder):
            os.makedirs(folder)
        # write the bucket description to file, so we can use it to later
        # recreate the bucket-files with all their relations, like permission etc.
        with open(f"{folder}/{bucket_id}.json", "w") as meta_dump:
            json.dump(res, meta_dump)
    except Exception as eList:
        print("Error listing bucket files", eList)
        res = None

    if res is None: 
        raise ValueError("Error retrieving file list")

    errorFiles = []
    for file in res.get("files", []):
        try:
            download_file(bucket_id=bucket_id, file_id=f"{file.get('$id', '')}", file_name=f"{folder}/{file.get('name', '')}")
        except Exception as eRun: 
            errorFiles.append(file)
    # write failed downloads to the error log
    with  open(f"{folder}/{bucket_id}.dwn.error.json", "w") as errorLog:
        json.dump(errorFiles,errorLog)
        


def download_file(bucket_id: str, file_id: str, file_name: str):
    try:
        res = storage.get_file_download(bucket_id=bucket_id,file_id=file_id)
        with open(file_name, "wb") as b_file:
            b_file.write(res)
    except Exception as eDown:
        print("Error downloading file", eDown)
        raise Exception(f"Error downloading file id:{file_id} name: {file_name}")
    return res

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
    folder = "{}-{}".format(config["STORAGE"]["download_folder"],datetime.datetime.now().strftime("%m%d%Y-%H:%M:%S")) 
    bucket_id = config["STORAGE"]["bucket_id"]
    if bucket_exists(bucket_id=bucket_id):
        download_bucket(
            bucket_id=bucket_id, 
            storage=storage, 
            folder=folder)
    else:
        print(f"Error, the bucket id {bucket_id} does not match a bucket on the Server.")