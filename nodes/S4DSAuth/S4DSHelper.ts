import { IExecuteFunctions } from 'n8n-workflow';

export interface S4DSTokenData {
	token: string;
	token_type: string;
	expires_in: number;
	expires_at: string;
	authorization_header: string;
}

export class S4DSHelper {
	/**
	 * Obtiene el token de autorización del contexto del workflow
	 * @param this - Contexto de ejecución del nodo
	 * @param contextKey - Clave del contexto donde está almacenado el token (por defecto: 's4ds_token')
	 * @returns Objeto con datos del token incluyendo el header de autorización
	 */
	static getTokenFromContext(this: IExecuteFunctions, contextKey: string = 's4ds_token'): S4DSTokenData {
		const tokenData = this.getWorkflowStaticData('global')[contextKey] as S4DSTokenData;
		
		if (!tokenData || !tokenData.token) {
			throw new Error(`No S4DS token found in context with key: ${contextKey}. Please run S4DS Auth node first.`);
		}

		// Verificar si el token ha expirado
		if (tokenData.expires_at && new Date(tokenData.expires_at) <= new Date()) {
			throw new Error('S4DS token has expired. Please regenerate token using S4DS Auth node.');
		}

		return tokenData;
	}

	/**
	 * Obtiene el header de autorización listo para usar
	 * @param this - Contexto de ejecución del nodo
	 * @param contextKey - Clave del contexto donde está almacenado el token (por defecto: 's4ds_token')
	 * @returns Header de autorización completo (ej: "Bearer 8a6c71b3-fa62-434d-8b38-907de24c3176")
	 */
	static getAuthorizationHeader(this: IExecuteFunctions, contextKey: string = 's4ds_token'): string {
		const tokenData = S4DSHelper.getTokenFromContext.call(this, contextKey);
		return tokenData.authorization_header;
	}

	/**
	 * Obtiene headers HTTP completos con autorización
	 * @param this - Contexto de ejecución del nodo
	 * @param contextKey - Clave del contexto donde está almacenado el token (por defecto: 's4ds_token')
	 * @param additionalHeaders - Headers adicionales opcionales
	 * @returns Objeto con headers HTTP completos
	 */
	static getHeadersWithAuth(
		this: IExecuteFunctions, 
		contextKey: string = 's4ds_token',
		additionalHeaders: Record<string, string> = {}
	): Record<string, string> {
		const authHeader = S4DSHelper.getAuthorizationHeader.call(this, contextKey);
		
		return {
			Authorization: authHeader,
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...additionalHeaders,
		};
	}

	/**
	 * Verifica si existe un token válido en el contexto
	 * @param this - Contexto de ejecución del nodo
	 * @param contextKey - Clave del contexto donde está almacenado el token (por defecto: 's4ds_token')
	 * @returns true si existe un token válido, false en caso contrario
	 */
	static hasValidToken(this: IExecuteFunctions, contextKey: string = 's4ds_token'): boolean {
		try {
			S4DSHelper.getTokenFromContext.call(this, contextKey);
			return true;
		} catch {
			return false;
		}
	}
} 