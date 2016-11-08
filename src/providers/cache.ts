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

  // This will get disgustingly slow
  getTopInterests(n: number): Promise<any>{
    var that = this;

    return new Promise(function(resolve,reject){
      var c = 0;

      that.storage.length().then((l) => {
        that.storage.forEach((j: any, k: string, i: number) => {
          var all = [];
          var v = JSON.parse(j)

          if(!!v && !!v['interest']) all.push(v);
          if(++c >= l) return all;
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

  updateRankWithReferral(referral: string, increase: boolean = true): Promise<void>{
    return new Promise<void>(() => {
      this.storage.forEach((j: any, k: string, i: number) => {
        var it = JSON.parse(j);
        if(it.referral == referral){
          it.rank += increase ? 1 : -1;
          this.storage.set(it.interest, it);
        }
      });
    });
  }
}
