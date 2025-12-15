import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
export class VerificarEmail implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Verificacion de Email',
        name: 'verificarEmail',
        icon: 'file:mail-mail-email.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Node para verificar emails usando un servicio externo (emailable.com)',
        defaults: {
            name: 'Verficar Email',
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'VerificarEmailApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.emailable.com/v1/verify',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Validar Email',
                name: 'email',
                type: 'string',
                placeholder: 'correo@email.com',
                required: true,
                default: 'dylanbohorquez77@gmail.com',
                routing: {
                    qs: {
                        email: '={{$value}}',
                    },
                },
            },
        ],
		usableAsTool: true
    };
}