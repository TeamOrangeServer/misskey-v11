<template>
<div class="prlncendiewqqkrevzeruhndoakghvtx">
	<!-- タブのボタン -->
	<header>
		<button v-for="category in categories"
			:title="category.text"
			@click="go(category)"
			:class="{ active: category.isActive }"
			:key="category.text"
		>
			<fa :icon="category.icon" fixed-width/>
		</button>
	</header>
	<div class="emojis">
		<!-- ピン留め -->
		<header v-if="!reaction" class="menu">
			<ui-switch v-model="pinned">{{ $t('pinned') }}</ui-switch>
		</header>
		<!-- 検索 -->
		<ui-input v-model="q" :autofocus="!$root.isMobile" style="margin: 0.6em 0.6em 0.8em 0.6em;">
			<span>{{ $t('search') }}</span>
		</ui-input>
		<div class="list" v-if="searchResults.length > 0">
			<button v-for="emoji in (searchResults || [])"
				:title="emoji.sources ? emoji.sources.map(x => `${x.name}@${x.host}`).join(',\n') : emoji.name"
				@click="chosen(emoji)"
				:key="emoji.char || emoji.name"
			>
				<mk-emoji v-if="emoji.char != null" :emoji="emoji.char" :local="emoji.local"/>
				<img v-else :src="$store.state.device.disableShowingAnimatedImages ? getStaticImageUrl(emoji.url) : emoji.url"/>
			</button>
		</div>

		<!-- *カテゴリの追加分 -->
		<template v-if="categories[0].isActive">
			<!-- 最近使った -->
			<header class="category"><fa :icon="faHistory" fixed-width/> {{ $t('recent-emoji') }}</header>
			<div class="list">
				<button v-for="emoji in ($store.state.device.recentEmojis || [])"
					:title="emoji.sources ? emoji.sources.map(x => `${x.name}@${x.host}`).join(',\n') : emoji.name"
					@click="chosen(emoji)"
					:key="emoji.char || emoji.name"
				>
					<mk-emoji v-if="emoji.char != null" :emoji="emoji.char" :local="emoji.local"/>
					<img v-else :src="$store.state.device.disableShowingAnimatedImages ? getStaticImageUrl(emoji.url) : emoji.url"/>
				</button>
			</div>
		</template>

		<!-- メイン -->
		<header class="category"><fa :icon="categories.find(x => x.isActive).icon" fixed-width/> {{ categories.find(x => x.isActive).text }}</header>
		<!-- メイン *以外 -->
		<template v-if="categories.find(x => x.isActive).name">
			<div class="list">
				<button v-for="emoji in emojilist.filter(e => e.category === categories.find(x => x.isActive).name)"
					:title="emoji.name"
					@click="chosen(emoji)"
					:key="emoji.name"
				>
					<mk-emoji :emoji="emoji.char" :local="emoji.local"/>
				</button>
			</div>
		</template>
		<!-- メイン * -->
		<template v-else>
			<div v-for="(key, i) in Object.keys(customEmojis)" :key="i">
				<header class="sub">{{ key || $t('no-category') }}</header>
				<div class="list">
					<button v-for="emoji in customEmojis[key]"
						:title="emoji.name"
						@click="chosen(emoji)"
						:key="emoji.name"
					>
						<img :src="$store.state.device.disableShowingAnimatedImages ? getStaticImageUrl(emoji.url) : emoji.url"/>
					</button>
				</div>
			</div>

			<!-- リモート -->
			<header class="category" v-if="includeRemote"><fa :icon="faGlobe" fixed-width/> {{ $t('remote-emoji') }}</header>
			<div class="list" v-if="remoteEmojis != null">
				<button v-for="emoji in remoteEmojis"
					:title="emoji.sources ? emoji.sources.map(x => `${x.name}@${x.host}`).join(',\n') : emoji.name"
					@click="chosen(emoji)"
					:key="emoji.name"
				>
					<img :src="$store.state.device.disableShowingAnimatedImages ? getStaticImageUrl(emoji.url) : emoji.url"/>
				</button>
			</div>
			<div v-else-if="includeRemote" class="load-remote">
				<ui-button @click="loadRemote()">
					{{ $t('load-remote') }}
				</ui-button>
			</div>
		</template>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import { emojilist } from '../../../../../misc/emojilist';
import { getStaticImageUrl } from '../../../common/scripts/get-static-image-url';
import { faAsterisk, faUser, faLeaf, faUtensils, faFutbol, faCity, faDice, faGlobe, faHistory } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faFlag } from '@fortawesome/free-regular-svg-icons';
import { groupBy } from '../../../../../prelude/array';

export default Vue.extend({
	i18n: i18n('common/views/components/emoji-picker.vue'),

	props: {
		includeRemote: {
			type: Boolean,
			required: false,
			default: false
		},
		reaction: {
			type: Boolean,
			required: false,
			default: false
		},
	},

	data() {
		return {
			pinned: false,
			emojilist,
			getStaticImageUrl,
			customEmojis: {},
			remoteEmojis: null,
			q: null,
			searchResults: [],
			faGlobe, faHistory,
			categories: [{
				text: this.$t('custom-emoji'),
				icon: faAsterisk,
				isActive: true
			}, {
				name: 'face',
				text: this.$t('face'),
				icon: ['far', 'laugh'],
				isActive: false
			}, {
				name: 'people',
				text: this.$t('people'),
				icon: faUser,
				isActive: false
			}, {
				name: 'animals_and_nature',
				text: this.$t('animals-and-nature'),
				icon: faLeaf,
				isActive: false
			}, {
				name: 'food_and_drink',
				text: this.$t('food-and-drink'),
				icon: faUtensils,
				isActive: false
			}, {
				name: 'activity',
				text: this.$t('activity'),
				icon: faFutbol,
				isActive: false
			}, {
				name: 'travel_and_places',
				text: this.$t('travel-and-places'),
				icon: faCity,
				isActive: false
			}, {
				name: 'objects',
				text: this.$t('objects'),
				icon: faDice,
				isActive: false
			}, {
				name: 'symbols',
				text: this.$t('symbols'),
				icon: faHeart,
				isActive: false
			}, {
				name: 'flags',
				text: this.$t('flags'),
				icon: faFlag,
				isActive: false
			}]
		}
	},

	watch: {
		q() {
			if (this.q == null || this.q === '') {
				this.searchResults = [];
				return;
			}

			const q = this.q.replace(/:/g, '');

			const searchCustom = () => {
				const max = 8;
				const emojis = (this.$root.getMetaSync() || { emojis: [] }).emojis || [];
				const matches = new Set();

				const exactMatch = emojis.find(e => e.name === q);
				if (exactMatch) matches.add(exactMatch);

				if (q.includes(' ')) { // AND検索
					const keywords = q.split(' ');

					// 名前にキーワードが含まれている
					for (const emoji of emojis) {
						if (keywords.every(keyword => emoji.name.includes(keyword))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					// 名前またはエイリアスにキーワードが含まれている
					for (const emoji of emojis) {
						if (keywords.every(keyword => emoji.name.includes(keyword) || emoji.aliases.some(alias => alias.includes(keyword)))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
				} else {
					for (const emoji of emojis) {
						if (emoji.name.startsWith(q)) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					for (const emoji of emojis) {
						if (emoji.aliases.some(alias => alias.startsWith(q))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					for (const emoji of emojis) {
						if (emoji.name.includes(q)) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					for (const emoji of emojis) {
						if (emoji.aliases.some(alias => alias.includes(q))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
				}

				return matches;
			};

			const searchUnicode = () => {
				const max = 8;
				const emojis = this.emojilist;
				const matches = new Set();

				const exactMatch = emojis.find(e => e.name === q);
				if (exactMatch) matches.add(exactMatch);

				if (q.includes(' ')) { // AND検索
					const keywords = q.split(' ');

					// 名前にキーワードが含まれている
					for (const emoji of emojis) {
						if (keywords.every(keyword => emoji.name.includes(keyword))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					// 名前またはエイリアスにキーワードが含まれている
					for (const emoji of emojis) {
						if (keywords.every(keyword => emoji.name.includes(keyword) || emoji.keywords.some(alias => alias.includes(keyword)))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
				} else {
					for (const emoji of emojis) {
						if (emoji.name.startsWith(q)) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					for (const emoji of emojis) {
						if (emoji.keywords.some(keyword => keyword.startsWith(q))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					for (const emoji of emojis) {
						if (emoji.name.includes(q)) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
					if (matches.size >= max) return matches;

					for (const emoji of emojis) {
						if (emoji.keywords.some(keyword => keyword.includes(q))) {
							matches.add(emoji);
							if (matches.size >= max) break;
						}
					}
				}

				return matches;
			};

			const searchResultCustom = Array.from(searchCustom());
			const searchResultUnicode = Array.from(searchUnicode());
			this.searchResults = searchResultCustom.concat(searchResultUnicode);
		}
	},

	created() {
		let local = (this.$root.getMetaSync() || { emojis: [] }).emojis || [];
		local = groupBy(local, (x: any) => x.category || '');
		this.customEmojis = local;

		if (this.$store.state.device.activeEmojiCategoryName) {
			this.goCategory(this.$store.state.device.activeEmojiCategoryName);
		}
	},

	methods: {
		loadRemote() {
			this.$root.api('emojis/recommendation', {
				origin: 'remote',
			}).then((emojis: any[]) => {
				this.remoteEmojis = emojis;
			});
		},
		go(category: any) {
			this.goCategory(category.name);
		},

		goCategory(name: string) {
			let matched = false;
			for (const c of this.categories) {
				c.isActive = c.name === name;
				if (c.isActive) {
					matched = true;
					this.$store.commit('device/set', { key: 'activeEmojiCategoryName', value: c.name });
				}
			}
			if (!matched) {
				this.categories[0].isActive = true;
			}
		},

		chosen(emoji: any) {
			const getKey = (emoji: any) => emoji.char || `:${emoji.name}:`;

			let recents = this.$store.state.device.recentEmojis || [];
			recents = recents.filter((e: any) => getKey(e) !== getKey(emoji));
			recents.unshift(emoji)
			this.$store.commit('device/set', { key: 'recentEmojis', value: recents.splice(0, 16) });

			this.$emit('chosen', {
				emoji: getKey(emoji),
				close: !this.pinned,
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
.prlncendiewqqkrevzeruhndoakghvtx
	width 350px
	background var(--secondary)

	> header
		display flex

		> button
			flex 1
			padding 10px 0
			font-size 16px
			color var(--text)
			transition color 0.2s ease

			&:hover
				color var(--textHighlighted)
				transition color 0s

			&.active
				color var(--primary)
				transition color 0s

	> .emojis
		height 350px
		overflow-y auto
		overflow-x hidden

		> header.menu
			padding 0.5em

		> header.category
			position sticky
			top 0
			left 0
			z-index 1
			padding 8px
			background var(--popupBg)
			color var(--text)
			font-size 12px

		>>> header.sub
			padding 4px 8px
			color var(--text)
			font-size 12px

		>>> div.list
			display grid
			grid-template-columns 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
			gap 4px
			padding 8px

			> button
				padding 0
				width 100%

				&:before
					content ''
					display block
					width 1px
					height 0
					padding-bottom 100%

				&:hover
					> *
						transform scale(1.2)
						transition transform 0s

				> *
					position absolute
					top 0
					left 0
					width 100%
					height 100%
					object-fit contain
					font-size 28px
					transition transform 0.2s ease
					pointer-events none
		
		>>> div.load-remote
			padding 0.5em

</style>
