import define from '../../define';
import { publishTerminate } from '../../../../services/create-event';

export const meta = {
	requireCredential: true,

	secure: true,

	params: {
	}
};

export default define(meta, async (ps, user) => {
	// Terminate streaming
	publishTerminate(user._id);

	return;
});
