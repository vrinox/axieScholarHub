import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { communityPost } from '../models/interfaces';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from '../services/api-tracker.service';
import { ComunityService } from '../services/community.service';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  community: any = null;
  postForm: FormGroup = this.fb.group( {
    post: ['', 
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(120)
      ]
    ]
  });
  constructor(
    private sesion: SesionService,
    private communityService: ComunityService,
    private apiTracker: ApiTrackerService,
    private router: Router,    
    private fb: FormBuilder
  ) {
   
  }
  async ngOnInit() {
    this.community = (this.sesion.communities && this.sesion.communities.length !== 0)? this.sesion.communities[0]: null;
    if(this.community){
      this.community.feed= [];
      const communityComplement = await this.buildCommunity(this.community.id);
      this.community.members = communityComplement.members;
      this.community.rank = communityComplement.rank;
      this.community.feed = communityComplement.feed;
      this.communityService.activeCommunity = this.community;
    }

  }
  async buildCommunity(communityId:string){
    const community:any = {};
    const membersAddressList = await this.communityService.getMembersAddressList(communityId);
    community.members = await Promise.all(membersAddressList.map((roninAddress: string)=>{
      return this.apiTracker.getScholar('roninAddress', roninAddress);
    }));
    community.members.sort((a: Scholar,b: Scholar)=>{
      return b[this.community.rankType] - a[this.community.rankType]
    });    
    let rank: any = {};
    rank.firstPlace = await this.apiTracker.createItemList(community.members[0]);
    if(community.members[1]){
      rank.secondPlace = await this.apiTracker.createItemList(community.members[1]);
    }
    if(community.members[2]){
      rank.thirdPlace = await this.apiTracker.createItemList(community.members[2]);
    }
    community.rank = rank;
    community.feed = await this.communityService.getFeed(communityId);
    return community;
  }
  async sendPost(){
    const post: communityPost = {
      author: {
        axie: this.sesion.user.userAvatar.getValuesMin(),
        scholar: this.sesion.infinity.getValuesMin()
      },
      text: this.postForm.value.post,
      createdAt: new Date(),
      communityId: this.community.id
    }
    const id = await this.communityService.addCommunityPost(post);
    this.community.feed.unshift(post);
  }
  navigate(destiny:string){
    if(destiny === 'join'){
      this.router.navigate(['join-community']);
    } else if(destiny === 'create'){
      this.router.navigate(['create-community']);
    } else if(destiny === 'rank'){
      this.router.navigate(['rank'], { queryParams:{"community":this.community}});
    }
  }
}
