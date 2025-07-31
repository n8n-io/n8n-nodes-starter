# ZapSign N8N Node Usage Examples

This document provides practical examples of how to use the ZapSign N8N nodes in your workflows.

## Prerequisites

Before using these examples, make sure you have:
1. A ZapSign account with API access
2. API credentials configured in n8n
3. The n8n-nodes-zapsign package installed

## Basic Document Workflow

### Example 1: Create and Send Document for Signature

This workflow creates a document, adds signers, and sends it for signature.

```json
{
  "name": "ZapSign Document Signature",
  "nodes": [
    {
      "parameters": {
        "resource": "document",
        "operation": "create",
        "name": "Employment Contract",
        "binaryPropertyName": "data",
        "additionalFields": {
          "locale": "en"
        }
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [820, 300],
      "id": "create-document",
      "name": "Create Document"
    },
    {
      "parameters": {
        "resource": "signer",
        "operation": "add",
        "documentId": "={{ $node['Create Document'].json.id }}",
        "signerEmail": "employee@company.com",
        "signerName": "John Doe",
        "authMethod": "email",
        "requireDocAuth": true
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [1040, 300],
      "id": "add-signer",
      "name": "Add Signer"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "send",
        "documentId": "={{ $node['Create Document'].json.id }}"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [1260, 300],
      "id": "send-document",
      "name": "Send for Signature"
    }
  ]
}
```

### Example 2: Document from Template

Create documents from existing templates with dynamic data.

```json
{
  "name": "Template-based Document Creation",
  "nodes": [
    {
      "parameters": {
        "resource": "template",
        "operation": "createDocument",
        "templateId": "template_123",
        "name": "Contract for {{ $json.clientName }}"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [820, 300],
      "id": "create-from-template",
      "name": "Create from Template"
    }
  ]
}
```

## Webhook Event Handling

### Example 3: Document Completion Workflow

This workflow triggers when a document is completed and sends notifications.

```json
{
  "name": "Document Completion Handler",
  "nodes": [
    {
      "parameters": {
        "events": ["document.completed", "document.signed"],
        "documentFilter": {}
      },
      "type": "n8n-nodes-zapsign.zapSignTrigger",
      "typeVersion": 1,
      "position": [300, 300],
      "id": "webhook-trigger",
      "name": "ZapSign Webhook"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.event }}",
              "operation": "equal",
              "value2": "document.completed"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [520, 300],
      "id": "check-event-type",
      "name": "Check Event Type"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "get",
        "documentId": "={{ $json.data.document.id }}"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [740, 300],
      "id": "get-document-details",
      "name": "Get Document Details"
    },
    {
      "parameters": {
        "fromEmail": "noreply@company.com",
        "toEmail": "manager@company.com",
        "subject": "Document Signed: {{ $node['Get Document Details'].json.name }}",
        "text": "The document '{{ $node['Get Document Details'].json.name }}' has been completed by all signers."
      },
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [960, 300],
      "id": "send-notification",
      "name": "Send Email Notification"
    }
  ]
}
```

## Advanced Workflows

### Example 4: Multi-Signer Contract Workflow

Handle contracts with multiple signers and different authentication methods.

```json
{
  "name": "Multi-Signer Contract",
  "nodes": [
    {
      "parameters": {
        "resource": "document",
        "operation": "create",
        "name": "Partnership Agreement",
        "binaryPropertyName": "data"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [300, 300],
      "id": "create-contract",
      "name": "Create Contract"
    },
    {
      "parameters": {
        "resource": "signer",
        "operation": "add",
        "documentId": "={{ $node['Create Contract'].json.id }}",
        "signerEmail": "ceo@company1.com",
        "signerName": "CEO Company 1",
        "authMethod": "email",
        "requireDocAuth": true,
        "requireFacialRecognition": true
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [520, 200],
      "id": "add-ceo1",
      "name": "Add CEO 1"
    },
    {
      "parameters": {
        "resource": "signer",
        "operation": "add",
        "documentId": "={{ $node['Create Contract'].json.id }}",
        "signerEmail": "ceo@company2.com",
        "signerName": "CEO Company 2",
        "authMethod": "whatsapp",
        "phoneNumber": "+1234567890",
        "requireDocAuth": true
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [520, 400],
      "id": "add-ceo2",
      "name": "Add CEO 2"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "send",
        "documentId": "={{ $node['Create Contract'].json.id }}"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [740, 300],
      "id": "send-contract",
      "name": "Send Contract"
    }
  ]
}
```

### Example 5: Automated Document Management

This workflow demonstrates automated document processing based on external triggers.

```json
{
  "name": "Automated Document Processing",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "new-hire"
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [200, 300],
      "id": "webhook-new-hire",
      "name": "New Hire Webhook"
    },
    {
      "parameters": {
        "resource": "template",
        "operation": "getAll",
        "limit": 10
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [420, 300],
      "id": "get-templates",
      "name": "Get Templates"
    },
    {
      "parameters": {
        "jsCode": "// Find employment contract template\nconst templates = $input.all();\nconst employmentTemplate = templates.find(t => \n  t.json.name.toLowerCase().includes('employment')\n);\n\nif (!employmentTemplate) {\n  throw new Error('Employment contract template not found');\n}\n\nreturn [{\n  json: {\n    templateId: employmentTemplate.json.id,\n    employeeName: $node['New Hire Webhook'].json.body.name,\n    employeeEmail: $node['New Hire Webhook'].json.body.email\n  }\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [640, 300],
      "id": "process-template",
      "name": "Process Template"
    },
    {
      "parameters": {
        "resource": "template",
        "operation": "createDocument",
        "templateId": "={{ $json.templateId }}",
        "name": "Employment Contract - {{ $json.employeeName }}"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [860, 300],
      "id": "create-employment-contract",
      "name": "Create Employment Contract"
    },
    {
      "parameters": {
        "resource": "signer",
        "operation": "add",
        "documentId": "={{ $node['Create Employment Contract'].json.id }}",
        "signerEmail": "={{ $node['Process Template'].json.employeeEmail }}",
        "signerName": "={{ $node['Process Template'].json.employeeName }}",
        "authMethod": "email"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [1080, 300],
      "id": "add-employee-signer",
      "name": "Add Employee as Signer"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "send",
        "documentId": "={{ $node['Create Employment Contract'].json.id }}"
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [1300, 300],
      "id": "send-employment-contract",
      "name": "Send Employment Contract"
    }
  ]
}
```

## Error Handling Examples

### Example 6: Robust Document Creation with Error Handling

```json
{
  "name": "Document Creation with Error Handling",
  "nodes": [
    {
      "parameters": {
        "resource": "document",
        "operation": "create",
        "name": "{{ $json.documentName || 'Untitled Document' }}",
        "binaryPropertyName": "data",
        "continueOnFail": true
      },
      "type": "n8n-nodes-zapsign.zapSign",
      "typeVersion": 1,
      "position": [400, 300],
      "id": "create-document-safe",
      "name": "Create Document (Safe)"
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $node['Create Document (Safe)'].json.error !== undefined }}",
              "value2": true
            }
          ]
        }
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [620, 300],
      "id": "check-for-errors",
      "name": "Check for Errors"
    },
    {
      "parameters": {
        "message": "Document creation failed: {{ $node['Create Document (Safe)'].json.error }}"
      },
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [840, 200],
      "id": "handle-error",
      "name": "Handle Error"
    },
    {
      "parameters": {
        "message": "Document created successfully: {{ $node['Create Document (Safe)'].json.id }}"
      },
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [840, 400],
      "id": "handle-success",
      "name": "Handle Success"
    }
  ]
}
```

## Common Patterns

### Document Status Monitoring

```javascript
// Check document status
const documentId = "{{ $json.documentId }}";
const status = "{{ $node['Get Document'].json.status }}";

switch (status) {
  case 'draft':
    return [{ json: { action: 'send_for_signature' } }];
  case 'pending':
    return [{ json: { action: 'wait_for_signatures' } }];
  case 'completed':
    return [{ json: { action: 'download_and_archive' } }];
  case 'cancelled':
    return [{ json: { action: 'notify_cancellation' } }];
  default:
    return [{ json: { action: 'unknown_status', status } }];
}
```

### Dynamic Signer Addition

```javascript
// Add multiple signers from a list
const signers = $json.signers; // Array of signer objects
const documentId = $json.documentId;

const results = [];

for (const signer of signers) {
  results.push({
    json: {
      documentId,
      signerEmail: signer.email,
      signerName: signer.name,
      authMethod: signer.preferredAuth || 'email',
      requireDocAuth: signer.requiresVerification || false
    }
  });
}

return results;
```

### Webhook Event Filtering

```javascript
// Filter webhook events by document type
const eventData = $json;
const documentName = eventData.data.document.name;

// Only process employment contracts
if (documentName.toLowerCase().includes('employment')) {
  return [eventData];
}

// Return empty array to filter out
return [];
```

## Best Practices

1. **Always use error handling**: Set `continueOnFail: true` for critical operations
2. **Validate input data**: Check for required fields before creating documents
3. **Use meaningful document names**: Include dynamic data like dates and names
4. **Implement proper logging**: Track document creation and signature status
5. **Handle webhook duplicates**: ZapSign may send duplicate webhook events
6. **Use environment variables**: Store API keys and configuration in n8n settings
7. **Test with sandbox**: Always test workflows in sandbox before production
8. **Monitor rate limits**: Implement backoff strategies for high-volume workflows

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify API key is correct
   - Check environment setting (sandbox vs production)
   - Ensure credentials are properly configured

2. **Document Upload Failed**
   - Verify file format is supported (PDF, DOC, DOCX)
   - Check file size limits
   - Ensure binary data is properly formatted

3. **Webhook Not Triggering**
   - Verify webhook URL is accessible
   - Check n8n webhook settings
   - Ensure events are properly configured

4. **Signer Addition Failed**
   - Verify email format is valid
   - Check authentication method requirements
   - Ensure document is in correct status

### Debug Tips

1. Use the "Execute node" feature to test individual operations
2. Check the browser network tab for API response details
3. Enable n8n debug mode for detailed logging
4. Test with minimal data first, then add complexity
5. Use the ZapSign dashboard to verify operations

For more examples and detailed API documentation, visit the [ZapSign API documentation](https://docs.zapsign.com.br/).