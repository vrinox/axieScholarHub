import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AxieMinAvatarComponent } from './axie-min-avatar.component';

describe('AxieMinAvatarComponent', () => {
  let component: AxieMinAvatarComponent;
  let fixture: ComponentFixture<AxieMinAvatarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AxieMinAvatarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AxieMinAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
