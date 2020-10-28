import config from '../../../config';
import { ILocalUser } from '../../../models/user';

export const renderAdd = (user: ILocalUser, target: any, object: any) => ({
	type: 'Add',
	actor: `${config.url}/users/${user._id}`,
	target,
	object
});
