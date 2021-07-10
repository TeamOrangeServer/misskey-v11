<template>
<div>
	<form @submit.prevent="onSubmit" v-if="true">
		<section>
			<ui-input v-model="username" type="text" pattern="^[a-zA-Z0-9_]+$" spellcheck="false" autofocus required>
				<span>{{ $t('username') }}</span>
				<template #prefix>@</template>
			</ui-input>

			<ui-input v-model="email" type="text" spellcheck="false" required>
				<span>{{ $t('email-address') }}</span>
				<template #desc>{{ $t('enter-email') }}</template>
			</ui-input>

			<ui-button type="submit" :disabled="processing" primary style="margin: 0 auto;">{{ $t('send') }}</ui-button>
		</section>

		<section>
			<router-link to="/about">{{ $t('if-no-email') }}</router-link>
		</section>
	</form>

	<form v-else>
		{{ $t('contact-admin') }}
	</form>
</div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	i18n: i18n('common/views/components/forgot-password.vue'),

	data() {
		return {
			username: '',
			email: '',
			processing: false,
		};
	},

	methods: {
		async onSubmit() {
			this.processing = true
			await this.$root.api('request-reset-password', {
				username: this.username,
				email: this.email,
			})
		}
	}
})
</script>

<style>

</style>
