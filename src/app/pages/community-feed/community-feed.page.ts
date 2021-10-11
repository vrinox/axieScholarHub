import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { communityPost } from 'src/app/models/interfaces';
import { ComunityService } from 'src/app/services/community.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-community-feed',
  templateUrl: './community-feed.page.html',
  styleUrls: ['./community-feed.page.scss'],
})
export class CommunityFeedPage implements OnInit {
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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }
  
  async sendPost(){
    const post: communityPost = {
      author: {
        axie: this.sesion.user.userAvatar.getValuesMin(),
        scholar: this.sesion.infinity.getValuesMin()
      },
      text: this.postForm.value.post,
      creationDate: new Date(),
      communityId: this.communityService.activeCommunity.id
    }
    const id = await this.communityService.addCommunityPost(post);
    this.communityService.activeCommunity.feed.unshift(post);
  }
}
