export default {
    namespaced: true,
    state: {
        isAuthenticated: false,
        user: {
            id: null,
            name: null,
            sername: null
        }
    },
    mutations: {
        signin (state, user) {
            state.isAuthenticated = true

            Object.assign(state.user, user)
        },

        signout (state) {
            state.isAuthenticated = false

            Object.assign(state.user, {
                id: null,
                name: null
            })
        }
    },
    actions: {
        async signin ({ commit, state }, data) {
            // Уже авторизован
            if (state.isAuthenticated) {
                return true
            }

            const response = await fetch("/api/account/signin", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: data.login,
                    password: data.password
                })
            })

            const answer = await response.json()

            if (answer.isAuthenticated) {
                commit('signin', answer.user)
                return true
            }

            return false
        },

        async continue ({ state, commit }) {
            // Уже авторизован
            if (state.isAuthenticated) {
                return true
            }

            const response = await fetch("/api/account/continue", {
                method: 'POST'
            })

            const answer = await response.json()

            if (answer.isAuthenticated) {
                commit('signin', answer.user)
                return true
            }

            return false
        },

        async signout ({ state, commit }) {
            if (!state.isAuthenticated) {
                return true
            }

            fetch("/api/account/signout", {
                method: 'POST'
            })

            commit('signout')

            return true
        }
    }
}