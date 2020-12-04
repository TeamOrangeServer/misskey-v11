<template>
<mk-ui>
	<template #header><span style="margin-right:4px;"><fa :icon="faThumbsUp"/></span>{{ $t('@.noteReactions') }}</template>

	<main>
		<sequential-entrance animation="entranceFromTop" delay="25">
			<template v-for="reaction in reactions">
				<mk-note-detail class="post" :note="reaction.note" :key="reaction.note.id"/>
			</template>
		</sequential-entrance>
		<ui-button v-if="existMore" @click="more">{{ $t('@.load-more') }}</ui-button>
	</main>
</mk-ui>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import Progress from '../../../common/scripts/loading';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

export default Vue.extend({
	i18n: i18n(),
	data() {
		return {
			fetching: true,
			reactions: [],
			existMore: false,
			moreFetching: false,
			faThumbsUp
		};
	},
	created() {
		this.fetch();
	},
	mounted() {
		document.title = this.$root.instanceName;
	},
	methods: {
		fetch() {
			Progress.start();
			this.fetching = true;

			this.$root.api('i/reactions', {
				limit: 11
			}).then(reactions => {
				if (reactions.length == 11) {
					this.existMore = true;
					reactions.pop();
				}

				this.reactions = reactions;
				this.fetching = false;

				Progress.done();
			});
		},
		more() {
			this.moreFetching = true;
			this.$root.api('i/reactions', {
				limit: 11,
				untilId: this.reactions[this.reactions.length - 1].id
			}).then(reactions => {
				if (reactions.length == 11) {
					this.existMore = true;
					reactions.pop();
				} else {
					this.existMore = false;
				}

				this.reactions = this.reactions.concat(reactions);
				this.moreFetching = false;
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
main
	> * > .post
		margin-bottom 8px

	@media (min-width 500px)
		> * > .post
			margin-bottom 16px

</style>
