#!/usr/bin/env node
// Regenerates the example scaffolding in this repo from the templates that
// `n8n-node new` currently ships, so the starter stays in sync with the CLI.
//
// This repo's example content is a composite of two separately generated
// templates:
//   - nodes/Example/                          <- programmatic/example
//   - nodes/GithubIssues/, credentials/, icons/ <- declarative/github-issues
//
// Anything outside those paths (README, LICENSE, CI/publish workflows,
// package.json identity fields, etc.) is left untouched.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TEMPLATES = [
	{
		// Package name matches what's already committed in this repo's
		// nodes/Example/Example.node.json ("node" field) — using anything else
		// would make that field flip on every refresh for no real reason.
		template: 'programmatic/example',
		pkgName: 'n8n-nodes-example',
		syncDirs: ['nodes/Example'],
	},
	{
		// Same idea, matching nodes/GithubIssues/GithubIssues.node.json.
		template: 'declarative/github-issues',
		pkgName: 'n8n-nodes-github-issues',
		syncDirs: ['nodes/GithubIssues', 'credentials', 'icons'],
	},
];

// Identical across every template as of this writing; synced from the first
// template's output. Safe to sync wholesale since these files aren't meant
// to carry repo-specific customization.
const SHARED_FILES = ['tsconfig.json', 'eslint.config.mjs', '.prettierrc.js', '.vscode/launch.json'];

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'n8n-node-scaffold-'));

// Invoke the local bin by path rather than `npx n8n-node`: npx resolves bin
// names by walking up node_modules from `cwd`, which is a bare scratch
// directory here. When that lookup fails it falls back to installing
// whatever package the registry has under that literal name — and an
// unrelated package named `n8n-node` (a dependency-confusion placeholder,
// unaffiliated with n8n) squats exactly that name.
const n8nNodeBin = path.join(repoRoot, 'node_modules', '.bin', 'n8n-node');

function generate({ template, pkgName }) {
	const cwd = path.join(tmpRoot, pkgName);
	fs.mkdirSync(cwd, { recursive: true });
	console.log(`Running n8n-node new --template ${template}`);
	execFileSync(
		n8nNodeBin,
		['new', pkgName, '--skip-install', '--force', '--template', template],
		{ cwd, env: { ...process.env, CI: 'true' }, stdio: 'inherit' },
	);
	return path.join(cwd, pkgName);
}

function syncDir(src, dest) {
	fs.rmSync(dest, { recursive: true, force: true });
	fs.cpSync(src, dest, { recursive: true });
	console.log(`Synced ${path.relative(repoRoot, dest)}`);
}

function syncFile(src, dest) {
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(src, dest);
	console.log(`Synced ${path.relative(repoRoot, dest)}`);
}

let firstGeneratedRoot;

for (const entry of TEMPLATES) {
	const generatedRoot = generate(entry);
	firstGeneratedRoot ??= generatedRoot;

	for (const relDir of entry.syncDirs) {
		syncDir(path.join(generatedRoot, relDir), path.join(repoRoot, relDir));
	}
}

for (const relFile of SHARED_FILES) {
	const src = path.join(firstGeneratedRoot, relFile);
	if (fs.existsSync(src)) {
		syncFile(src, path.join(repoRoot, relFile));
	}
}

// Only the `scripts` block is refreshed — every other field (name, version,
// author, repository, the n8n nodes/credentials manifest, devDependency
// pins, ...) is repo-specific or already kept current by Dependabot.
const generatedPkg = JSON.parse(fs.readFileSync(path.join(firstGeneratedRoot, 'package.json'), 'utf8'));
const repoPkgPath = path.join(repoRoot, 'package.json');
const repoPkg = JSON.parse(fs.readFileSync(repoPkgPath, 'utf8'));
repoPkg.scripts = generatedPkg.scripts;
fs.writeFileSync(repoPkgPath, `${JSON.stringify(repoPkg, null, '\t')}\n`);
console.log('Synced package.json scripts');

fs.rmSync(tmpRoot, { recursive: true, force: true });
