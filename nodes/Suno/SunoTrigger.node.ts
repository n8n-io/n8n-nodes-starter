import type {
    INodeType,
    INodeTypeDescription,
    ITriggerFunctions,
    ITriggerResponse,
    ICredentialDataDecryptedObject, // Added
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow'; // Added

import {
    pollJobStatus,
    listPreviousSongs,
    loginWithCredentials,
} from '../../utils/sunoApi';

export class SunoTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Suno Trigger',
        name: 'sunoTrigger',
        icon: 'file:suno.svg',
        group: ['trigger', 'ai'],
        version: 1,
        description: 'Triggers when a Suno AI event occurs (polling)',
        defaults: {
            name: 'Suno Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'sunoApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Trigger Event',
                name: 'triggerEvent',
                type: 'options',
                options: [
                    {
                        name: 'Track Generation Complete',
                        value: 'trackGenerationComplete',
                        description: 'Triggers when a specific track finishes generation',
                    },
                    {
                        name: 'New Song Available',
                        value: 'newSongAvailable',
                        description: 'Triggers when any new song is available in the library (polling)',
                    },
                ],
                default: 'trackGenerationComplete',
                description: 'The Suno event that will trigger this node',
            },
            {
                displayName: 'Track ID (for Track Generation Complete)',
                name: 'trackId',
                type: 'string',
                default: '',
                description: 'The ID of the track to monitor for completion',
                displayOptions: {
                    show: {
                        triggerEvent: ['trackGenerationComplete'],
                    },
                },
            },
            {
                displayName: 'Polling Interval (minutes)',
                name: 'pollingInterval',
                type: 'number',
                default: 5, // Default to 5 minutes
                description: 'How often to check for events. n8n will manage the actual polling schedule based on this.',
                // displayOptions: { // Not strictly needed to show for both, but can be kept
                // 	show: {
                // 		triggerEvent: ['newSongAvailable', 'trackGenerationComplete'],
                // 	},
                // },
            },
        ],
    };

    /**
     * The `trigger` method is called when the workflow is activated.
     * For polling triggers using `manualTriggerFunction`, this method can be used
     * for initial setup, like setting the polling interval or initial authentication.
     */
    async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
        const pollingIntervalMinutes = this.getNodeParameter('pollingInterval', 5) as number;
        this.setPollingInterval(pollingIntervalMinutes * 60 * 1000); // Set n8n's polling interval

        try {
            const credentials = await this.getCredentials('sunoApi') as ICredentialDataDecryptedObject;
            if (!credentials || !credentials.email || !credentials.password) {
                throw new NodeOperationError(this.getNode(), 'Suno API credentials are not configured or incomplete.');
            }
            // Perform an initial login to ensure credentials are valid and API is reachable
            await loginWithCredentials(credentials.email as string, credentials.password as string);
            console.log('SunoTrigger: Initial authentication successful for polling setup.');
        } catch (error) {
            console.error('SunoTrigger: Initial authentication or setup failed.', error);
            // Depending on how n8n handles this, we might throw or just log.
            // For a trigger, throwing here might prevent it from starting.
            if (error instanceof NodeOperationError) throw error;
            throw new NodeOperationError(this.getNode(), `Initial setup failed: ${error.message || String(error)}`);
        }

        // For pure polling, manualTriggerFunction will handle the periodic checks.
        // If specific cleanup is needed when the workflow deactivates, return a closeFunction.
        return {
            closeFunction: async () => {
                console.log('SunoTrigger: Polling stopped.');
            },
        };
    }

    /**
     * `manualTriggerFunction` is called by n8n at the defined polling interval.
     * It should fetch data and emit items if new events are found.
     */
    public async manualTrigger(this: ITriggerFunctions): Promise<void> {
        const triggerEvent = this.getNodeParameter('triggerEvent') as string;

        try {
            const credentials = await this.getCredentials('sunoApi') as ICredentialDataDecryptedObject;
            if (!credentials || !credentials.email || !credentials.password) {
                console.error('SunoTrigger: Credentials not available for polling.');
                // Optionally emit an error to the workflow execution log, but be careful not to flood it.
                // this.emit([this.helpers.returnJsonArray([{ error: 'Credentials missing for polling' }])]);
                return; // Stop further execution for this poll if creds are missing
            }

            // Ensure we are "logged in" for each poll execution, as the token state is managed in sunoApi.ts
            // and might "expire" or the trigger instance could be new.
            await loginWithCredentials(credentials.email as string, credentials.password as string);

            if (triggerEvent === 'trackGenerationComplete') {
                const trackId = this.getNodeParameter('trackId', '') as string;
                if (!trackId) {
                    console.warn('SunoTrigger: Track ID not provided for "Track Generation Complete" event. Skipping poll.');
                    return;
                }
                const jobStatus = await pollJobStatus(trackId);
                // Simple mock: emit if the job is 'complete' and has a trackId.
                // A real implementation would need state to avoid re-emitting for the same completed track.
                if (jobStatus && jobStatus.status === 'complete' && jobStatus.trackId) {
                    console.log(`SunoTrigger: Track ${jobStatus.trackId} (Job ID: ${jobStatus.id}) is complete. Emitting.`);
                    this.emit([this.helpers.returnJsonArray([jobStatus])]);
                } else {
                    console.log(`SunoTrigger: Track ID ${trackId} status: ${jobStatus.status || 'unknown'}. Not emitting.`);
                }
            } else if (triggerEvent === 'newSongAvailable') {
                const songs = await listPreviousSongs();
                // Simple mock: if songs are found, emit the first one.
                // A real implementation needs sophisticated state management to detect "new" songs
                // (e.g., comparing against IDs seen in the previous poll).
                if (songs && songs.length > 0) {
                    console.log('SunoTrigger: New songs found (mock implementation). Emitting the first song from the list.');
                    this.emit([this.helpers.returnJsonArray([songs[0]])]);
                } else {
                    console.log('SunoTrigger: No new songs found (mock implementation).');
                }
            }
        } catch (error) {
            console.error('SunoTrigger: Error during polling execution:', error);
            // Optionally emit an error item to the workflow execution log
            // this.emit([this.helpers.returnJsonArray([{ error: `Polling error: ${error.message || String(error)}` }])]);
        }
    }
}
