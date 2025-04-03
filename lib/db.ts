import fs from 'fs/promises'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data/mockDB.json')

export async function readDB() {
  const data = await fs.readFile(dbPath, 'utf-8')
  return JSON.parse(data)
}

export async function writeDB(newData: any) {
  await fs.writeFile(dbPath, JSON.stringify(newData, null, 2))
}