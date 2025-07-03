![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

n8n-nodes-starter
=================

This repo is a template to start building your own custom integrations for [n8n](https://n8n.io).

It contains instructions for how to develop your own custom nodes, as well as publishing them so others in the n8n community can use them.

For a comprehensive guide on creating your nodes, see [this page in the documentation](https://docs.n8n.io/integrations/creating-nodes/overview/).

Getting started
---------------
First, you'll need to make your own copy of this repo:

1. [Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template repository.
1. Install [git](https://git-scm.com/downloads), if you don't have it already
1. Clone this repo to your local machine:
   ```
   git clone https://github.com/<your organization>/<your-repo-name>.git
   ```

Second, you'll need to prepare your environment to develop on the nodes in this repository. This means:

- Installing `npm`
- Building the nodes in this repository
- Getting a running n8n instance
- Linking your nodes into the running n8n instance

You can do this in one of two ways:

### Option 1: Use the devcontainer (recommended)
This repo has [a VSCode devcontainer spec](.devcontainer/devcontainer.json) with all the tooling you need to work on your custom nodes in a Docker container sandbox.

To use:

1. Install [Docker](https://www.docker.com/) and start it
1. [Install VSCode](https://code.visualstudio.com/)
1. Install the VSCode [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
1. Open your local clone of this repository
1. Choose "Reopen in Container" when the popup appears saying, "Folder contains a Dev Container configuration file. Reopen folder to develop in a container?"
1. Wait for the container to build and open
1. Visit [localhost:5678](http://localhost:5678/) to open the n8n instance running inside the devcontainer
1. In a workflow, for "Example Node" to ensure that the nodes in this repo are being picked up properly

### Option 2: Bring your own environment
You can also bring your own environment. 

To start, you'll need to follow [this guide for setting up your local n8n development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

Then you'll need to link your node into your running n8n instance using [these steps](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/).

After restarting n8n, you should be able to search for "Example Node" to ensure that the nodes in this repo are being picked up properly.

Development
-----------
Development means modifying the examples in `/nodes` and `/credentials`, and restarting the n8n server to pick up the changes (n8n doesn't have live reload).

_NOTE: you can use `npm run lint` to check for linting errors, and `npm run lintfix` to try and automatically fix errors._

### Devcontainer
1. Make your changes
1. Quit the terminal process in VSCode running the n8n server
1. Run `start-n8n-with-custom-node.sh`
1. Repeat

### Your own environment
1. Make your changes
1. Quit the n8n process (however you started it)
1. Restart it
1. Repeat

Publishing
----------
When you're ready to share your nodes with the community, do the following:

1. Update the following fields in `package.json` to match your details:
    - `name`
    - `description`
    - `version`
    - `description`
    - `repository`
    - `homepage`
    - `author.name`
    - `author.email`
1. Replace this README with documentation for your node. Use the [README_TEMPLATE](README_TEMPLATE.md) to get started.
10. Update the [LICENSE](LICENSE.md) file to contain your own name at the top.
11. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.


License
-------

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
