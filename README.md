# n8n-nodes-acumba

This is an n8n community node. It lets you use **Acumbamail** in your n8n workflows.

**Acumbamail** is an email marketing and automation platform that provides tools for managing subscriber lists, creating and sending campaigns, and tracking performance through its API.

> [!IMPORTANT]
> This node is **not an official integration** and is **not affiliated with Acumbamail**.  
> It was developed by **fuseprods** as a **learning project** during the *n8n + Platzi* course.  
> As such, it may contain **bugs, incomplete features, or potential vulnerabilities**.  
> **Use it at your own risk** and avoid using it in production environments.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation to install this package.

Once installed, search for **Acumbamail** in the n8n node panel to start using it in your workflows.

---

## Operations

This node is trying to support the following operations:

| Resource | Operation | Description |
|-----------|------------|-------------|
| **Lists** | `Get All` | Retrieve all subscriber lists from your Acumbamail account. |
| **Subscribers** | `Add` | Add a new subscriber to a selected list. |

> Additional operations will be added in future versions as the project evolves.

---

## Credentials

This node uses **API Key authentication**.

1. Log in to your [Acumbamail account](https://acumbamail.com/).  
2. Go to **Your Account → Integrations → API** and copy your auth_token.  
3. In n8n, open the **Credentials** menu.  
4. Create a new **Acumbamail API Key** credential and paste your key.  
5. Test and save the credentials.

> The node will use this API key to authenticate all requests to the Acumbamail API.
>
>⚠️ [WARNING]⚠️
>
>**Do not share the auth_token publicly - It grants full access to your account!**

---

## Compatibility

- **Minimum n8n version:** 1.40.0  
- **Tested with:** n8n 1.40.0 – 2.x  
- **Node.js version:** 22 or higher  

> No known compatibility issues at this stage, but as this is a student project, behavior may vary across versions.

---

## Usage

1. Add the **Acumbamail** node to your workflow.  
2. Select an operation (`Get All Lists` or `Add Subscriber`).  
3. Connect your credentials.  
4. Execute the workflow to verify the integration.

Example workflow:

```plaintext
Trigger → Acumbamail (Get All Lists) → Function → Acumbamail (Add Subscriber)
```


This setup allows you to dynamically add subscribers to one of your Acumbamail lists.

> [TIP]
> You can combine this node with **Webhook** or **Form Submission** triggers to automatically register new leads into your Acumbamail lists.

---

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Acumbamail API documentation](https://acumbamail.com/apidoc/)
* [n8n documentation](https://docs.n8n.io/)

---

## Version history

| Version | Date | Changes |
|----------|------|----------|
| **0.1.0** | 2025-11-02 | Initial release. Includes *Get All Lists* and *Add Subscriber* operations with API Key authentication. |

---

**Author:** [fuseprods](https://github.com/fuseprods)  
**License:** MIT  
**Disclaimer:** This project is for educational purposes only. Use responsibly.
