import fs from 'fs'
import path from 'path'
import { get } from 'lodash'

const localPath = path.join(__dirname, './database.json')
const originalPath = path.join(__dirname, './original/database.json')

const loadDatabase = path => JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }))
const saveDatabase = (path, x) => fs.writeFileSync(path, JSON.stringify(x, null, 3), { encoding: 'utf-8' })

const api = {
    get: path => get(loadDatabase(localPath), path),
    download: () => loadDatabase(localPath),
    upload: x => saveDatabase(localPath, x),
    loadOriginal: () => saveDatabase(localPath, loadDatabase(originalPath))
}

export default api

