<template>
<div class="rcsvsegy" v-if="!fetching">
	<sequential-entrance animation="entranceFromTop" delay="25">
		<template v-for="reaction in reactions">
			<mk-note-detail class="post" :note="reaction.note" :key="reaction.note.id"/>
		</template>
	</sequential-entrance>
	<div class="more" v-if="existMore">
		<ui-button inline @click="more">{{ $t('@.load-more') }}</ui-button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import Progress from '../../../common/scripts/loading';

export default Vue.extend({
	i18n: i18n('.vue'),
	data() {
		return {
			fetching: true,
			reactions: [],
			existMore: false,
			moreFetching: false
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
.rcsvsegy
	margin 0 auto

	> * > .post
		margin-bottom 16px

	> .more
		margin 32px 16px 16px 16px
		text-align center

</style>
