n8n-nodes-workflow-checker
This is an n8n community node that checks for updates in your workflow nodes.
It monitors both:

Community nodes from npm
Base nodes from n8n's official GitHub repository

n8n is a fair-code licensed workflow automation platform.
Installation
Follow the installation guide in the n8n community nodes documentation.
Community Node Installation

Go to Settings > Community Nodes
Select Install
Enter n8n-nodes-workflow-checker in the Enter npm package name field
Agree to the risks and select Install

After installation, the Workflow Node Checker node will be available in your n8n workflow editor.
Prerequisites
You need a Firecrawl API key to use this node.
Credentials
This node requires Firecrawl API credentials:

Get your API key from Firecrawl
In n8n, go to Credentials and create a new Firecrawl API credential
Enter your API key

Operations
The Workflow Node Checker node supports the following operations:
Check All Nodes
Checks both community and base nodes in your workflow for updates.
Check Community Nodes Only
Checks only community nodes (from npm) for updates.
Check Base Nodes Only
Checks only n8n base nodes (from GitHub) for updates.
Options

Check Delay (ms): Delay between checks to avoid rate limiting (default: 1500ms)
Include Content Preview: Include content preview in results (default: true)
Days to Check: Number of days to check for recent updates (default: 30)

Outputs
The node returns:
Summary (First Output)

Total nodes in workflow
Number of community vs base nodes
Nodes checked successfully
Nodes with recent updates
Timestamp

Community Node Results

Package name
Current version
Last published date
npm URL
Content preview (if enabled)

Base Node Results

Node name and type
Whether mentioned in recent releases
Whether mentioned in recent commits
GitHub URLs
Context snippets (if enabled)

Usage Example

Add the Workflow Node Checker node to your workflow
Connect your Firecrawl API credentials
Select an operation (e.g., "Check All Nodes")
Execute the workflow
Review the results to see which nodes have updates

Compatibility
Tested with n8n version 1.0.0 and above.
Resources

n8n community nodes documentation
Firecrawl Documentation

License
MIT