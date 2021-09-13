import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { earningsData, scholarOfficialData, statsData } from '../models/interfaces';
import { Axie } from '../models/axie';

@Injectable({
  providedIn: 'root'
})
export class AxieApiService {
  private REST_API_SERVER = 'https://api.lunaciaproxy.cloud';

  constructor(private httpClient: HttpClient) { }

  
  public async getAxies(roninAddres:string):Promise<Axie[]> {
    return this.httpClient
      .get(`${this.REST_API_SERVER}/_axies/${roninAddres}`)
      .toPromise()
      .then((axiesData:any)=>{
        const axies : Axie[] = axiesData.available_axies.results.map((axieData)=>{
          return new Axie(axieData);
        });
        return axies;
      })
  }
  public async getAllAccountData(roninAddress: string):Promise<any>{
    let earnings, stats;
    [stats, earnings] = await Promise.all(
      [this.getStats(roninAddress),
      this.getEarnings(roninAddress)]
    );
    let apiData: scholarOfficialData = this.parseData(earnings, stats, roninAddress);
    return apiData;
  }
  public async getAccountData(roninAddress: string) {
    let stats = await this.getStats(roninAddress);
    let apiData: scholarOfficialData = this.parseStatusData(stats, roninAddress);
    return apiData;
  }
  private getStats(roninAddres: string):Promise<any>{
    return this.httpClient
      .get(`${this.REST_API_SERVER}/_stats/${roninAddres}`)
      .toPromise()
      .then((statsData:any)=>{
        return statsData.stats;
      })
  }
  private getEarnings(roninAddres: string):Promise<any>{
    return this.httpClient
      .get(`${this.REST_API_SERVER}/_earnings/${roninAddres}`)
      .toPromise()
      .then((earningsData:any)=>{
        return earningsData.earnings;
      })
  }
  private parseData(earnings: earningsData, stats: statsData, roninAddress: string):scholarOfficialData{
    let data :scholarOfficialData = this.parseStatusData(stats, roninAddress);
    data.ronin_slp = earnings.slp_holdings;
    data.total_slp = earnings.slp_in_total;
    data.in_game_slp = earnings.slp_inventory;
    return data;
  }
  private parseStatusData(stats: statsData, roninAddress: string):scholarOfficialData{
    return {
      ronin_address: roninAddress,
      rank: stats.rank,
      mmr: stats.elo,
      total_matches: stats.win_total,
      ign: stats.name
    }
  }
}
