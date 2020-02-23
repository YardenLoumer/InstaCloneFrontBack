import multer from '@koa/multer'
import path from 'path'

//const imageUpload = multer({ dest: path.join(__dirname, '/static/images/') })

const storage = multer.diskStorage({
    destination: function (ctx, file, cb) {
      const  dest =  path.join(__dirname, '/static/images/') 
      cb(null, dest)
    },
    filename: function (ctx, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
  const imageUpload = multer({ storage: storage })

export {
    imageUpload
}

export default imageUpload 