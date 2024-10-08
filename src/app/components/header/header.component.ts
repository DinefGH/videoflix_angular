import {  Component, signal, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';



/**
 * The `HeaderComponent` serves as the header for the application.
 * It typically includes navigation buttons and a logo or brand name.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
