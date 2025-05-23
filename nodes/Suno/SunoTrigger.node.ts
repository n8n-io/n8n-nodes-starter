import type {
    INodeType,
    INodeTypeDescription,
    ITriggerFunctions,
    ITriggerResponse,
} from 'n8n-workflow';

export class SunoTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Suno Trigger',
        name: 'sunoTrigger',
        icon: 'file:suno.svg', // Re-use the icon
        group: ['trigger', 'ai'],
        version: 1,
        description: 'Triggers when a Suno AI event occurs',
        defaults: {
            name: 'Suno Trigger',
        },
        inputs: [], // Triggers usually do not have inputs
        outputs: ['main'], // Main output for triggered data
        credentials: [
            {
                name: 'sunoApi',
                required: true,
            },
        ],
        properties: [
            // Define properties for the trigger
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
                displayName: 'Track ID',
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
                default: 5,
                description: 'How often to check for new songs (if applicable)',
                displayOptions: {
                    show: {
                        triggerEvent: ['newSongAvailable'],
                    },
                },
            },
        ],
    };

    // Placeholder for trigger methods
    async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
        // const credentials = await this.getCredentials('sunoApi');
        // const triggerEvent = this.getNodeParameter('triggerEvent') as string;
        // const trackId = this.getNodeParameter('trackId') as string;
        // const pollingInterval = this.getNodeParameter('pollingInterval') as number;

        // TODO: Implement actual trigger logic based on triggerEvent
        // For 'trackGenerationComplete', this might involve polling pollJobStatus(trackId)
        // For 'newSongAvailable', this might involve polling listPreviousSongs() and checking for new entries

        // If webhook based, this method would be different,
        // this.emit([this.helpers.returnJsonArray([{ eventData: 'example' }])]);
        // this.on('close', () => { /* remove webhook */ });
        // return { webhookId: 'your-webhook-id' };

        // For polling triggers, this method might not be used directly if using manualTriggerFunction
        if (this.manualTriggerFunction) { // Corrected placeholder name
             // Manual trigger logic for polling
            // This will be called by n8n based on the schedule if `manualTriggerFunction` is defined
            // Example:
            // const items = await pollSunoApiForUpdates();
            // if (items.length > 0) {
            //     return {
            //         items: this.helpers.returnJsonArray(items),
            //     };
            // }
            // return undefined; // No new items
        }

        // For now, returning undefined as it's a placeholder
        // For a polling trigger, you might set up an interval here or use manualTriggerFunction
        // For a webhook trigger, you would register the webhook here.
        return undefined;
    }

    // Example of how a manual trigger function might be structured for polling
    // async manualTrigger(this: ITriggerFunctions): Promise<INodeExecutionData[][] | undefined> {
    //     const triggerEvent = this.getNodeParameter('triggerEvent') as string;
    //     // ... get other params and credentials
    //
    //     if (triggerEvent === 'newSongAvailable') {
    //         console.log('Polling for new songs...');
    //         // const newSongs = await sunoApi.listPreviousSongs(credentials, /* potential pagination params */);
    //         // Check against previously seen songs (requires state management, complex for this scaffold)
    //         // For now, let's simulate finding one new song:
    //         // const simulatedNewSong = [{ id: 'new_track_123', title: 'A New Song', status: 'complete' }];
    //         // return [this.helpers.returnJsonArray(simulatedNewSong)];
    //     } else if (triggerEvent === 'trackGenerationComplete') {
    //         // const trackId = this.getNodeParameter('trackId') as string;
    //         // const status = await sunoApi.pollJobStatus(credentials, trackId);
    //         // if (status && status.status === 'complete') {
    //         //    return [this.helpers.returnJsonArray([status])];
    //         // }
    //     }
    //     return undefined; // No trigger event
    // }
}
