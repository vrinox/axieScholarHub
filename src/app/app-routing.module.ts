import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmailComponent } from './pages/email/email.component';

const routes: Routes = [
  { path: '', redirectTo: 'start-page', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'email-login', component: EmailComponent },
  { path: 'signup', component: SignupComponent },  
  { path: 'profile', component: ProfileComponent },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)   
  },
  {
    path: 'start-page',
    loadChildren: () => import('./pages/start-page/start-page.module').then( m => m.StartPagePageModule)
  },
  {
    path: 'my-axies',
    loadChildren: () => import('./pages/my-axies/my-axies.module').then( m => m.MyAxiesPageModule)
  },
  {
    path: 'battles',
    loadChildren: () => import('./pages/battles/battles.module').then( m => m.BattlesPageModule)
  },
  {
    path: 'wrong-version',
    loadChildren: () => import('./pages/wrong-version/wrong-version.module').then( m => m.WrongVersionPageModule)
  },
  {
    path: 'rank',
    loadChildren: () => import('./pages/rank/rank.module').then( m => m.RankPageModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./pages/friends/friends.module').then( m => m.FriendsPageModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./pages/inbox/inbox.module').then( m => m.InboxPageModule)
  },
  {
    path: 'create-community',
    loadChildren: () => import('./pages/create-community/create-community.module').then( m => m.CreateCommunityPageModule)
  },
  {
    path: 'join-community',
    loadChildren: () => import('./pages/join-community/join-community.module').then( m => m.JoinCommunityPageModule)
  },
  {
    path: 'community-feed',
    loadChildren: () => import('./pages/community-feed/community-feed.module').then( m => m.CommunityFeedPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
