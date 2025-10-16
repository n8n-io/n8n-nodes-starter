![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-starter

This starter repository helps you build custom integrations for [n8n](https://n8n.io). It includes example nodes, credentials, the node linter, and all the tooling you need to get started.

## Quick Start

> [!TIP]
> **New to building n8n nodes?** The fastest way to get started is with `npm create @n8n/node`. This command scaffolds a complete node package for you using the [@n8n/node-cli](https://www.npmjs.com/package/@n8n/node-cli).

**To create a new node package from scratch:**

```bash
npm create @n8n/node
```

**Already using this starter? Start developing with:**

```bash
npm run dev
```

This starts n8n with your nodes loaded and hot reload enabled.

## What's Included

This starter repository includes two example nodes to learn from:

- **[Example Node](nodes/Example/)** - A simple starter node that shows the basic structure with a custom `execute` method
- **[GitHub Issues Node](nodes/GithubIssues/)** - A complete, production-ready example built using the **declarative style**:
  - **Low-code approach** - Define operations declaratively without writing request logic
  - Multiple resources (Issues, Comments)
  - Multiple operations (Get, Get All, Create)
  - Two authentication methods (OAuth2 and Personal Access Token)
  - List search functionality for dynamic dropdowns
  - Proper error handling and typing
  - Ideal for HTTP API-based integrations

> [!TIP]
> The declarative/low-code style (used in GitHub Issues) is the recommended approach for building nodes that interact with HTTP APIs. It significantly reduces boilerplate code and handles requests automatically.

Browse these examples to understand both approaches, then modify them or create your own.

## Finding Inspiration

Looking for more examples? Check out these resources:

- **[npm Community Nodes](https://www.npmjs.com/search?q=keywords:n8n-community-node-package)** - Browse thousands of community-built nodes on npm using the `n8n-community-node-package` tag
- **[n8n Built-in Nodes](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes)** - Study the source code of n8n's official nodes for production-ready patterns and best practices
- **[n8n Credentials](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/credentials)** - See how authentication is implemented for various services

These are excellent resources to understand how to structure your nodes, handle different API patterns, and implement advanced features.

## Prerequisites

Before you begin, install the following on your development machine:

### Required

- **[Node.js](https://nodejs.org/)** (v22 or higher) and npm
  - Linux/Mac/WSL: Install via [nvm](https://github.com/nvm-sh/nvm)
  - Windows: Follow [Microsoft's NodeJS guide](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)
- **[git](https://git-scm.com/downloads)**

### Recommended

- Follow n8n's [development environment setup guide](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/)

> [!NOTE]
> The `@n8n/node-cli` is included as a dev dependency and will be installed automatically when you run `npm install`. The CLI includes n8n for local development, so you don't need to install n8n globally.

## Getting Started with this Starter

Follow these steps to create your own n8n community node package:

### 1. Create Your Repository

[Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template, then clone it:

```bash
git clone https://github.com/<your-organization>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required dependencies including the `@n8n/node-cli`.

### 3. Explore the Examples

Browse the example nodes in [nodes/](nodes/) and [credentials/](credentials/) to understand the structure:

- Start with [nodes/Example/](nodes/Example/) for a basic node
- Study [nodes/GithubIssues/](nodes/GithubIssues/) for a real-world implementation

### 4. Build Your Node

Edit the example nodes to fit your use case, or create new node files by copying the structure from [nodes/Example/](nodes/Example/).

> [!TIP]
> If you want to scaffold a completely new node package, use `npm create @n8n/node` to start fresh with the CLI's interactive generator.

### 5. Configure Your Package

Update `package.json` with your details:

- `name` - Your package name (must start with `n8n-nodes-`)
- `author` - Your name and email
- `repository` - Your repository URL
- `description` - What your node does

Make sure your node is registered in the `n8n.nodes` array.

### 6. Develop and Test Locally

Start n8n with your node loaded:

```bash
npm run dev
```

This command runs `n8n-node dev` which:

- Builds your node with watch mode
- Starts n8n with your node available
- Automatically rebuilds when you make changes
- Opens n8n in your browser (usually http://localhost:5678)

You can now test your node in n8n workflows!

> [!NOTE]
> Learn more about CLI commands in the [@n8n/node-cli documentation](https://www.npmjs.com/package/@n8n/node-cli).

### 7. Lint Your Code

Check for errors:

```bash
npm run lint
```

Auto-fix issues when possible:

```bash
npm run lint:fix
```

### 8. Build for Production

When ready to publish:

```bash
npm run build
```

This compiles your TypeScript code to the `dist/` folder.

### 9. Prepare for Publishing

Before publishing:

1. **Update documentation**: Replace this README with your node's documentation. Use [README_TEMPLATE.md](README_TEMPLATE.md) as a starting point.
2. **Update the LICENSE**: Add your details to the [LICENSE](LICENSE.md) file.
3. **Test thoroughly**: Ensure your node works in different scenarios.

### 10. Publish to npm

Publish your package to make it available to the n8n community:

```bash
npm publish
```

Learn more about [publishing to npm](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

### 11. Submit for Verification (Optional)

Get your node verified for n8n Cloud:

1. Ensure your node meets the [requirements](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/):
   - Uses MIT license ✅ (included in this starter)
   - No external package dependencies
   - Follows n8n's design guidelines
   - Passes quality and security review

2. Submit through the [n8n Creator Portal](https://creators.n8n.io/nodes)

**Benefits of verification:**

- Available directly in n8n Cloud
- Discoverable in the n8n nodes panel
- Verified badge for quality assurance
- Increased visibility in the n8n community

## Available Scripts

This starter includes several npm scripts to streamline development:

| Script                | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `npm run dev`         | Start n8n with your node and watch for changes (runs `n8n-node dev`) |
| `npm run build`       | Compile TypeScript to JavaScript for production (runs `n8n-node build`) |
| `npm run build:watch` | Build in watch mode (auto-rebuild on changes)                    |
| `npm run lint`        | Check your code for errors and style issues (runs `n8n-node lint`) |
| `npm run lint:fix`    | Automatically fix linting issues when possible (runs `n8n-node lint --fix`) |
| `npm run release`     | Create a new release (runs `n8n-node release`)                   |

> [!TIP]
> These scripts use the [@n8n/node-cli](https://www.npmjs.com/package/@n8n/node-cli) under the hood. You can also run CLI commands directly, e.g., `npx n8n-node dev`.

## Troubleshooting

### My node doesn't appear in n8n

1. Make sure you ran `npm install` to install dependencies
2. Check that your node is listed in `package.json` under `n8n.nodes`
3. Restart the dev server with `npm run dev`
4. Check the console for any error messages

### Linting errors

Run `npm run lint:fix` to automatically fix most common issues. For remaining errors, check the [n8n node development guidelines](https://docs.n8n.io/integrations/creating-nodes/).

### TypeScript errors

Make sure you're using Node.js v22 or higher and have run `npm install` to get all type definitions.

## Resources

- **[n8n Node Documentation](https://docs.n8n.io/integrations/creating-nodes/)** - Complete guide to building nodes
- **[n8n Community Forum](https://community.n8n.io/)** - Get help and share your nodes
- **[@n8n/node-cli Documentation](https://www.npmjs.com/package/@n8n/node-cli)** - CLI tool reference
- **[n8n Creator Portal](https://creators.n8n.io/nodes)** - Submit your node for verification
- **[Submit Community Nodes Guide](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/)** - Verification requirements and process

## Contributing

Have suggestions for improving this starter? [Open an issue](https://github.com/n8n-io/n8n-nodes-starter/issues) or submit a pull request!

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
