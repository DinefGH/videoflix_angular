import { Component, OnInit } from '@angular/core';
import { HeaderLogoutComponent } from "../header-logout/header-logout.component";
import { VideoPlayerComponent } from "../video-player/video-player.component";
import { BoardPlayerComponent } from "../board-player/board-player.component";
import { FooterComponent } from "../footer/footer.component";
import { VideoService } from 'src/app/services/video.service';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';


/**
 * The `BoardComponent` is responsible for displaying a board view with a list of videos.
 * It imports several child components like header, video player, board player, and footer.
 * The component also fetches videos from the `VideoService` and handles navigation to video details.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [HeaderLogoutComponent, VideoPlayerComponent, BoardPlayerComponent, FooterComponent,CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent implements OnInit {

    /** 
   * An array to hold the list of videos fetched from the `VideoService`.
   */
  videos: any[] = [];


  /**
   * Constructor for the `BoardComponent`.
   * @param videoService - A service used to fetch video data.
   * @param router - A router instance used for navigation within the app.
   */
  constructor(private videoService: VideoService, private router: Router) {}


  /**
   * Lifecycle hook that is called after the component has initialized.
   * It subscribes to the `getVideos` method of the `VideoService` to fetch the list of videos.
   */
  ngOnInit(): void {
    this.videoService.getVideos().subscribe((data) => {
      this.videos = data;
    });
  }


  /**
   * Method to navigate to the video details page.
   * @param id - The ID of the video whose details need to be viewed.
   */
  viewVideoDetails(id: number): void {
    this.router.navigate(['/video', id]);
  }
}