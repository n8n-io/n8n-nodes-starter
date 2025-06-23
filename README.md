![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-starter

This repo contains example nodes to help you get started building your own custom integrations for [n8n](https://n8n.io). It includes the node linter and other dependencies.

To make your custom node available to the community, you must create it as an npm package, and [submit it to the npm registry](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

If you would like your node to be available on n8n cloud you can also [submit your node for verification](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/).

## Prerequisites

You need the following installed on your development machine:

* Docker and Docker Compose
* NodeJS, npm and pnpm (Execture npm install -g pnpm@latest-10 after installing npm)

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

## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

1. [Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template repository.
2. Clone your new repo:
   ```
   git clone https://github.com/<your organization>/<your-repo-name>.git
   ```
3. Run `npm i` to install dependencies.
4. Open the project in your editor.
5. Browse the examples in `/nodes` and `/credentials`. Modify the examples, or replace them with your own nodes.
6. Update the `package.json` to match your details.
7. Run `npm run lint` to check for errors or `npm run lintfix` to automatically fix errors when possible.
8. Test your node locally. Refer to [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for guidance.
9. Replace this README with documentation for your node. Use the [README_TEMPLATE](README_TEMPLATE.md) to get started.
10. Update the LICENSE file to use your details.
11. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.

## More information

Refer to our [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
