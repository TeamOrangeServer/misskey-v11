import config from '../../../config';
import { ILocalUser } from '../../../models/user';

export const renderAccept = (object: any, user: ILocalUser) => ({
	type: 'Accept',
	actor: `${config.url}/users/${user._id}`,
	object
});
