import * as fs from 'fs';
import { renderIndex } from '../renderIndex';

const index = renderIndex()
console.log(index)
fs.writeFileSync('docs/index.html', index)
