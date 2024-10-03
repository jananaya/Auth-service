import { Injectable, PipeTransform } from '@nestjs/common';
import { Request } from 'express';
import { CreateSessionType } from './create-session.interface';
import * as UAParser from 'ua-parser-js';
import * as geoip from 'geoip-lite';

@Injectable()
export class CreateSessionPipe implements PipeTransform {
  transform(req: Request): CreateSessionType {
    const headers = req.headers;
    const parser = new UAParser(req.headers['user-agent']);
    const uaResult = parser.getResult();
    const ipAddress = req.ip === '::1' ? '127.0.0.1' : req.ip;
    const geo = geoip.lookup(ipAddress);

    return {
      ipAddress,
      deviceType: uaResult.device.type || 'Desktop',
      userAgent: (headers['user-agent'] as string) || null,
      os: uaResult.os.name || null,
      browser: uaResult.browser.name || null,
      location: geo ? `${geo.city}, ${geo.country}` : null,
    };
  }
}
