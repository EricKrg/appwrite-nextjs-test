

import * as sdk from "node-appwrite";

/*
    This function runs every time a doc is updated (see events of this function in the appwrite.json)
    It list all docs and collections.

  'req' variable has:
    'headers' - object with request headers
    'payload' - object with request body data
    'variables' - object with environment variables
  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200
  If an error is thrown, a response with code 500 will be returned.
*/




interface AppwriteRequest {
  headers: { [name: string]: string };
  payload: string;
  variables: { [name: string]: string };
}

interface AppwriteResponse {
  send: (string, number?) => {};
  json: (object, number?) => {};
}
module.exports =  async function (req: any, res: any) {


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

  let database = new sdk.Databases(client);

  console.log("test-fun request:", req);
  console.log("test-fun variables:", req.variables);

  try {
    const payloadData = JSON.parse(req.payload);
    console.log("payload data", payloadData);  
  } catch (error) {
    console.log("Error parsing JSON", error);
  }

  try {
    const eventData = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"]);
    console.log("event data", eventData);  
  } catch (error) {
    console.log("Error parsing JSON", error);
  }

  try {
    console.log("fetch docs");
    const docs = await database.listDocuments(req.variables["DATABASE_ID"], "6377552b559b49cb309a");
    console.log("docs", docs);
  } catch (error) {
    console.log("error fetching docs", error+"")
  }

  try {
    const collections = await database.listCollections(req.variables["DATABASE_ID"]);  
    console.log("collections", collections);
  } catch (error) {
    console.log("error fetching collections", error, req.variables["DATABASE_ID"]);
  }
  res.send("Finshed cloud function!");
};