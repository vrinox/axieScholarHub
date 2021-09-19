import { AfterViewInit, Component} from '@angular/core';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements AfterViewInit {
  scholarHistory: any[] =[
    {value:50,label:'09'},
    {value:70,label:'10'},
    {value:235,label:'11'},
    {value:195,label:'12'},
    {value:195,label:'13'},
    {value:135,label:'14'},
    {value:167,label:'15'},
    {value:75,label:'16'},
    {value:135,label:'17'},
    {value:135,label:'18'},
    {value:135,label:'19'},
  ]
  constructor() { 
  }

  ngAfterViewInit() {
    
  }

}
