import { JsonController, Get } from 'routing-controllers';
import { type, version, freemem, totalmem } from 'os';

@JsonController('/api/_system')
export class SystemController {
  @Get('/info')
  info() {
    return {
      os: {
        type,
        version
      },
      memory: {
        used: Math.round(process.memoryUsage().rss / (1024 * 1024)),
        total: Math.round(totalmem() / (1024 * 1024)),
        free: Math.round(freemem() / (1024 * 1024))
      },
      status: true
    };
  }
}
