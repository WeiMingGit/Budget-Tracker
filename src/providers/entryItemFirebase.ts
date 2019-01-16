import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';

import * as moment from 'moment'



@Injectable()
export class entryItemFbProvider {

  constructor(private fdb: AngularFireDatabase) {

  }






  removeItem(item) {
    this.fdb.list('entryItems/').remove(item.key);

  }

}
