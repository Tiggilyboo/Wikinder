import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { Cache } from '../../providers/cache';
import { Wiki } from '../../providers/wiki';

@Component({
  selector: 'page-article',
  templateUrl: 'article.html'
})
export class ArticlePage {
  numShow: number;
  article: any;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public params: NavParams,
    public cache: Cache,
    public wiki: Wiki
  ){
    this.numShow = 2;
    this.article = params.get('article');
  }

  launch(pageId: string){
    new InAppBrowser(
      this.wiki.getPage(pageId),
      '_system'
    );
  }

  showMore(){
    this.numShow += 5;
  }

  like(actually: boolean){
    let id = this.article['pageid'];
    let categories = this.article['categories'];

    this.wiki.addHistory(id);
    if(!!categories){
      for(let i = 0; i < categories.length; i++){
        this.wiki.vote(categories[i], id, actually);
      }
    }

    this.events.publish('loadMore', {
      count: 1
    });
    this.dismiss();
  }


    bookmark(){
      var that = this;
      let id: string = this.article['pageid'];

      if(!!id){
        this.wiki.addHistory(id);
        this.cache.getBookmarks().then((b) => {
          that.cache.setBookmarks(b.concat(that.article));
        });
      }
      this.events.publish('loadMore', {
        count: 1
      });
      this.dismiss();
    }

  parseCategory(c: string): string {
    return c.split(":")[1];
  }

  dismiss(){
    this.navCtrl.pop();
  }
}
