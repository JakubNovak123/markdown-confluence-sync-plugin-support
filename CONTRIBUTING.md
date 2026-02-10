# Contributing Guide

Thank you for considering contributing to markdown-confluence-sync-plugin-support!

## Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/yourusername/markdown-confluence-sync-plugin-support.git
cd markdown-confluence-sync-plugin-support
```

2. **Install dependencies**
```bash
npm install
```

3. **Run tests**
```bash
npm test
```

## Development Workflow

### Running Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Running Examples
```bash
# All examples
npm run examples

# Individual examples
npm run example:basic
npm run example:custom
npm run example:toc
```

## Coding Standards

### JavaScript Style

- Use ES6+ features
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Follow ESLint and Prettier configuration

### Documentation

- Add JSDoc comments to all functions
- Include type information in comments
- Provide examples in documentation
- Update README.md for new features

### Testing

- Write tests for all new features
- Maintain minimum 80% code coverage
- Follow existing test patterns
- Use descriptive test names

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

Examples:
```bash
git commit -m "feat: add support for custom TOC plugin"
git commit -m "fix: resolve plugin initialization race condition"
git commit -m "docs: update API reference with new methods"
```

## Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Write code
- Add tests
- Update documentation

3. **Ensure quality**
```bash
npm run lint
npm test
npm run test:coverage
```

4. **Commit and push**
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

5. **Open a Pull Request**

- Provide clear description
- Reference related issues
- Include examples if applicable

## Questions?

Feel free to open an issue for:

- Bug reports
- Feature requests
- Questions
- Discussions

Thank you for contributing! 🎉
```

### `LICENSE`
```
ISC License

Copyright (c) 2025 [Your Name]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.