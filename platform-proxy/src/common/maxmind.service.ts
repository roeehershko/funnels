import {Component} from "@nestjs/common";
import * as maxmind from 'maxmind';
import {Response} from "maxmind";

@Component()
export class MaxmindService {

    private mmdb: maxmind.Reader;

    constructor() {
        // Initialize maxmind database
        this.mmdb = maxmind.openSync('./src/resources/GeoLite2-City.mmdb');
    }

    public get(ip: string): Response {
        return this.mmdb.get(ip);
    }
}
