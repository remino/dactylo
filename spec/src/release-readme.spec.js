import { updateReadmeVersion } from '../../bin/release-readme.mjs'

describe('bin/release-readme.mjs', () => {
	const readme = `# dactylo

Typewriter effect in JS using CSS.

By Rémino Rem
`

	it('adds the visible README version line', () => {
		const next = updateReadmeVersion(readme, '0.2.0')

		expect(next).toContain('Dactylo v0.2.0\n\nBy Rémino Rem')
	})

	it('updates an existing visible README version line', () => {
		const next = updateReadmeVersion(
			readme.replace('By Rémino Rem', 'Dactylo v0.1.0\nBy Rémino Rem'),
			'0.2.0'
		)

		expect(next).toContain('Dactylo v0.2.0\nBy Rémino Rem')
		expect(next).not.toContain('Dactylo v0.1.0')
	})

	it('fails when the author marker is missing', () => {
		expect(() =>
			updateReadmeVersion(readme.replace('\nBy Rémino Rem', ''), '0.2.0')
		).toThrowError('README author marker was not found.')
	})
})
