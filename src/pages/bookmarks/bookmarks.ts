import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ArticlePage } from '../../pages/article/article';

import { Cache } from '../../providers/cache';

@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class BookmarksPage {
  bookmarks: Array<any>;

  constructor(
    public navCtrl: NavController,
    public modal: ModalController,
    public cache: Cache
  ){
    this.bookmarks = [];
  }

  ionViewDidLoad() {
    var that = this;
    this.cache.getBookmarks().then((b) => {
      if(!!b && b != null){
        that.bookmarks = b;
      }
    });
  }

  delete(index: number){
    this.bookmarks.splice(index, 1);
    this.cache.setBookmarks(this.bookmarks);
  }

  deleteBookmarks(){
    this.bookmarks = [];
    this.cache.setBookmarks([]);
  }

  view(card: any){
    this.modal.create(ArticlePage, {
      article: card
    }).present();
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
