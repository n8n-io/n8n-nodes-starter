import { IExecuteFunctions, INodeExecutionData, NodeOperationError, IDataObject } from 'n8n-workflow';

// Helper function for delays
const sleep = (ms: number): Promise<void> => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
};

// Helper function for GitHub API calls
async function fetchGitHubAPI(url: string): Promise<any> {
	const response = await fetch(url, {
		headers: {
			'Accept': 'application/vnd.github+json',
			'User-Agent': 'n8n-node-checker',
		}
	});
	
	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.status}`);
	}
	
	return await response.json();
}

interface CommunityNodeResult extends IDataObject {
	type: 'community';
	nodeType: string;
	packageName: string;
	previousVersion?: string;
	currentVersion: string;
	hasUpdate: boolean;
	npmUrl: string;
	githubUrl?: string;
	lastPublished: string;
	changelog?: string;
	success: boolean;
	error?: string;
}

interface BaseNodeResult extends IDataObject {
	type: 'base';
	nodeType: string;
	nodeName: string;
	mentionedInRecentReleases: boolean;
	mentionedInRecentCommits: boolean;
	patchNotes?: string;
	githubReleasesUrl: string;
	githubCommitsUrl: string;
	success: boolean;
	error?: string;
}

export const nodeUpdateCheckerMethods = {
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];

		// Get parameters
		const operation = this.getNodeParameter('operation', 0) as string;
		const outputFormat = this.getNodeParameter('outputFormat', 0) as string;
		const previousVersionsInput = this.getNodeParameter('previousVersions', 0, '{}') as string;
		const useStaticData = this.getNodeParameter('options.useStaticData', 0, false) as boolean;
		
		let previousVersions: Record<string, string> = {};
		
		// Load from static data or parameter
		if (useStaticData) {
			const staticData = this.getWorkflowStaticData('global');
			previousVersions = (staticData.nodeVersions as Record<string, string>) || {};
		} else {
			try {
				previousVersions = JSON.parse(previousVersionsInput);
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid JSON format for Previous Versions',
				);
			}
		}

		const options = this.getNodeParameter('options', 0, {}) as {
			checkDelay?: number;
			includePreview?: boolean;
			fetchGithubRepo?: boolean;
			extractPatchNotes?: boolean;
		};

		const checkDelay = options.checkDelay || 1500;
		const fetchGithubRepo = options.fetchGithubRepo !== false;
		const extractPatchNotes = options.extractPatchNotes !== false;

		// Get current workflow
		const workflow = this.getWorkflow();
		
		// Get all nodes from the workflow
		let allNodes: any[] = [];
		try {
			const workflowData = workflow as any;
			if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
				allNodes = workflowData.nodes;
			} else if (workflowData.nodes && typeof workflowData.nodes === 'object') {
				allNodes = Object.values(workflowData.nodes);
			} else {
				allNodes = [];
			}
		} catch (error) {
			allNodes = [];
		}

		// Separate community nodes and base nodes
		const communityNodes: string[] = [];
		const baseNodes: string[] = [];

		for (const node of allNodes) {
			if (!node || typeof node !== 'object') continue;
			const nodeData = node as any;
			const nodeType = nodeData.type;
			
			if (!nodeType) continue;
			
			if (nodeType.startsWith('@') || nodeType.includes('n8n-nodes-')) {
				communityNodes.push(nodeType);
			} else {
				baseNodes.push(nodeType);
			}
		}

		const communityResults: CommunityNodeResult[] = [];
		const baseResults: BaseNodeResult[] = [];

		try {
			// Check community nodes on npm
			if (operation === 'checkAll' || operation === 'checkCommunity') {
				for (const nodeType of [...new Set(communityNodes)]) {
					try {
						const result = await checkCommunityNode(
							nodeType,
							previousVersions,
							fetchGithubRepo,
							checkDelay,
						);
						communityResults.push(result);
						await sleep(checkDelay);
					} catch (error) {
						communityResults.push({
							type: 'community',
							nodeType,
							packageName: nodeType.split('.')[0],
							currentVersion: 'unknown',
							hasUpdate: false,
							npmUrl: '',
							lastPublished: 'unknown',
							error: error instanceof Error ? error.message : String(error),
							success: false,
						});
					}
				}
			}

			// Check base nodes on n8n GitHub
			if ((operation === 'checkAll' || operation === 'checkBase') && baseNodes.length > 0) {
				try {
					const baseNodeResults = await checkBaseNodes(
						baseNodes,
						extractPatchNotes,
						checkDelay,
					);
					baseResults.push(...baseNodeResults);
				} catch (error) {
					baseResults.push({
						type: 'base',
						nodeType: 'all',
						nodeName: 'all',
						mentionedInRecentReleases: false,
						mentionedInRecentCommits: false,
						githubReleasesUrl: '',
						githubCommitsUrl: '',
						error: error instanceof Error ? error.message : String(error),
						success: false,
					});
				}
			}

			// Generate outputs based on format
			if (outputFormat === 'json' || outputFormat === 'both') {
				// Add JSON results
				for (const result of communityResults) {
					returnData.push({ json: result as IDataObject });
				}
				for (const result of baseResults) {
					returnData.push({ json: result as IDataObject });
				}
			}

			if (outputFormat === 'emailText' || outputFormat === 'both') {
				// Generate email text
				const emailText = generateEmailText(communityResults, baseResults, workflow.name || 'Workflow');
				returnData.push({
					json: {
						type: 'email_report',
						emailText,
						workflowName: workflow.name || 'Workflow',
						checkedAt: new Date().toISOString(),
					},
				});
			}

			// Add summary
			const summary = {
				totalNodes: allNodes.length,
				communityNodesCount: communityNodes.length,
				baseNodesCount: baseNodes.length,
				communityNodesWithUpdates: communityResults.filter(r => r.hasUpdate).length,
				baseNodesWithUpdates: baseResults.filter(
					r => r.mentionedInRecentReleases || r.mentionedInRecentCommits,
				).length,
				checkedAt: new Date().toISOString(),
			};

			// Save current versions to static data if enabled
			if (useStaticData) {
				const staticData = this.getWorkflowStaticData('global');
				const currentVersions: Record<string, string> = {};
				
				for (const result of communityResults) {
					if (result.success && result.currentVersion !== 'unknown') {
						currentVersions[result.packageName] = result.currentVersion;
					}
				}
				
				staticData.nodeVersions = currentVersions;
				
				// Add info about saved versions
				returnData.push({
					json: {
						type: 'version_storage',
						message: 'Versions saved to workflow static data',
						savedVersions: currentVersions,
						savedAt: new Date().toISOString(),
					},
				});
			}

			returnData.unshift({
				json: {
					summary,
					workflowName: workflow.name || 'Workflow',
					operation,
					outputFormat,
				},
			});

		} catch (error: unknown) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						success: false,
						error: error instanceof Error ? error.message : String(error),
					},
				});
			} else {
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [returnData];
	},
};

// Helper functions
async function checkCommunityNode(
	nodeType: string,
	previousVersions: Record<string, string>,
	fetchGithubRepo: boolean,
	checkDelay: number,
): Promise<CommunityNodeResult> {
	const packageName = nodeType.split('.')[0];
	const npmUrl = `https://www.npmjs.com/package/${packageName}`;
	
	// Use npm registry API
	const registryUrl = `https://registry.npmjs.org/${packageName}`;
	
	try {
		const response = await fetch(registryUrl);
		
		if (!response.ok) {
			throw new Error(`npm registry returned ${response.status}`);
		}
		
		const registryData = await response.json() as any;
		
		// Get latest version
		const currentVersion = registryData['dist-tags']?.latest || 'unknown';
		
		// Get last publish time
		const timeData = registryData.time || {};
		const publishedAt = timeData[currentVersion];
		let lastPublished = 'unknown';
		
		if (publishedAt) {
			const publishDate = new Date(publishedAt);
			const now = new Date();
			const diffMs = now.getTime() - publishDate.getTime();
			const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
			
			if (diffDays === 0) {
				const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
				if (diffHours === 0) {
					const diffMinutes = Math.floor(diffMs / (1000 * 60));
					lastPublished = `${diffMinutes} minutes ago`;
				} else {
					lastPublished = `${diffHours} hours ago`;
				}
			} else if (diffDays === 1) {
				lastPublished = '1 day ago';
			} else if (diffDays < 30) {
				lastPublished = `${diffDays} days ago`;
			} else if (diffDays < 365) {
				const months = Math.floor(diffDays / 30);
				lastPublished = months === 1 ? '1 month ago' : `${months} months ago`;
			} else {
				const years = Math.floor(diffDays / 365);
				lastPublished = years === 1 ? '1 year ago' : `${years} years ago`;
			}
		}
		
		// Check for version change
		const previousVersion = previousVersions[packageName];
		const hasUpdate = previousVersion ? previousVersion !== currentVersion : false;
		
		// Get GitHub URL from repository field
		let githubUrl: string | undefined;
		if (fetchGithubRepo) {
			const repository = registryData.repository;
			if (repository) {
				let repoUrl = typeof repository === 'string' ? repository : repository.url;
				if (repoUrl) {
					// Clean up git+https:// and .git
					repoUrl = repoUrl.replace(/^git\+/, '').replace(/\.git$/, '');
					if (repoUrl.includes('github.com')) {
						githubUrl = repoUrl;
					}
				}
			}
		}
		
		// Try to get changelog from GitHub API if there's an update
		let changelog: string | undefined;
		if (hasUpdate && githubUrl) {
			try {
				await sleep(checkDelay);
				changelog = await getChangelogFromGitHub(
					githubUrl,
					previousVersion || '',
					currentVersion,
				);
			} catch (error) {
				// Changelog fetch failed, continue without it
			}
		}
		
		return {
			type: 'community',
			nodeType,
			packageName,
			previousVersion,
			currentVersion,
			hasUpdate,
			npmUrl,
			githubUrl,
			lastPublished,
			changelog,
			success: true,
		};
		
	} catch (error) {
		return {
			type: 'community',
			nodeType,
			packageName,
			previousVersion: previousVersions[packageName],
			currentVersion: 'unknown',
			hasUpdate: false,
			npmUrl,
			lastPublished: 'unknown',
			error: error instanceof Error ? error.message : String(error),
			success: false,
		};
	}
}

async function getChangelogFromGitHub(
	githubUrl: string,
	previousVersion: string,
	currentVersion: string,
): Promise<string | undefined> {
	try {
		// Extract owner and repo from GitHub URL
		const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
		if (!match) return undefined;
		
		const [, owner, repo] = match;
		
		// Fetch releases from GitHub API
		const releases = await fetchGitHubAPI(
			`https://api.github.com/repos/${owner}/${repo}/releases`
		);
		
		if (!Array.isArray(releases) || releases.length === 0) {
			return undefined;
		}
		
		// Find release matching current version
		const currentRelease = releases.find((r: any) => 
			r.tag_name === currentVersion || 
			r.tag_name === `v${currentVersion}` ||
			r.name?.includes(currentVersion)
		);
		
		if (!currentRelease || !currentRelease.body) {
			return undefined;
		}
		
		// Return changelog, truncated if too long
		let changelog = currentRelease.body;
		if (changelog.length > 2000) {
			changelog = changelog.substring(0, 2000) + '...';
		}
		
		return changelog;
		
	} catch (error) {
		return undefined;
	}
}

async function checkBaseNodes(
	baseNodes: string[],
	extractPatchNotes: boolean,
	checkDelay: number,
): Promise<BaseNodeResult[]> {
	const results: BaseNodeResult[] = [];

	try {
		// Fetch n8n releases from GitHub API
		const releases = await fetchGitHubAPI(
			'https://api.github.com/repos/n8n-io/n8n/releases?per_page=10'
		);
		
		await sleep(checkDelay);

		// Fetch recent commits from GitHub API
		const commits = await fetchGitHubAPI(
			'https://api.github.com/repos/n8n-io/n8n/commits?path=packages/nodes-base/nodes&per_page=30'
		);

		// Combine release notes and commit messages for searching
		const releasesContent = releases.map((r: any) => 
			`${r.name || ''} ${r.body || ''}`
		).join('\n').toLowerCase();
		
		const commitsContent = commits.map((c: any) => 
			c.commit?.message || ''
		).join('\n').toLowerCase();

		// Check each base node
		for (const nodeType of [...new Set(baseNodes)]) {
			const nodeName = nodeType.split('.').pop() || nodeType;
			const lowerNodeName = nodeName.toLowerCase();
			
			const mentionedInReleases = releasesContent.includes(lowerNodeName);
			const mentionedInCommits = commitsContent.includes(lowerNodeName);

			let patchNotes: string | undefined;
			if (extractPatchNotes && (mentionedInReleases || mentionedInCommits)) {
				patchNotes = extractPatchNotesFromGitHub(
					releases,
					commits,
					nodeName,
				);
			}

			results.push({
				type: 'base',
				nodeType,
				nodeName,
				mentionedInRecentReleases: mentionedInReleases,
				mentionedInRecentCommits: mentionedInCommits,
				patchNotes,
				githubReleasesUrl: 'https://github.com/n8n-io/n8n/releases',
				githubCommitsUrl: 'https://github.com/n8n-io/n8n/commits/master/packages/nodes-base/nodes',
				success: true,
			});
		}

		return results;
		
	} catch (error) {
		throw new Error(`Failed to check base nodes: ${error instanceof Error ? error.message : String(error)}`);
	}
}

function extractPatchNotesFromGitHub(
	releases: any[],
	commits: any[],
	nodeName: string,
): string {
	const notes: string[] = [];
	const lowerNodeName = nodeName.toLowerCase();
	
	// Extract from releases
	for (const release of releases) {
		const releaseText = `${release.name || ''} ${release.body || ''}`;
		if (releaseText.toLowerCase().includes(lowerNodeName)) {
			const snippet = extractContextSnippet(releaseText, nodeName, 300);
			if (snippet) {
				notes.push(`**Release ${release.name || release.tag_name}:**\n${snippet}`);
			}
			if (notes.length >= 2) break; // Limit to 2 releases
		}
	}

	// Extract from commits
	let commitCount = 0;
	for (const commit of commits) {
		const message = commit.commit?.message || '';
		if (message.toLowerCase().includes(lowerNodeName)) {
			notes.push(`**Commit:** ${message.split('\n')[0]}`);
			commitCount++;
			if (commitCount >= 3) break; // Limit to 3 commits
		}
	}

	return notes.join('\n\n') || 'Mentioned in recent updates';
}

function extractContextSnippet(content: string, searchTerm: string, maxLength: number = 200): string {
	const lowerContent = content.toLowerCase();
	const lowerTerm = searchTerm.toLowerCase();
	const index = lowerContent.indexOf(lowerTerm);
	
	if (index === -1) return '';
	
	const start = Math.max(0, index - 100);
	const end = Math.min(content.length, index + maxLength);
	
	return '...' + content.substring(start, end).trim() + '...';
}

function generateEmailText(
	communityResults: CommunityNodeResult[],
	baseResults: BaseNodeResult[],
	workflowName: string,
): string {
	const lines: string[] = [];
	
	lines.push(`# Node Update Report for: ${workflowName}`);
	lines.push(`Generated: ${new Date().toLocaleString()}`);
	lines.push('');
	lines.push('---');
	lines.push('');

	// Community Nodes Section
	const updatedCommunity = communityResults.filter(r => r.hasUpdate && r.success);
	if (updatedCommunity.length > 0) {
		lines.push('## 📦 Community Nodes with Updates');
		lines.push('');

		for (const node of updatedCommunity) {
			lines.push(`### ${node.packageName}`);
			lines.push(`- **Version Change**: ${node.previousVersion || 'unknown'} → ${node.currentVersion}`);
			lines.push(`- **npm**: ${node.npmUrl}`);
			if (node.githubUrl) {
				lines.push(`- **GitHub**: ${node.githubUrl}`);
				lines.push(`- **Releases**: ${node.githubUrl}/releases`);
			}
			lines.push(`- **Last Published**: ${node.lastPublished}`);
			
			if (node.changelog) {
				lines.push('');
				lines.push('**Changelog:**');
				lines.push('```');
				lines.push(node.changelog);
				lines.push('```');
			}
			lines.push('');
		}
	} else {
		lines.push('## 📦 Community Nodes');
		lines.push('No updates detected for community nodes.');
		lines.push('');
	}

	// Base Nodes Section
	const updatedBase = baseResults.filter(
		r => (r.mentionedInRecentReleases || r.mentionedInRecentCommits) && r.success,
	);
	if (updatedBase.length > 0) {
		lines.push('## 🔧 Base Nodes with Recent Activity');
		lines.push('');

		for (const node of updatedBase) {
			lines.push(`### ${node.nodeName}`);
			if (node.mentionedInRecentReleases) {
				lines.push('- ✅ Mentioned in recent releases');
			}
			if (node.mentionedInRecentCommits) {
				lines.push('- ✅ Mentioned in recent commits');
			}
			lines.push(`- **GitHub Releases**: ${node.githubReleasesUrl}`);
			lines.push(`- **Commits**: ${node.githubCommitsUrl}`);
			
			if (node.patchNotes) {
				lines.push('');
				lines.push('**Patch Notes:**');
				lines.push('```');
				lines.push(node.patchNotes);
				lines.push('```');
			}
			lines.push('');
		}
	} else {
		lines.push('## 🔧 Base Nodes');
		lines.push('No recent activity detected for base nodes.');
		lines.push('');
	}

	// No Updates Section
	const noUpdatesCommunity = communityResults.filter(r => !r.hasUpdate && r.success);
	const noUpdatesBase = baseResults.filter(
		r => !r.mentionedInRecentReleases && !r.mentionedInRecentCommits && r.success,
	);

	if (noUpdatesCommunity.length > 0 || noUpdatesBase.length > 0) {
		lines.push('---');
		lines.push('## ℹ️ Nodes Without Updates');
		lines.push('');

		if (noUpdatesCommunity.length > 0) {
			lines.push('**Community Nodes:**');
			for (const node of noUpdatesCommunity) {
				lines.push(`- ${node.packageName} (${node.currentVersion})`);
			}
			lines.push('');
		}

		if (noUpdatesBase.length > 0) {
			lines.push('**Base Nodes:**');
			for (const node of noUpdatesBase) {
				lines.push(`- ${node.nodeName}`);
			}
			lines.push('');
		}
	}

	lines.push('---');
	lines.push('');
	lines.push('*This report was automatically generated by n8n Workflow Node Checker*');

	return lines.join('\n');
}