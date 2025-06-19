# 🪓 flatten-imports

> Codemod CLI to replace named imports from barrel files with direct imports — for faster builds, better dev performance, and leaner codebases.

---

## 🚀 Why?

Using barrel files like `src/components/index.ts` can:

- ❌ Slow down `next dev` and hot reloads
- ❌ Bloat Webpack dependency graphs
- ❌ Increase memory usage during `next build`
- ❌ Break tree-shaking in large projects

**`flatten-imports`** solves this by converting:

```ts
// Before
import { Button, Tooltip } from '@/components';
```

into:
```
// After
import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';
```


⸻

## 📦 Installation

You can use it directly with npx:

```
npx flatten-imports --paths src/components --alias @/
```

Or install globally:

```
npm install -g flatten-imports
```

## 🧠 How It Works
This CLI uses `ts-morph` (the TypeScript compiler under the hood) to safely:
-	Detect named imports from barrel paths (e.g. @/components)
-	Replace them with direct default imports
-	Works with .ts, .tsx, .js, and .jsx files

## 🔧 Usage

```
npx flatten-imports [options]
```

### Options
| Flag            | Description                                                                                   | Default          |
|----------------|-----------------------------------------------------------------------------------------------|------------------|
| `-p`, `--paths` | Comma-separated list of barrel directories to flatten (e.g. `src/components,src/hooks`)      | `src/components` |
| `-a`, `--alias` | Import alias used in code (e.g. `@`, `~`, `src/`)                                            | `@/`             |
| `--dry`         | Dry run — preview changes without writing to files                                           | `false`          |
| `-h`, `--help`  | Show CLI help                                                                                | —                |

## 🛠 Example

```
flatten-imports \
  --paths src/components,src/hooks,src/utils \
  --alias src/ \
  --dry
  ```

👉 This scans your source code and logs every file that would be updated, without actually saving changes.

## 🧪 Local Dev Setup

git clone https://github.com/sameeramadushan/flatten-imports.git
cd flatten-imports
npm install
npm run build
npm link

### Now you can use:
```
flatten-imports --help
```

## ✅ Best Practices
-	Run on a clean Git branch
- Combine with ESLint import/order rules for tidy imports
-	Avoid barrel files for performance-critical folders (components/, hooks/, etc.)

## 📄 License

MIT © Sameera Madushan
