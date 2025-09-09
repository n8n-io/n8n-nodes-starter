# n8n-nodes-digitalocean-serverless-inference

This is an n8n community node for the [DigitalOcean Gradient™ AI Platform Serverless Inference API](https://gradientai-sdk.digitalocean.com/api/resources/chat/). It provides access to DigitalOcean Gradient™ AI Platform's large language models through n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)   
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Installation

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `@digitalocean/n8n-nodes-digitalocean-serverless-inference` in **Enter npm package name**
4. Agree to the risks of using community nodes
5. Select **Install**

**Note:** After installation, you need to restart your n8n instance for the new node to be recognized.

### Chat Completion

Create chat completions using DigitalOcean Gradient™ AI Serverless Inference LLMs. The node supports:

- Multiple messages with system, user, and assistant roles
- [Multiple Models](https://docs.digitalocean.com/products/gradient-ai-platform/details/models/)
- Customizable parameters conforming to the [API Specification](https://gradientai-sdk.digitalocean.com/api/resources/chat/subresources/completions/methods/create)

## Credentials

To use this node, you need a [Model Access Key](https://docs.digitalocean.com/products/gradient-ai-platform/how-to/use-serverless-inference/#create) from DigitalOcean Gradient™ AI Platform

## Compatibility

- Requires n8n version 1.0.0 or later
- Tested up to n8n version 1.106.3

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [DigitalOcean Gradient™ AI Serverless Inference documentation](https://docs.digitalocean.com/products/gradient-ai-platform/how-to/use-serverless-inference/)

## Version History

### 1.0.0

- Initial usable release

## License

[MIT](LICENSE.md)