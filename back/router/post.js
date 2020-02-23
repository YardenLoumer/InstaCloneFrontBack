import KoaRouter from 'koa-router'
import database from '../database'
import { imageUpload } from '../upload'
import { exec } from 'child_process'
import path from 'path'
import { remove } from 'lodash'
import { createContext } from 'vm'
import multer from '@koa/multer'

const router = new KoaRouter

router.get('/:postId', async (ctx, next) => {
    const users = database.get('users')
    const posts = database.get('posts')
    const comments = database.get('comments')

    const postId = parseInt(ctx.params.postId)
    const post = posts.find(x => x.id === postId)

    const { login, password, ...author } = users.find(x => x.id === post.authorId)
    post.user = author
    
    const ownComments = comments.filter(x => x.postId === post.id)
    ownComments.forEach(x => {
        const { login, password, ...author } = users.find(y => y.id === x.authorId)
        x.user = author
    })
    post.comments = ownComments

    ctx.body = post
})

router.post('/create', imageUpload.single('image'), async (ctx, next) => {
    if (!ctx.isAuthenticated()) {
        return ctx.body = {
            error: 'Не авторизованы'
        }
    }

    //const mimeType = path.extname(ctx.file.originalname)
   //console.log(ctx.file.path, ctx.file.destination, ctx.file.filename, mimeType)
   
   // await exec(`mv ${ctx.file.path} ${ctx.file.destination}${ctx.file.filename}${mimeType}`)
    const data = database.download()
    const post = {
        id: data.postIdCounter,
        authorId: ctx.state.user.id,
        tags: [],
        description: ctx.request.body.description,
        image: `/images/${ctx.file.filename}`
    }

    data.posts.push(post)
    data.postIdCounter++
    database.upload(data)

    ctx.body = { post }
}) 

router.get('/delete/:postId', async (ctx, next) => {
   
    console.log('i am id', ctx.params.postId)
    const data = database.download()

    const removedPost = remove(data.posts, (x) => x.id===parseInt(ctx.params.postId))
    database.upload(data)
    
    ctx.body = {removedPost}
  
})

router.post('/update', multer().none(), async (ctx, next) => {
    if (!ctx.isAuthenticated()) {
        ctx.body = {
            error: 'Не авторизован'
        }
    }
    console.log('i am request' , ctx.request.body)
    const data = database.download()
    const post = data.posts.find(x => x.id === parseInt(ctx.request.body.postId))
    post.description = ctx.request.body.newDescription
    database.upload(data)
    ctx.body = { post }
})

export default router