import config from '../../../config';
import { ILocalUser } from '../../../models/user';

export const renderReject = (object: any, user: ILocalUser) => ({
	type: 'Reject',
	actor: `${config.url}/users/${user._id}`,
	object
});
