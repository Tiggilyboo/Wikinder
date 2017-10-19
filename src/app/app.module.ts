import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Wikinder } from './app.component';

import { MainPage } from '../pages/main/main';
import { SettingsPage } from '../pages/settings/settings';
import { ArticlePage } from '../pages/article/article';
import { HistoryPage } from '../pages/history/history';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';

import { Cache } from '../providers/cache';
import { Wiki } from '../providers/wiki';

import { SortInterestPipe } from '../pipes/pipes';

import { SwingModule } from 'angular2-swing';

@NgModule({
  declarations: [
    Wikinder,
    ArticlePage,
    HistoryPage,
    MainPage,
    SettingsPage,
    BookmarksPage,
    SortInterestPipe
  ],
  imports: [
    IonicModule.forRoot(Wikinder),
    SwingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Wikinder,
    ArticlePage,
    BookmarksPage,
    HistoryPage,
    MainPage,
    SettingsPage
  ],
  providers: [
    Storage,
    Wiki, Cache,
    SortInterestPipe
  ]
})
export class AppModule {}
