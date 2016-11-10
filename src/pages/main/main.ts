import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Events, NavController, ModalController } from 'ionic-angular';
import { Wiki } from '../../providers/wiki';

import { SettingsPage } from '../settings/settings';
import { ArticlePage } from '../article/article';

import {
  StackConfig, DragEvent,
  SwingStackComponent, SwingCardComponent
} from 'angular2-swing';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
  entryComponents: [SwingStackComponent, SwingCardComponent]
})
export class MainPage {
  @ViewChild('stack') swingStack: SwingStackComponent;
  @ViewChildren('cards') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any>;
  stackConfig: StackConfig;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public wiki: Wiki,
    public modal: ModalController
  ){
    var that = this;
    this.events.subscribe('loadMore', (data) => {
      this.cards.pop();
      that.wiki.getArticles(1).then((a) => {
        if(!!a && a.length > 0){
          for(let i = 0; i < a.length; i++){
            that.cards.push(a[i]);
          }
        }
      });
    });

    this.cards = [];
    this.stackConfig = {
      minThrowOutDistance: 100,
      throwOutConfidence: (offset, element) => {
        return 1;
      },
      transform: (el, x, y, r) => {
        var c = '', ax = Math.abs(x);
        let m = Math.trunc(Math.min(256 - ax / 2, 256));
        let hc = Number(m).toString(16);
        while(hc.length < 2){ hc = "0" + hc; }
        if(x < 0) c = '#FF' + hc + hc;
        else c = '#' + hc + 'FF' + hc;

        el.style.background = c;
        el.style['transform'] = `translate3d(0,0,0) translate(${x}px, ${y}px) rotate(${r}deg)`;
      }
    };
  }

  trim(c: string): string {
    let el = c.length > 500 ? "..." : "";
    return c.substring(0, 500) + el;
  }

  stringify(c: any): string {
    return JSON.stringify(c);
  }

  trackByArticle(index: number, article: any){
    return article['pageid'];
  }

  ionViewDidLoad() {
    var that = this;

    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#fff';
    });

    this.wiki.getArticles(4).then((a) => {
      that.cards = a;
    });
  }

  like(actually: boolean){
    let card = this.cards.pop();
    let id = card['pageid'];
    let categories = card['categories'];
    var that = this;

    this.wiki.addHistory(id);
    if(!!categories){
      for(let i = 0; i < categories.length; i++){
        this.wiki.vote(categories[i], actually);
      }
    }

    this.wiki.getArticles(1).then((a) => {
      if(!!a && a.length > 0){
        for(let i = 0; i < a.length; i++){
          that.cards.push(a[i]);
        }
      }
    });
  }

  throwLeft(){
    this.like(false);
  }

  throwRight(){
    this.like(true);
  }

  settings(){
    this.modal.create(SettingsPage).present();
  }

  noCards(): boolean {
    return this.cards.length == 0;
  }

  view(card: any){
    this.modal.create(ArticlePage, {
      article: card
    }).present();
  }
}
