import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import {MaxmindService} from "../common/maxmind.service";

/**
 * Tracker Middleware
 * Converting tracker parameters into request body
 */
@Middleware()
export class LeadsMiddleware implements NestMiddleware {

    constructor(private readonly maxmindService: MaxmindService) {}

    resolve(...args: any[]): ExpressMiddleware {
        return (req, res, next) => {

            // Extract user IP Address from the request
            let ipAddress = req.headers['http_cf_connecting_ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            // adding fallback to development
            if (process.env.NODE_ENV === 'development') {
                req.body.country = req.body.country || 'gb';

            }
            else {
                let geo = this.maxmindService.get(ipAddress);

                if (geo.country) {
                    req.body.country = geo.country.iso_code;
                }
            }

            // TODO. delete after testing
            if (req.body.country == 'il' || req.body.country == 'IL')
                req.body.country = 'gb';

            res.header("Access-Control-Allow-Origin", "*");
            next();
        };
    }
}
