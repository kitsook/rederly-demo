## Rederly demo

[Rederly](https://rederly.com/) is an online homework & exam delivery platform that utilizes the WeBWorK [Open Problem Library](https://github.com/openwebwork/webwork-open-problem-library). This project helps to run the Rederly stack (frontend + backend + db + renderer) with demo data preloaded.

**Note that this is not an offical project of Rederly.**  These scripts simply pull the [source code](https://github.com/rederly/), build the Docker images, and preload some demo data into the database.

A copy of this demo is running on Azure: [https://rederly-demo.azurewebsites.net/](https://rederly-demo.azurewebsites.net/)


## Quick Start
Assuming you have Docker environment setup already:
```
git clone https://github.com/kitsook/rederly-demo.git
cd rederly-demo
# optionally, run "make" to build Docker images from source. this will take some time though
make
docker-compose up -d
```

Give it a minute or two for the data preload to finish.

Navigate to `http://localhost:1800` from your browser.  Login with `prof1@example.com` / `letmein`. The renderer engine can also be accessed directly with `http://localhost:3000`


## Demo Data
During startup, the backend container will drop the database and re-initialize it with demo data.  This can be disabled by changing the environment variable `DATA_PRELOAD` to `0` (e.g. edit the `docker-compose.yaml` file)

Demo data is loaded by the script `deploy/background/demo-db-preload.ts`.  Edit it to change how many courses/professors/students/questions etc to preload.

Professor logins: `prof1@example.com`, `prof2@example.com`, ... etc

Student logins: `student1@example.com`, `student2@example.com`, ... etc

Same password for all logins: `letmein`
