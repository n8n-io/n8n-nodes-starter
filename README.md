## Prerequisites

You need the following installed on your development machine:

* Docker and Docker Compose
* NodeJS, npm and pnpm (Execute npm install -g pnpm@latest-10 after installing npm)

Once you have cloned the repository:

* Execute:
  ```
  npm i
  ```

To run the local n8n instance:

* Execute:
  ```
  docker compose up -d
  ```
  Now, n8n will run on http://localhost:5678.

When changes are made to the custom node code and you want to test it on the local instance:

* There is a script file called deploy-node.sh. Once executed, it will build the custom node code and deploy the Docker container. This file requires a few changes depending on the name that Docker gives to the container and the volumes:

  * On line 24 of the script, you will see this line:
    ```
    TARGET_DIR="/var/lib/docker/volumes/n8n-self-hosted_n8n_data/_data/custom/$PACKAGE_NAME"
    ```
  
  * Depending on the container volume name, "n8n-self-hosted_n8n_data" needs to be changed. To check the volume's name, execute:

    ```
    docker volume ls
    ```

  * On lines 56 and 59, "n8n-self-hosted-n8n-1" must be changed to match the name of the container for the n8n instance.

  * Once these changes are made, execute the script:
    ```
    ./deploy-node.sh
    ```