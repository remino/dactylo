#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const readmePath = resolve(root, 'README.md')

const versionLinePattern = /^Dactylo v\d+\.\d+\.\d+(?:[-+\w.]+)?$/m

export const updateReadmeVersion = (readme, version) => {
	const versionLine = `Dactylo v${version}`

	if (versionLinePattern.test(readme)) {
		return readme.replace(versionLinePattern, versionLine)
	}

	const marker = '\nBy Rémino Rem'

	if (!readme.includes(marker)) {
		throw new Error('README author marker was not found.')
	}

	return readme.replace(marker, `\n${versionLine}\n${marker}`)
}

const run = async ([command, version]) => {
	if (command !== 'update' || !version) {
		throw new Error('Usage: release-readme.mjs update <version>')
	}

	const readme = await readFile(readmePath, 'utf8')
	await writeFile(readmePath, updateReadmeVersion(readme, version))
}

if (import.meta.url === `file://${process.argv[1]}`) {
	run(process.argv.slice(2)).catch(error => {
		console.error(error.message)
		process.exitCode = 1
	})
}
