import {Get, Controller, Post, Body} from '@nestjs/common';
import {AdapterWrapper} from "./common/adapter/adapter.component";

@Controller()
export class AppController {

    constructor(private readonly adapterWrapper: AdapterWrapper) {

    }

	@Post('/leads')
	async addCustomer(@Body() body): Promise<any> {
        return await this.adapterWrapper
            .getAdapter('cryptovip')
            .addUser(body);
  }
}
