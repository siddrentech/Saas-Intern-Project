import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const verificationLinksPath = path.join(process.cwd(), ".dev-verification-links.json")
const passwordResetLinksPath = path.join(process.cwd(), ".dev-password-reset-links.json")

function getLinks(filePath: string) {
  if (!existsSync(filePath)) {
    return {}
  }

  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as Record<
      string,
      string
    >
  } catch {
    return {}
  }
}

function saveLink(filePath: string, email: string, url: string) {
  const links = getLinks(filePath)
  links[email.toLowerCase()] = url
  writeFileSync(filePath, JSON.stringify(links, null, 2))
}

function deleteLink(filePath: string, email: string) {
  const links = getLinks(filePath)
  delete links[email.toLowerCase()]
  writeFileSync(filePath, JSON.stringify(links, null, 2))
}

export function saveDevVerificationLink(email: string, url: string) {
  saveLink(verificationLinksPath, email, url)
}

export function getDevVerificationLink(email: string) {
  return getLinks(verificationLinksPath)[email.toLowerCase()] ?? null
}

export function deleteDevVerificationLink(email: string) {
  deleteLink(verificationLinksPath, email)
}

export function saveDevPasswordResetLink(email: string, url: string) {
  saveLink(passwordResetLinksPath, email, url)
}

export function getDevPasswordResetLink(email: string) {
  return getLinks(passwordResetLinksPath)[email.toLowerCase()] ?? null
}
