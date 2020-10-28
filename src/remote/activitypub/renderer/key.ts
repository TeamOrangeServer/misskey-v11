import config from '../../../config';
import { createPublicKey } from 'crypto';
import { ILocalUser } from '../../../models/user';

export const renderKey = (user: ILocalUser, postfix?: string) => ({
	id: `${config.url}/users/${user._id}${postfix || '/publickey'}`,
	type: 'Key',
	owner: `${config.url}/users/${user._id}`,
	publicKeyPem: createPublicKey(user.keypair).export({
		type: 'spki',
		format: 'pem'
	})
});
