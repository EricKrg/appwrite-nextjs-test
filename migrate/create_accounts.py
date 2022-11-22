import requests
import json
import uuid
from configparser import ConfigParser


if __name__ == "__main__":
    config = ConfigParser()
    config.read("config.ini")
    url =f"{config['HOST']['endpoint']}/account"
    print("url", url)

    headers = {
        'x-appwrite-project': config["HOST"]["projectid"],
        'Content-Type': 'application/json'
    }

    accounts = json.loads(config.get("ACCOUNTS","elements"))

    for account in accounts:
        account["userId"]=str(uuid.uuid4())
        try:
            response = requests.request(
                "POST",
                url, 
                headers=headers,
                data=json.dumps(account))
            print(response.text)
        except Exception as e:
            print(e)
            print(f"Account creation failed ${account}.")
