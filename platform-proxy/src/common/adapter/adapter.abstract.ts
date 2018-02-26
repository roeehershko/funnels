import {Component} from "@nestjs/common";
import {AdapterWrapper} from "./adapter.component";

@Component()
export abstract class AdapterAbstract {

    adapterName = 'cryptovip';

    constructor(wrapper: AdapterWrapper) {
        wrapper.addAdapter(this.adapterName, this);
    }
}
