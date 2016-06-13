import { bootstrap }        from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { AppComponent }     from './app.component';

import { NounService }  from './services/noun.service';
import { VerbService }  from './services/verb.service';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS, NounService, VerbService
]);
