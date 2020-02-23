import KoaRouter from 'koa-router'
import database from '../database'

const router = new KoaRouter

router.post("/signin", async (ctx, next) => {
    const { login = "", password = "" } = ctx.request.body
    const user = database.get('users').find(user => user.login === login)

    if (user && user.password === password) {
        await ctx.login(user)

        ctx.body = {
            isAuthenticated: true,
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname
            }
        }                                                                                                                                                                                                                                                                                                                                                                                                                        
    }

    else {
        ctx.body = {
            isAuthenticated: false
        }
    }
})

router.post("/continue", async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        const user = ctx.state.user

        ctx.body = {
            isAuthenticated: true,
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname
            }
        }
    }

    else {
        ctx.body = {
            isAuthenticated: false
        }
    }
})

router.post("/signout", async (ctx, next) => {
	if (ctx.isAuthenticated()) {
		ctx.logout()
    }
    
    ctx.body = {
        isAuthenticated: false
    }
})

export default router