# n8n-nodes-zapsign

This is an n8n community node that lets you use ZapSign's digital signature API in your n8n workflows.

[ZapSign](https://zapsign.co) is a digital signature platform that enables you to create, send, and manage legally binding electronic signatures for your documents.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-zapsign` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes.
5. Select **Install**.

After installing the node, you can use it like any other node in n8n.

### Manual Installation

To get started install the package in your n8n root directory:

```bash
npm install n8n-nodes-zapsign
```

For Docker-based deployments add the following line before the font installation command in your n8n Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-zapsign
```

## Credentials

You'll need to set up ZapSign API credentials to use this node:

1. Sign up for a [ZapSign account](https://zapsign.co)
2. Go to your ZapSign dashboard
3. Navigate to API settings and generate an API key
4. In n8n, create new ZapSign API credentials with:
   - **API Key**: Your ZapSign API key
   - **Environment**: Choose between Production or Sandbox

## Operations

### ZapSign Node

The ZapSign node supports the following resources and operations:

#### Document
- **Create**: Upload and create a new document
- **Get**: Retrieve document details
- **Get All**: List all documents
- **Send**: Send document for signature
- **Cancel**: Cancel a document
- **Download**: Download a signed document

#### Signer
- **Add**: Add a signer to a document
- **Get All**: Get all signers of a document
- **Remove**: Remove a signer from a document
- **Update**: Update signer information

#### Template
- **Get All**: List all available templates
- **Create Document From Template**: Create a new document from a template

#### Webhook
- **Create**: Create a webhook for event notifications
- **Get All**: List all webhooks
- **Delete**: Delete a webhook

### ZapSign Trigger Node

The ZapSign Trigger node allows you to start workflows when ZapSign events occur:

#### Supported Events
- **Document Created**: When a document is created
- **Document Sent**: When a document is sent for signature
- **Document Viewed**: When a document is viewed by a signer
- **Document Signed**: When a document is signed by any signer
- **Document Completed**: When all signers have signed the document
- **Document Cancelled**: When a document is cancelled
- **Document Expired**: When a document expires
- **Signer Added**: When a signer is added to a document
- **Signer Signed**: When a specific signer signs
- **Signer Declined**: When a signer declines to sign

## Example Workflows

### Document Signature Workflow

1. **HTTP Request**: Receive document upload request
2. **ZapSign**: Create document with uploaded file
3. **ZapSign**: Add signers to the document
4. **ZapSign**: Send document for signature
5. **ZapSign Trigger**: Wait for document completion
6. **Email**: Send notification when document is signed

### Template-Based Document Creation

1. **Schedule Trigger**: Run daily
2. **Google Sheets**: Get contract data
3. **ZapSign**: Create document from template
4. **ZapSign**: Add signers from spreadsheet
5. **ZapSign**: Send for signature
6. **Slack**: Notify team

### Webhook Event Processing

1. **ZapSign Trigger**: Listen for document events
2. **Switch**: Route based on event type
3. **Database**: Update document status
4. **Email**: Send appropriate notifications

## Authentication Methods

ZapSign supports multiple authentication methods for signers:

- **Email**: Simple email verification
- **SMS**: SMS code verification
- **WhatsApp**: WhatsApp code verification

Additional security features:
- **Document Authentication**: Require ID document upload
- **Facial Recognition**: Verify identity through facial recognition
- **Biometric GOV+**: Government database validation (Brazil)

## API Endpoints Structure

The node assumes the following ZapSign API structure:

```
Base URL: https://api.zapsign.co (Production)
         https://sandbox.api.zapsign.co (Sandbox)

Documents:
- POST /v1/documents - Create document
- GET /v1/documents - List documents
- GET /v1/documents/{id} - Get document
- POST /v1/documents/{id}/send - Send document
- POST /v1/documents/{id}/cancel - Cancel document
- GET /v1/documents/{id}/download - Download document

Signers:
- POST /v1/documents/{id}/signers - Add signer
- GET /v1/documents/{id}/signers - List signers
- PUT /v1/documents/{id}/signers/{email} - Update signer
- DELETE /v1/documents/{id}/signers/{email} - Remove signer

Templates:
- GET /v1/templates - List templates
- POST /v1/documents/from-template - Create from template

Webhooks:
- POST /v1/webhooks - Create webhook
- GET /v1/webhooks - List webhooks
- DELETE /v1/webhooks/{id} - Delete webhook
```

## Error Handling

The node includes comprehensive error handling:

- **Authentication errors**: Invalid API key or expired tokens
- **Rate limiting**: Automatic retry with exponential backoff
- **Validation errors**: Missing required fields or invalid data
- **Network errors**: Connection timeouts and retries

All errors are properly formatted and include helpful context for debugging.

## Compatibility

- n8n v0.187.0 and above
- Node.js v18.10 and above

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [ZapSign API Documentation](https://docs.zapsign.com.br/)
- [ZapSign Website](https://zapsign.co)

## Support

For support with this community node:

1. Check the [ZapSign API documentation](https://docs.zapsign.com.br/)
2. Review the [n8n community forum](https://community.n8n.io/)
3. Open an issue on this repository

For ZapSign-specific questions, contact ZapSign support at support@zapsign.co

## License

[MIT](https://github.com/zapsign/n8n-nodes-zapsign/blob/main/LICENSE.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### 1.0.0
- Initial release
- Support for Document, Signer, Template, and Webhook operations
- ZapSign Trigger node for webhook events
- Complete authentication and error handling
- Support for both Production and Sandbox environments
