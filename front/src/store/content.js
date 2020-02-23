const copy = x => JSON.parse(JSON.stringify(x))
const fGet = x => fetch(x, { method: 'GET' }).then(x => x.json())

export default {
    namespaced: true,

    state: {
        posts: []
    },

    mutations: {
        reinit (state) {
            state.posts = []
        },

        addPost (state, newPost) {
            for (const post of state.posts) {
                if (post.id === newPost.id) {
                    return Object.assign(post, newPost)
                }
            }

            state.posts = [
                ...state.posts,
                copy(newPost)
            ].sort((a, b) => b.id - a.id)
        }
    },

    actions: {
        async loadWall ({ commit }) {
            const postIds = await fGet('/api/wall')
            const posts = await Promise.all(postIds.map(x => fGet(`/api/post/${x}`)))
            
            commit('reinit')

            for (const post of posts) {
                commit('addPost', post)
            }
        },
 
        async loadPost ({ commit }, postId) {
            const post = await fGet(`/api/post/${postId}`)

            commit('addPost', post)

            return post
        },

        async getPostById ({ state, dispatch }, postId) {
            const hasStatePost = state.posts.map(x => x.id).includes(postId)

            if (!hasStatePost) {
                await dispatch('loadPost', postId)
            }
            return state.posts.find(x => x.id === postId)
        },

        async sendPost ({ rootState }, { file, description }) {
            if (!rootState.account || !rootState.account.isAuthenticated) {
                return false
            }

            const formData = new FormData
            formData.append('image', file)
            formData.append('description', description)

            const loader = await fetch('/api/post/create', {
                method: 'POST',
                body: formData
            })
            .then(x => x.json())
            console.log(loader)
           // return loader
        },

        async addComment ({ rootState }, data) {
            if (!rootState.account || !rootState.account.isAuthenticated) {
                return false
            }

            const formData = new FormData
            formData.append('postId', data.postId)
            formData.append('comment', data.comment)

            const sender = await fetch('/api/comment/create', {
                method: "POST",
                body: formData
            })

            console.log(sender)
        },

        async deletePost({rootState}, data){
            if (!rootState.account || !rootState.account.isAuthenticated) {
                return false
            }
            
            console.log('deleting post no : ', data.postId)
            const deleter = await fGet(`/api/post/delete/${data.postId}`)
            
            console.log('i am deleter', deleter)
        },

        async updatePost({rootState}, data){
            if (!rootState.account || !rootState.account.isAuthenticated) {
                return false
            }
            console.log('state: updating post no : ', data.postId, data.newDescription)

            const formData = new FormData
            formData.append('postId', data.postId)
            formData.append('newDescription', data.newDescription)
            const updater = await fetch('/api/post/update', {
                method: "POST",
                body: formData
            })
            console.log('state: i am updater', updater)
        }
    }
}