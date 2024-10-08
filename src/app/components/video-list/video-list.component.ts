import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService, CategoryGroup } from 'src/app/services/category.service';
import { ActivatedRoute } from '@angular/router';
import { Video } from 'src/app/services/category.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderLogoutComponent } from "../header-logout/header-logout.component";
import { ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { BitrateOptions } from '@videogular/ngx-videogular/core/lib/interfaces/bitrate-options.interface';
import { VideoService} from 'src/app/services/video.service';
import { LoginService } from 'src/app/services/login.service';
import { FooterComponent } from "../footer/footer.component"; 



/**
 * VideoListComponent displays a list of categorized videos, handles video playback,
 * and manages video bitrate switching. 
 */
@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    RouterModule,
    HeaderLogoutComponent,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule, FooterComponent],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent implements OnInit {

  /** Holds the list of video category groups */
  categoryGroups: CategoryGroup[] = [];

  /** Reference to the HTML video element for video playback */
  @ViewChild('media', { static: false }) mediaElementRef!: ElementRef<HTMLVideoElement>;

  /** API service for controlling the video playback */
  vgApi!: VgApiService;

  /** Current video source URL for playback */
  videoSource: string = ''; 

  /** Bitrate options available for video playback */
  bitrates: BitrateOptions[] = [
    { label: '360p', qualityIndex: 0, width: 640, height: 360, bitrate: 500, mediaType: 'video/mp4' },
    { label: '480p', qualityIndex: 1, width: 854, height: 480, bitrate: 1000, mediaType: 'video/mp4' },
    { label: '720p', qualityIndex: 2, width: 1280, height: 720, bitrate: 2500, mediaType: 'video/mp4' },
    { label: '1080p', qualityIndex: 3, width: 1920, height: 1080, bitrate: 5000, mediaType: 'video/mp4' }
  ];

  /** The main featured video to display */
  mainVideo!: Video | null;

  /** A mapping of video quality index to the respective video file URL */
  videoSources: { [key: number]: string | undefined } = {};


  /** The current video being displayed */
  video!: Video;


  /**
   * Initializes the necessary services and dependencies.
   * @param categoryService - Service to fetch categorized videos
   * @param router - Router for navigation
   * @param videoService - Service for fetching individual video details
   * @param route - ActivatedRoute for accessing route parameters
   * @param loginService - Service for handling user logout
   */
  constructor(private categoryService: CategoryService, 
    private router: Router,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private loginService: LoginService,
  ) {}

  /**
   * OnInit lifecycle hook to load categorized videos when the component is initialized.
   */
  ngOnInit(): void {
    this.categoryService.getVideosByCategory().subscribe(
      (data) => {
        this.categoryGroups = data;
  
        const mainCategoryGroup = data.find(group => group.category?.toLowerCase() === 'main');
  
        if (mainCategoryGroup && mainCategoryGroup.videos.length > 0) {
          const mainVideo = mainCategoryGroup.videos[0];
          this.mainVideo = mainVideo;
  
          if (this.mainVideo) {
  
            this.videoSources = {};
  
            if (this.mainVideo.video_file_360p) {
              this.videoSources[0] = this.mainVideo.video_file_360p;
            }
            if (this.mainVideo.video_file_480p) {
              this.videoSources[1] = this.mainVideo.video_file_480p;
            }
            if (this.mainVideo.video_file_720p) {
              this.videoSources[2] = this.mainVideo.video_file_720p;
            }
            if (this.mainVideo.video_file_1080p) {
              this.videoSources[3] = this.mainVideo.video_file_1080p;
            }
    
            this.videoSource =
              this.mainVideo.video_file_1080p ||
              this.mainVideo.video_file_720p ||
              this.mainVideo.video_file_480p ||
              this.mainVideo.video_file_360p ||
              '';
    
            if (!this.videoSource) {
              console.error('No video sources are available.');
            }
          } else {
            console.error('No main video found in the "Main" category.');
          }
        } else {
          console.error('No videos found in the "Main" category.');
        }
      },
      (error) => {
        console.error('Error fetching videos by category:', error);
      }
    );
  }


  ngAfterViewInit(): void {
    if (this.mediaElementRef) {
      const videoElement = this.mediaElementRef.nativeElement;
  
      videoElement.muted = true;
      videoElement.onloadedmetadata = () => {
        videoElement.play().catch((error: any) => {
          console.error('Error during autoplay:', error);
        });
      };
    }
  }



  /**
   * Navigates to the video detail page for a selected video.
   * @param videoId - The ID of the selected video
   */
  navigateToVideoDetail(videoId: number): void {
    this.router.navigate(['/video', videoId]);
  }



  /**
   * Handles bitrate changes, updating the video source to the selected resolution.
   * @param event - The bitrate change event containing the selected quality index
   */
  setBitrate(event: any) {
  
    if (!event || event.qualityIndex === undefined) {
      console.error('Invalid bitrate change event:', event);
      return;
    }
    
    const selectedSrc = this.videoSources[event.qualityIndex as keyof typeof this.videoSources];
    if (selectedSrc) {
      this.videoSource = selectedSrc;
    
      const videoElement = this.mediaElementRef.nativeElement;
      const currentTime = videoElement.currentTime; 
      const wasPlaying = !videoElement.paused; 
  
      videoElement.pause();
      videoElement.src = this.videoSource;
      videoElement.load();
  
      videoElement.onloadedmetadata = () => {
        videoElement.currentTime = currentTime;  
        if (wasPlaying) {
          videoElement.play().then(() => {
          }).catch((error: any) => {
            console.error('Error playing video:', error);
          });
        }
      };
    } else {
      console.error('Selected source not found for bitrate:', event.qualityIndex);
    }
  }


  /**
   * Called when the video player is ready to be controlled.
   * @param api - The VgApiService instance controlling the video player
   */
  onPlayerReady(api: VgApiService) {
    this.vgApi = api;
  }


  /**
   * Navigates back to the video list page.
   */
  goBack(): void {
    this.router.navigate(['video-list/']);
  }


  /**
   * Logs out the current user and navigates to the login page.
   */
  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}

