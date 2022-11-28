

import * as sdk from "node-appwrite";

/*
    This function runs every time a doc is updated or created and checks the permission array
    if a blacklisted Permission is set the corresponding doc. will be update.

    TODO:
    if a doc. is updated because of a blacklisted permission this update will result in another
    call of this function, maybe in the future this should be updated so that a certain type of doc. 
    is created by calling a function with relevant payload to create the doc. as well as the relevant
    permissions.
*/




interface AppwriteRequest {
  headers: { [name: string]: string };
  payload: string;
  variables: { [name: string]: string };
}


const permissionBlackList = [
  sdk.Permission.create(sdk.Role.any()),
  sdk.Permission.create(sdk.Role.users()),
  sdk.Permission.delete(sdk.Role.any()),
  sdk.Permission.delete(sdk.Role.users()),
  sdk.Permission.update(sdk.Role.any()),
  sdk.Permission.update(sdk.Role.users()),
  sdk.Permission.write(sdk.Role.any()),
  sdk.Permission.write(sdk.Role.users()),
  sdk.Permission.read(sdk.Role.any()),
  sdk.Permission.read(sdk.Role.users())
];

interface AppwriteResponse {
  send: (string, number?) => {};
  json: (object, number?) => {};
}

interface TaskRecord extends sdk.Models.Document {
  task: string,
  taskState: boolean
}

module.exports =  async function (req: AppwriteRequest, res: AppwriteResponse) {


  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_API_KEY"]
  ) {
    throw Error(
      "variables are not set. Function cannot use Appwrite SDK."
    );
  }
  const client = new sdk.Client();

  client
    .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
    .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"]);

  const database = new sdk.Databases(client);
  let resString = "permisson check successfull";

  try {
    const payloadData = JSON.parse(req.payload);
    console.log("payload data", payloadData);  
  } catch (error) {
    console.log("Error parsing JSON", error);
  }

  try {
    const eventData: TaskRecord = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"]);
    console.log("event data", eventData);  
    const permissions = eventData.$permissions.filter(i => {
      console.log("permission", i)
      return !permissionBlackList.includes(i);
    })

    if (permissions.length !== eventData.$permissions.length) {
      console.log("update doc")
      const updated = await database.updateDocument(
        eventData.$databaseId, eventData.$collectionId, eventData.$id, {task: eventData.task, taskState: eventData.taskState }, permissions);
      console.log("updated", updated);
      resString = `Updated permission string for doc ${eventData.$id}`;
    }
    console.log("filter permission", permissions);
    
  } catch (error) {
    console.log("Error parsing JSON", error+"");
  }

  res.send(resString, 200);
};