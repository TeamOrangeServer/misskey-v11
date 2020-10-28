import config from '../../../config';

export const renderHashtag = (tag: string) => ({
	type: 'Hashtag',
	href: `${config.url}/tags/${encodeURIComponent(tag)}`,
	name: `#${tag}`
});
