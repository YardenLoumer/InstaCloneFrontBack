import KoaRouter from 'koa-router'

import account from './account'
import comment from './comment'
import post from './post'
import wall from './wall'

import fs from 'fs'
import path from 'path'

const router = new KoaRouter

router.use('/api/account', account.routes(), account.allowedMethods())
router.use('/api/comment', comment.routes(), comment.allowedMethods())
router.use('/api/post', post.routes(), post.allowedMethods())
router.use('/api/wall', wall.routes(), wall.allowedMethods())

router.get('*', async (ctx, next) => {
	const fullPath = path.join(__dirname, '../../front/dist/index.html')
	ctx.set("content-type", "text/html; charset=UTF-8")
	ctx.body = fs.readFileSync(fullPath)
})

export default router
