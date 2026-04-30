import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-attendence',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './attendence.component.html',
  styleUrl: './attendence.component.scss'
})
export class AttendenceComponent implements OnInit {
  ngOnInit() {
    const user = history.state.user;
    console.log(user);
  }
}
