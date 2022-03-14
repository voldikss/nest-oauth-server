import { Controller, Get, Render } from '@nestjs/common'

import * as fs from 'fs'
import * as marked from 'marked'

import { Public } from './decorators/access.decorator'

const docFilePath = `${__dirname}/../README.md`

@Controller()
export class AppController {
  @Public()
  @Get()
  @Render('home')
  home() {
    const doc = fs.readFileSync(docFilePath, { encoding: 'utf8' })
    const documentation = marked.marked(doc)
    return { documentation }
  }

  @Public()
  @Get('/api/health')
  health(): string {
    return 'PASS'
  }
}
