import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Wikinder } from './app.component';

import { MainPage } from '../pages/main/main';
import { SettingsPage } from '../pages/settings/settings';
import { ArticlePage } from '../pages/article/article';

import { Cache } from '../providers/cache';
import { Wiki } from '../providers/wiki';
import { SwingModule } from 'angular2-swing';

@NgModule({
  declarations: [
    Wikinder,
    MainPage,
    SettingsPage,
    ArticlePage
  ],
  imports: [
    IonicModule.forRoot(Wikinder),
    SwingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Wikinder,
    MainPage,
    SettingsPage,
    ArticlePage
  ],
  providers: [
    Storage, Wiki, Cache
  ]
})
export class AppModule {}
