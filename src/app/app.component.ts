import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonMenuToggle,
  IonBadge,
  IonFooter
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  statsChartOutline,
  layersOutline,
  logInOutline,
  logOutOutline,
  helpCircleOutline,
  personCircleOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonMenuToggle,
    IonBadge,
    IonFooter
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({
      statsChartOutline,
      layersOutline,
      logInOutline,
      logOutOutline,
      helpCircleOutline,
      personCircleOutline,
      shieldCheckmarkOutline
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
