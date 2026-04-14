import { Project, SyntaxKind, Node } from 'ts-morph';
import * as fs from 'node:fs';
import * as path from 'node:path';

type LayerName = 'components' | 'facades' | 'services' | 'models' | 'adapters' | 'pages' | 'messages' | 'other';

interface FileMetric {
  filePath: string;
  layer: LayerName;
  loc: number;
  imports: number;
  classes: number;
  interfaces: number;
  methods: number;
  inputs: number;
  outputs: number;
  cyclomaticApprox: number;
}

interface LayerSummary {
  files: number;
  loc: number;
  imports: number;
  classes: number;
  interfaces: number;
  methods: number;
  inputs: number;
  outputs: number;
  cyclomaticApprox: number;
}

interface ImportEdge {
  from: string;
  to: string;
  fromLayer: LayerName;
  toLayer: LayerName;
}

interface LayerDependencySummary {
  [fromLayer: string]: {
    [toLayer: string]: number;
  };
}

interface MetricsReport {
  generatedAt: string;
  projectRoot: string;
  sourceRoot: string;
  totalFiles: number;
  files: FileMetric[];
  summary: Record<LayerName, LayerSummary>;
  totals: {
    loc: number;
    imports: number;
    classes: number;
    interfaces: number;
    methods: number;
    inputs: number;
    outputs: number;
    cyclomaticApprox: number;
  };
  importGraph: ImportEdge[];
  layerDependencies: LayerDependencySummary;
}

const PROJECT_ROOT = path.resolve(process.cwd());
const SOURCE_ROOT = path.join(PROJECT_ROOT, 'src', 'app');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'metrics');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'metrics.json');
const OUTPUT_CSV = path.join(OUTPUT_DIR, 'metrics.csv');

const project = new Project({
  tsConfigFilePath: path.join(PROJECT_ROOT, 'tsconfig.json'),
});

function normalize(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function detectLayer(filePath: string): LayerName {
  const normalized = normalize(filePath);

  if (normalized.includes('/components/')) return 'components';
  if (normalized.includes('/facades/')) return 'facades';
  if (normalized.includes('/services/')) return 'services';
  if (normalized.includes('/models/')) return 'models';
  if (normalized.includes('/adapters/')) return 'adapters';
  if (normalized.includes('/pages/')) return 'pages';
  return 'other';
}

function countLoc(text: string): number {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0).length;
}

function countCyclomaticApprox(text: string): number {
  const matches = text.match(/\b(if|for|while|case|catch)\b|(\?)|(&&)|(\|\|)/g);
  return 1 + (matches?.length ?? 0);
}

function getDecoratorCountByName(decorators: Array<{ getName(): string }>, name: string): number {
  return decorators.filter((decorator) => decorator.getName() === name).length;
}

function isLocalAppImport(importPath: string): boolean {
  return importPath.startsWith('.');
}

function resolveImportedFilePath(fromFilePath: string, importPath: string): string | null {
  if (!isLocalAppImport(importPath)) {
    return null;
  }

  const fromDir = path.dirname(fromFilePath);
  const candidates = [
    path.resolve(fromDir, importPath),
    path.resolve(fromDir, `${importPath}.ts`),
    path.resolve(fromDir, `${importPath}.tsx`),
    path.resolve(fromDir, `${importPath}.js`),
    path.resolve(fromDir, `${importPath}.mjs`),
    path.resolve(fromDir, importPath, 'index.ts'),
  ];

  for (const candidate of candidates) {
    const normalized = normalize(candidate);
    const sourceFiles = project.getSourceFiles().filter((sf) => normalize(sf.getFilePath()) === normalized);
    if (sourceFiles.length > 0) {
      return normalized;
    }
  }

  return null;
}

function toCsv(report: MetricsReport): string {
  const header = [
    'filePath',
    'layer',
    'loc',
    'imports',
    'classes',
    'interfaces',
    'methods',
    'inputs',
    'outputs',
    'cyclomaticApprox',
  ];

  const rows = report.files.map((file) => [
    file.filePath,
    file.layer,
    file.loc,
    file.imports,
    file.classes,
    file.interfaces,
    file.methods,
    file.inputs,
    file.outputs,
    file.cyclomaticApprox,
  ]);

  return [header, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? '');
          return value.includes(',') || value.includes('"') || value.includes('\n')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(','),
    )
    .join('\n');
}

function createEmptySummary(): Record<LayerName, LayerSummary> {
  return {
    components: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
    facades: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
    services: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
    models: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
    adapters: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
    pages: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
    messages: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
    other: { files: 0, loc: 0, imports: 0, classes: 0, interfaces: 0, methods: 0, inputs: 0, outputs: 0, cyclomaticApprox: 0 },
  };
}

const files: FileMetric[] = [];
const importGraph: ImportEdge[] = [];
const layerDependencies: LayerDependencySummary = {};

for (const sourceFile of project.getSourceFiles()) {
  const rawFilePath = sourceFile.getFilePath();
  const normalizedFilePath = normalize(rawFilePath);

  if (!normalizedFilePath.startsWith(normalize(SOURCE_ROOT))) {
    continue;
  }

  const layer = detectLayer(normalizedFilePath);
  const text = sourceFile.getFullText();
  const classes = sourceFile.getClasses();
  const interfaces = sourceFile.getInterfaces();
  const imports = sourceFile.getImportDeclarations().length;
  const loc = countLoc(text);

  let methods = 0;
  let inputs = 0;
  let outputs = 0;
  let cyclomaticApprox = 0;

  for (const cls of classes) {
    methods += cls.getMethods().length;

    for (const prop of cls.getProperties()) {
      const decorators = prop.getDecorators();
      inputs += getDecoratorCountByName(decorators, 'Input');
      outputs += getDecoratorCountByName(decorators, 'Output');
    }

    for (const method of cls.getMethods()) {
      const bodyText = method.getBodyText() ?? '';
      cyclomaticApprox += countCyclomaticApprox(bodyText);
    }
  }

  files.push({
    filePath: normalizedFilePath.replace(normalize(PROJECT_ROOT), '').replace(/^\/+/, ''),
    layer,
    loc,
    imports,
    classes: classes.length,
    interfaces: interfaces.length,
    methods,
    inputs,
    outputs,
    cyclomaticApprox,
  });

  for (const importDecl of sourceFile.getImportDeclarations()) {
    const importPath = importDecl.getModuleSpecifierValue();
    const resolved = resolveImportedFilePath(normalizedFilePath, importPath);

    if (!resolved) {
      continue;
    }

    const toLayer = detectLayer(resolved);

    importGraph.push({
      from: normalizedFilePath.replace(normalize(PROJECT_ROOT), '').replace(/^\/+/, ''),
      to: resolved.replace(normalize(PROJECT_ROOT), '').replace(/^\/+/, ''),
      fromLayer: layer,
      toLayer,
    });

    if (!layerDependencies[layer]) {
      layerDependencies[layer] = {};
    }
    if (!layerDependencies[layer][toLayer]) {
      layerDependencies[layer][toLayer] = 0;
    }

    layerDependencies[layer][toLayer] += 1;
  }
}

const summary = createEmptySummary();

for (const file of files) {
  const s = summary[file.layer];
  s.files += 1;
  s.loc += file.loc;
  s.imports += file.imports;
  s.classes += file.classes;
  s.interfaces += file.interfaces;
  s.methods += file.methods;
  s.inputs += file.inputs;
  s.outputs += file.outputs;
  s.cyclomaticApprox += file.cyclomaticApprox;
}

const totals = files.reduce(
  (acc, file) => {
    acc.loc += file.loc;
    acc.imports += file.imports;
    acc.classes += file.classes;
    acc.interfaces += file.interfaces;
    acc.methods += file.methods;
    acc.inputs += file.inputs;
    acc.outputs += file.outputs;
    acc.cyclomaticApprox += file.cyclomaticApprox;
    return acc;
  },
  {
    loc: 0,
    imports: 0,
    classes: 0,
    interfaces: 0,
    methods: 0,
    inputs: 0,
    outputs: 0,
    cyclomaticApprox: 0,
  },
);

const report: MetricsReport = {
  generatedAt: new Date().toISOString(),
  projectRoot: PROJECT_ROOT,
  sourceRoot: SOURCE_ROOT,
  totalFiles: files.length,
  files,
  summary,
  totals,
  importGraph,
  layerDependencies,
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(OUTPUT_CSV, toCsv(report), 'utf8');

console.log(`Metrics collected: ${report.totalFiles} files`);
console.log(`JSON: ${OUTPUT_JSON}`);
console.log(`CSV: ${OUTPUT_CSV}`);
console.log(`Import edges: ${report.importGraph.length}`);
