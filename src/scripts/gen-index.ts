import * as fs from 'fs';
import { renderIndex } from '../renderIndex';

const index = renderIndex()
fs.writeFileSync('docs/index.html', index)
