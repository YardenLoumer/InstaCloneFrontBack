<template lang="pug">
	.container
		.post
			.post__header
				form(style="width: 100%")
					fieldset
						legend Новый пост
						img(v-if="base64" :src="base64")
						input(
							ref="imageInput"
							v-show="!base64"
							v-on:change="imageInput"
							type="file"
							accept=".jpg, .jpeg, .png"
						)
						textarea(
							v-model="description"
							placeholder="Описание"
							style="width:100%"
							rows="10"
						)
						button(@click.prevent="send()" :disabled="!base64") Отправить
						
</template>

<script>
export default {
	data () {
		return {
			base64: null,
			description: '',
			tags: ''
		}
	},

	methods: {
		imageInput (event) {
			console.log(event.target.files)
			const reader = new FileReader
			reader.onload = event => this.base64 = event.target.result
			//reader.onload = (event) => console.log(event.target.result)
			reader.readAsDataURL(event.target.files[0])
		},

		async send () {
			await this.$store.dispatch('content/sendPost', {
				description: this.description,
				file: this.$refs.imageInput.files[0]
			})
			
			this.$router.push('/wall')
		}
	}
}
</script>