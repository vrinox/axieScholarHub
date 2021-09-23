import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetPriceService {
  private API_RES_COINGECKO: String = 'https://api.coingecko.com/api/v3/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) { }

  getPrice(idCrypto: string): Promise<any> {
    return new Promise((resolve) => {
      const url = `${this.API_RES_COINGECKO}simple/price?ids=${idCrypto}&vs_currencies=usd`;
      this.http.get(url,this.httpOptions).subscribe(res => {
          resolve(res);
        });
    })
  }
  getImg(idCrypto: string){
    return new Promise((resolve) => {
      const url = `${this.API_RES_COINGECKO}coins/${idCrypto}`;
      this.http.get(url,this.httpOptions).subscribe((res:any) => {
          resolve(res.image.small);
        });
    })
  }

}
