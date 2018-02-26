import {MiddlewaresConsumer, Module, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import {CryptoVipAdapter} from "./adapters/crypto-vip";
import {AdapterWrapper} from "./common/adapter/adapter.component";
import {AdapterAbstract} from "./common/adapter/adapter.abstract";
import {MaxmindService} from "./common/maxmind.service";
import {LeadsMiddleware} from "./middleware/leads.middleware";

@Module({
  imports: [],
  controllers: [AppController],
  components: [
      MaxmindService,
      AdapterWrapper,
      AdapterAbstract,
      CryptoVipAdapter
  ],
})
export class ApplicationModule {


    configure(consumer: MiddlewaresConsumer): void {
        // Apply tracker middleware
        consumer.apply(LeadsMiddleware).forRoutes(
            {path: '/leads', method: RequestMethod.POST}
        );
    }

}
