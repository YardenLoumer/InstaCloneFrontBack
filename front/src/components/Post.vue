<template lang="pug">
	.post
		.post__header
			.post__user
				.user
					router-link.user__avatar(:to='`/post/${postData.id}/edit`')
						img(:src='postData.user.ava', alt='')
					router-link.user__name(:to='`/post/${postData.id}/edit`') {{ postData.user.name }} {{ postData.user.surname }}
			.post__links
				a.edit-link(
					href='#'
					@click.prevent="deletePost()"
					) 
					i.far.fa-trash-alt
					| Delete
				router-link.edit-link(:to='`/post/${postData.id}/edit`')
					i.fas.fa-pencil-alt
					| Edit
		.post__img
			img(:src='postData.image', alt='Photo')

		.post__data
			.post__description {{ postData.description }}
			.post__hashtags
				template(v-for='tag of postData.tags')
					a(href='#', v-bind:key='tag') {{ '#' + tag }}

		.post__comments
			comment(v-for='comment of postData.comments', :data='comment', v-bind:key='comment.id')

		.post__comment-form
			.comment-form
				textarea.comment-form__textarea(placeholder='Добавить комментарий' v-model="newComment")
				button.comment-form__button(:disabled='!newComment' @click="send()") Опубликовать
</template>

<script>
import Comment from '@/components/Comment'

export default {
	props: ['postData'],

	components: {
		Comment
	},

	data () {
		return {
			newComment: ''
		}
	},

	methods: {
		async send () {
			await this.$store.dispatch('content/addComment', {
				comment: this.newComment,
				postId: this.$props.postData.id
			})

			await this.$store.dispatch('content/loadPost', this.$props.postData.id)

			this.newComment = ''
		},

		async deletePost () {
			
			await this.$store.dispatch('content/deletePost', {
				postId: this.$props.postData.id
			})

			this.$router.go()
		}
	}
}
</script>