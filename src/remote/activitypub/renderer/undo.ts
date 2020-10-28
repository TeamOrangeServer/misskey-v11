import config from '../../../config';
import { ILocalUser, IUser } from '../../../models/user';

export const renderUndo = (object: any, user: ILocalUser | IUser) => ({
	type: 'Undo',
	actor: `${config.url}/users/${user._id}`,
	object
});
