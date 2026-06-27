import { existsSync } from 'node:fs';

const required = [
  'apps/stageos-main/package.json',
  'packages/stageos-shared/package.json',
  'modules/stageos-render-pipeline',
  'modules/stageos-system-modules',
  'modules/stageos-3d-mannequin-module',
  'modules/stageos-photo-video-render-module',
  'modules/stageos-color-rag-engine-module-v2',
  'modules/stageos-costume-commerce-module',
  'modules/stageos-costume-master-final',
];

const missing = required.filter((path) => !existsSync(path));
if (missing.length) {
  console.error('Missing required paths:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}
console.log('StageOS structure check passed.');
