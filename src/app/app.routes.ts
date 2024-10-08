import { Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component'; 
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MainComponent } from './components/main/main.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LegalComponent } from './components/legal/legal.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { BoardComponent } from './components/board/board.component';
import { VideoDetailComponent} from './components/video-detail/video-detail.component';
import { VideoListComponent} from './components/video-list/video-list.component';
import { authGuard } from 'src/app/auth.guard';



export const appRoutes: Routes = [
    { path: 'legal-notice', component: LegalComponent },
    { path: 'privacy-policy', component: PrivacyComponent },
    { path: '', redirectTo: '', pathMatch: 'full'},
    { path: 'login', component: LogInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: '', component: MainComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
    { path: 'board', component: BoardComponent, canActivate: [authGuard]   },
    { path: 'video-list', component: VideoListComponent, canActivate: [authGuard]  },
    { path: 'video/:id', component: VideoDetailComponent, canActivate: [authGuard]  },
    { path: '**', redirectTo: '', pathMatch: 'full' },


];