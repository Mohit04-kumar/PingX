import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
  require('dotenv').config({ path: './server/.env' });
  require('dotenv').config();
} catch (e) {}

const app = require('../server/index.js');

export default app;
