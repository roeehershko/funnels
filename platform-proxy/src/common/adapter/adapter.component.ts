import {Component} from "@nestjs/common";
import {Adapter} from "./adapter.type";

@Component()
export class AdapterWrapper {

    adapters: any[] = [];

    addAdapter(name: string, adapter) {
        this.adapters[name] = adapter;
    }

    getAdapter(name): Adapter {
        return this.adapters[name];
    }
}
