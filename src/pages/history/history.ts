import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Cache } from '../../providers/cache';
import { Wiki } from '../../providers/wiki';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  history: Array<any> = [];
  interestsDeleted: boolean;
  last: number;
  size: number;

  constructor(
    public navCtrl: NavController,
    public cache: Cache,
    public wiki: Wiki
  ){
    this.interestsDeleted = false;
    this.size = 50;
    this.last = 0;
  }

  ionViewDidLoad() {
    this.history = [];
    this.load();
  }

  load(){
    var that = this;
    this.cache.all(this.last, this.size).then((d) => {
      for(let i = 0; i < d.length; i++){
        if(!!d[i] && !!d[i]['rank']){
          that.history.push(d[i]);
        }
      }
    });
  }

  delete(index: any): void {
    var c = this.history.splice(index, 1);
    if(!!c['interest']) this.cache.delete(c['interest']);
  }

  deleteInterests(){
    this.history = [];
    this.cache.clear();
    this.wiki.history.clear();
    this.interestsDeleted = true;
  }

  getColor(rank: number): string {
    if(!!rank){
      if(rank > 0){
        return "secondary"
      } else return "danger"
    } else return "light"
  }

  getTitle(interest: string): string {
    return interest.split(":")[1];
  }

  loadMore(e){
    setTimeout(() => {
      this.last += this.size;
      this.load();

      e.complete();
    }, 500);
  }

  dismiss(){
    this.wiki.history = new Set();
    for(let h = 0; h < this.history.length; h++){
      if(!!this.history[h]['categories'] && this.history[h]['categories'].length > 0){
        for(let c = 0; c < this.history[h]['categories'].length; c++){
          if(!!this.history[h]['categories']['title']){
            this.wiki.addHistory(this.history[h]['categories']['title']);
          }
        }
      }
    }
    this.navCtrl.pop();
  }
}
