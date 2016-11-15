import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, ToastController } from 'ionic-angular';

@Injectable()
export class Cache {

  constructor(
    public platform: Platform,
    public storage: Storage,
    public toast: ToastController
  ){
    this.init();
  }

  init(): Promise<void>{
    return this.storage.get('_settings').then((settings) => {
      if(!settings){
        this.storage.set('_settings', JSON.stringify({
          random: 0.3,
          language: 'en'
        }));
        this.storage.set('_bookmarks', '[]');
      }
    })
  }

  clear() {
    this.storage.clear();
  }

  set(interest: string, rank: number, referral: string){
    this.storage.set(interest, JSON.stringify({
      interest: interest,
      rank: rank,
      referral: referral
    }));
  }

  get(key: string): Promise<any>{
    return this.storage.get(key);
  }

  setBookmarks(bookmarks: Array<any>){
    this.storage.set('_bookmarks', JSON.stringify(bookmarks));
  }

  getBookmarks(): Promise<any>{
    return this.storage.get('_bookmarks').then((b) => {
      var v = typeof(b) === "string" ? JSON.parse(b) : b;
      if(!!v && v.length > 0) return v
      else return [];
    });
  }

  all(start: number, count: number): Promise<any>{
    var that = this;

    return new Promise(function(resolve, reject){
      let all = [];
      let s: number = 0;

      return that.storage.length().then((l) => {
        that.storage.forEach((v, k , i) => {
          if(!!v && !!v['interest']
          && ++s > start && all.length < count)
            all.push(v);
          if(all.length == l - 2) resolve(all);
        });
      });
    });
  }

  // This will get disgustingly slow
  getTopInterests(n: number): Promise<any>{
    var that = this;

    return new Promise(function(resolve,reject){
      var c = 0;

      that.storage.length().then((l) => {
        var all = [];
        that.storage.forEach((j: any, k: string, i: number) => {
          var v = typeof(j) === "string" ? JSON.parse(j) : j;
          if(!!v && !!v['interest']) all.push(v);
          if(++c >= l - 2) return all;
        }).then((a) => {
          c = 0;
          resolve(a.sort(function(x, y){
            return ++c >= n ? -1 : y['rank'] - x['rank'];
          }));
        }).catch((e) => {
          reject(e);
        });
      }).catch((e) => {
        reject(e);
      });
    });
  }

  getSettings(): Promise<any>{
    return this.storage.get('_settings');
  }

  saveSettings(language: string, randomChance: number){
    this.storage.set('_settings', {
      random: randomChance,
      language: language
    });
  }

  updateRank(interest: string, referral: string, increase: boolean = true): Promise<void>{
    var that = this;
    var newInterest = function(){
      that.storage.set(interest, {
        interest: interest,
        rank: increase ? 1 : -1,
        referral: referral
      });
    };
    return new Promise<void>(function(resolve, reject){
      that.storage.get(interest).then((d) => {
        if(!!d && !!d['rank']){
          let inc = increase ? 1 : -1;
          d['rank'] += inc;
          that.storage.set(interest, d);
        } else {
          newInterest();
        }
      }, (e) => {
        newInterest();
      });
    });
  }
}
