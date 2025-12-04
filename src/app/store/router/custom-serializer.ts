import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    let params = {};
    const queryParams = routerState.root.queryParams;

    while (route) {
      params = { ...params, ...route.params };
      route = route.firstChild!;
    }

    return {
      url: routerState.url,
      params,
      queryParams,
    };
  }
}
