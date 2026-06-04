import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const DAYS_AGO = 7
const npmrcPath = resolve(process.cwd(), ".npmrc")

const oneWeekAgo = new Date(
  Date.now() - DAYS_AGO * 24 * 60 * 60 * 1000
).toISOString()

let content = ""

if (existsSync(npmrcPath)) {
  content = readFileSync(npmrcPath, "utf-8")
  if (content.includes("before=")) {
    content = content.replace(/before=.*/, `before=${oneWeekAgo}`)
  } else {
    content = content.trimEnd() + `\nbefore=${oneWeekAgo}\n`
  }
} else {
  content = `before=${oneWeekAgo}\n`
}

writeFileSync(npmrcPath, content)
