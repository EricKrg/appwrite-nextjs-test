# What does that prototype do?

Test if the used technologies are applicable for a new project. The aim is to provide a baseline or template project 
to head start into the next project. 

Used here:
- Appwrite as BaaS
    - Authentication 
    - CRUD Operations and Datastorage
    - Realtime updates to sync changes between clients
- React and NextJS to build the Frontend-Application
    - Routing, Layouting and SSR
- Tailwind as easy and beautiful CSS-Framework 
- Vagrant to create reproducable virtual machines
- Docker to create reproducabel software containers

## How can I install it?

Install the frontend dependencies `cd todo-12 && npm i`

Requieres `node >= 12.x.x`


## How can I run it?

1. Start the vagrant-box with `vagrant up` watch the stacktrace for possible errors.   
**optional** you can start the Containers directly with `cd vagrant_data/appwrite && docker-compose up -d --remove-orphans`  
**known issue** it is possible that docker will throw the error *too many pulls*, if thats the case you will need to pull the images seperately and then start Appwrite again.

2. Start the Frontend-Application with `cd todo-12 && npm run dev`
3. Use the application under `http://localhost:3000`
