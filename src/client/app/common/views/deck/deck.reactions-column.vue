<template>
<x-column>
	<template #header>
		<fa :icon="faThumbsUp"/>{{ $t('@.noteReactions') }}
	</template>

	<div>
		<x-notes ref="timeline" :make-promise="makePromise" @inited="() => $emit('loaded')"/>
	</div>
</x-column>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import XColumn from './deck.column.vue';
import XNotes from './deck.notes.vue';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const fetchLimit = 10;

export default Vue.extend({
	i18n: i18n(),

	components: {
		XColumn,
		XNotes,
	},

	data() {
		return {
			faThumbsUp,
			makePromise: cursor => this.$root.api('i/reactions', {
				limit: fetchLimit + 1,
				untilId: cursor ? cursor : undefined,
			}).then((favs: any[]) => {
				const notes = favs.map(x => x.note);
				if (notes.length == fetchLimit + 1) {
					notes.pop();
					return {
						notes: notes,
						cursor: favs[notes.length - 1].id
					};
				} else {
					return {
						notes: notes,
						cursor: null
					};
				}
			})
		};
	},

	methods: {
		focus() {
			this.$refs.timeline.focus();
		}
	}
});
</script>
