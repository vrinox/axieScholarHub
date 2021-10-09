import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { fromEvent, of } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import {community } from 'src/app/models/interfaces';
import { ComunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-join-community',
  templateUrl: './join-community.page.html',
  styleUrls: ['./join-community.page.scss'],
})
export class JoinCommunityPage implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: HTMLIonSearchbarElement;
  isSearching: boolean;
  communitiesQuery: community[] = [];
  constructor(
    private communityService: ComunityService
  ) { }

  async ngOnInit() {
    fromEvent(await this.searchInput.getInputElement(), 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length > 2),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {

      this.isSearching = true;

      this.searchGetCall(text).subscribe(async (res) => {
        const list: community[] = await Promise.all(res.docs.map(async (doc)=>{
          const community = doc.data();
          community.id = doc.id;
          community.members = await this.communityService.getMembersAddressList(doc.id);
          return community;
        }))
        this.communitiesQuery = list;
        this.isSearching = false;
      }, (err) => {
        this.isSearching = false;
        console.log('error', err);
      });
    });
  }
  joinCommunity(community: community){
    //join existing community
  }
  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.communityService.getCommunitiesByName(term);
  }
  cleanList(){
    this.communitiesQuery = [];
  }
}
