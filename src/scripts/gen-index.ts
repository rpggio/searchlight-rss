import * as fs from 'fs';
import { renderIndex } from '../renderIndex';

fs.writeFileSync('docs/index.html', renderIndex())
