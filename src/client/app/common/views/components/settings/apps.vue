<template>
<div class="root">
	<ui-info v-if="!fetching && apps.length == 0">{{ $t('no-apps') }}</ui-info>
	<div class="apps" v-if="apps.length != 0">
		<div class="app" v-for="app in apps" :key="app.id">
			<p><b>{{ app.name }}</b></p>
			<p>{{ app.createdAt }}</p>
			<p>{{ app.description }}</p>
			<ui-button @click="revoke(app.id)"><fa :icon="faTrashAlt"/></ui-button>
		</div>
	</div>
	<div>
		<ui-button @click="terminate()" style="margin-top: 24px">{{ $t('terminateStreaming') }}</ui-button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../../i18n';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default Vue.extend({
	i18n: i18n('desktop/views/components/settings.apps.vue'),
	data() {
		return {
			fetching: true,
			apps: [],
			faTrashAlt
		};
	},
	mounted() {
		this.reload();
	},
	methods: {
		reload() {
			this.$root.api('i/apps').then((apps: object[]) => {
				this.apps = apps;
				this.fetching = false;
			});
		},
		async revoke(tokenId: string) {
			if (!await this.getConfirmed(this.$t('revokeTokenConfirm'))) return;

			this.$root.api('i/revoke-token', { tokenId }).then(() => {
				this.reload();
			});
		},

		async terminate() {
			this.$root.api('i/terminate-streaming', { });
		},

		async getConfirmed(text: string): Promise<Boolean> {
			const confirm = await this.$root.dialog({
				type: 'warning',
				showCancelButton: true,
				title: 'confirm',
				text,
			});

			return !confirm.canceled;
		},
	}
});
</script>

<style lang="stylus" scoped>
.root
	> .apps
		> div
			padding 0 0 24px 0
</style>
