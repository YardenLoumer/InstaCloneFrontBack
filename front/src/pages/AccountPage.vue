<template lang="pug">
	.container(v-if="isAuthenticated")
		.post
			.post__header
				form(style="width: 100%")
					fieldset
						legend Разлогин
						button(@click.prevent="signout()") Выйти
	.container(v-else)
		.post
			.post__header
				form(style="width: 100%")
					fieldset
						legend Авторизация
						input(type="text" placeholder="login" v-model="user.login")
						br
						input(type="password" placeholder="password" v-model="user.password")
						br
						button(@click.prevent="signin()") Войти
	
</template>

<script>
export default {
	data () {
		const data = {
			user: {
				login: '',
				password: ''
			}
		}
		if (process.env.NODE_ENV === 'development') {
			data.user.login = 'test1'
			data.user.password = 'test1'
		}
		return data
	},
	methods: {
		async signin () {
			const password = this.user.password
			const login = this.user.login

			this.user.password = ''

			const answer = await this.$store.dispatch('account/signin', {
				login,
				password
			})

			console.log(answer)
		},

		signout () {
			this.$store.dispatch('account/signout')
		}
	}
}
</script>