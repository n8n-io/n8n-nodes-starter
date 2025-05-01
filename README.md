![Base Builder Banner](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# Base Agent Builder: No-Code AI Agents for Onchain Automation

**Empowering creators, developers, indie hackers, and businesses to automate Base blockchain workflows with AI—no coding required.**

---

## Overview

Base Agent Builder is a drag-and-drop platform that enables anyone to create, customize, and deploy autonomous AI agents for onchain tasks on the Base blockchain. Inspired by n8n's visual workflow builder and powered by Coinbase’s AgentKit, this project bridges the gap between blockchain automation and no-code accessibility.

- **Visual Workflow Builder:** Intuitive, drag-and-drop interface for creating onchain automations.
- **AgentKit Integration:** Native support for Base blockchain actions—wallets, smart contracts, transactions, NFT management, and more.
- **AI-Powered:** Seamlessly connect to LLMs (e.g., GPT-4) for intelligent decision-making.
- **Starter Packs:** Pre-built workflows for trading bots, NFT management, DAO governance, and more.
- **Farcaster Integration:** Post updates or confirmations to Farcaster channels directly from your workflows.

---

## Key Features

- **No-Code Visual Editor:** Build complex onchain automations using blocks for AI, blockchain, and data processing.
- **Pre-Built Templates:** Start with ready-to-use workflows (e.g., Trading Bot, NFT Sniper, DAO Voter).
- **Custom n8n Nodes:** Extend n8n with AgentKit-powered nodes for Base blockchain and Farcaster integration.
- **Secure Wallet & API Management:** Safely connect wallets and manage API keys.
- **Deploy Anywhere:** Run locally or deploy to your own cloud backend (AWS, Vercel, etc.).

---

## Supported Starter Workflows

| Workflow                 | Description                                                    |
|--------------------------|----------------------------------------------------------------|
| Automated Trading Bot    | Monitors DEX prices, executes AI-driven trades on Base.         |
| NFT Management Bot       | Searches, buys, or mints NFTs based on criteria.                |
| DAO Governance Agent     | Analyzes proposals and votes autonomously.                      |
| Yield Farming Optimizer  | Adjusts DeFi positions for optimal returns.                     |
| Cross-Chain Transfer     | Facilitates asset transfers across blockchains.                 |
| Onchain Data Analysis    | Analyzes blockchain data and triggers actions.                  |
| Farcaster AI Workflows   | Posts workflow results/status to Farcaster channels.            |

---

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and pnpm. Minimum version Node 18. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
  ```
  pnpm install n8n -g
  ```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

### Local Installation

1. Clone the repository:
```bash
git clone https://github.com/BaseBuildr/n8n-base-agent
cd n8n-base-agent
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Link to your n8n installation:
```bash
npm link
cd ~/.n8n/nodes
npm link n8n-base-agent
```

### Global Installation (via npm)

```bash
npm install -g n8n-base-agent
```

## Customization & Branding

- **Base Branding:**
  - Blue palette, Base Builder logo, and updated UI elements.
  - Sidebar and header text: "Base Agent Builder"
  - Base-specific node categories: "Base Onchain Actions"
- **UI Simplification:**
  - Highlight Base-related nodes for easy discovery.

---

## Custom Node Development

Custom nodes are built using [n8n-nodes-starter](https://github.com/n8n-io/n8n-nodes-starter) and integrate with AgentKit and other APIs.

### Example Custom Nodes

- **Price Query Node:**
  - Queries DEX (e.g., Uniswap) for token pair prices via AgentKit.
  - **Inputs:** DEX address, token pair
  - **Outputs:** Latest price, liquidity, etc.
- **AI Analysis Node:**
  - Uses GPT-4 to generate trading signals.
  - **Inputs:** Price data, historical data
  - **Outputs:** Buy/sell/hold signal
- **Transaction Node:**
  - Executes trades on Base Sepolia via AgentKit.
  - **Inputs:** Wallet, trade params
  - **Outputs:** Transaction hash, status
- **Farcaster Node:**
  - Posts messages (e.g., tx hash, status) to Farcaster channels.
  - **Inputs:** Farcaster credentials, message
  - **Outputs:** Post confirmation

### Node Packaging
- All custom nodes are packaged as an n8n module for easy reuse and sharing.

---

## Starter Workflow: Trading Bot

1. **Import the Trading Bot Workflow:**
   - Go to n8n → Workflows → Import → Select `starter/trading-bot.json`
2. **Configure Nodes:**
   - Set Uniswap address, ETH/USDC pair, and strategy parameters
   - Connect your wallet and API keys
3. **Run the Workflow:**
   - Watch as the bot fetches prices, generates AI signals, executes trades, and posts results to Farcaster!

---

## Integrations

- **Base Blockchain:** [Coinbase AgentKit](https://docs.base.org/agentkit)
- **AI Models:** OpenAI (GPT-4), others coming soon
- **Farcaster:** [Farcaster API](https://docs.farcaster.xyz/)
- **n8n:** [n8n.io](https://n8n.io/)

---

## Testing & Security

- **Unit tests** for all custom nodes (see `/nodes/__tests__`)
- **End-to-end workflow testing** for Trading Bot and others
- **Wallet Integration:** MetaMask on Base Sepolia
- **Secure API Key Handling:** Environment variables for all secrets

---

## Deployment

- Deploy to your own backend (AWS, Vercel, etc.)
- Configure environment variables for OpenAI, Coinbase/AgentKit, Farcaster
- Access your instance at `http://your-backend:5678`

---

## Documentation

- **Setup Guide:** How to deploy and configure your n8n instance
- **Import Workflows:** Steps to use starter templates
- **Node Reference:** Inputs, outputs, and usage for each custom node
- **Developer Docs:** How to extend and build new nodes

---

## Contributing & Support

- PRs and issues welcome!
- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- Join the community on [Discord](https://discord.gg/n8n)

---

## License

[MIT](LICENSE.md)

---


## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

