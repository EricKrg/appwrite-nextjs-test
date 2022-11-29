# What does that prototype do?

Test if the used technologies are applicable for a new project. The aim is to provide a baseline or template project 
to head start into the next project. 

Used here:
- Appwrite as BaaS
    - Authentication and user control
    - CRUD Operations and Datastorage
    - Realtime updates to sync changes between clients
    - Functions to extend Backend functionality
- React and NextJS to build the Frontend-Application
    - Routing, Layouting and SSR
- Tailwind as easy and beautiful CSS-Framework 
    - Daisy UI for prebuilt components with Tailwind
- Vagrant to create reproducable virtual machines
- Docker to create reproducabel software containers


## How can I install it?

Install the frontend dependencies `cd todo-12 && npm i`

Requieres `node >= 12.x.x`

## How can I run it?

1. Start the vagrant-box with `vagrant up` watch the stacktrace for possible errors.   
**optional** you can start the Containers directly with `cd vagrant_data/appwrite && docker-compose up -d --remove-orphans`  
**known issue** it is possible that docker will throw the error *too many pulls*, if thats the case you will need to pull the images seperately and then start Appwrite again.

    ### First time backend setup
    - open the Backend Dashboard `http://localhost:8000`
    - create Admin User Account
    - create a new Project and copy the `ProjectID`
    - inside the new Project create new `API-Key` with all Scopes (Overview/Integrations/API Keys)

    - Copy the `ProjectID` and the `API-Key` in the corresponding fields of the `migrate/config.ini` 
    - **optional** Update other values in the `migrate/config.ini` like `endpoint` or `DB.name`
    - execute the scripts in `migrate/` (python3)
        - `create_accounts.py` creates User-Accounts defined in `config.ini [ACCOUNTS]`
        - `create_db.py` creates the database, collection and collection-attributes as well as the permissions. The script displays the `database-id` as well as the `collection-id` you will need those ids for the Frontend setup (you can also get those ids in the Backend Dashboard)

    ### First time frontend setup
    - replace the values for the `projectID`, `collectionID` and `databaseID` in the `utils/config.ts` before you run the frontend for the first time


2. Start the Frontend-Application with `cd todo-12 && npm run dev`
3. Use the application under `http://localhost:3000`
