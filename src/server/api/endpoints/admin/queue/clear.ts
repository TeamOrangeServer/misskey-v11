import $ from 'cafy';
import define from '../../../define';
import { destroy } from '../../../../../queue';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireModerator: true,

	params: {
		domain: {
			validator: $.optional.str,
		},
	}
};

export default define(meta, async (ps) => {
	destroy(ps.domain);

	return;
});
