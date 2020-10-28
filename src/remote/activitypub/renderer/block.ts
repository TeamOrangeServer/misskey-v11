import config from '../../../config';
import { ILocalUser, IRemoteUser } from '../../../models/user';

export const renderBlock = (blocker?: ILocalUser, blockee?: IRemoteUser) => ({
	type: 'Block',
	actor: `${config.url}/users/${blocker._id}`,
	object: blockee.uri
});
