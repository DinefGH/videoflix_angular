import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService, Video } from 'src/app/services/category.service';
import { CommonModule } from '@angular/common';
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
import { FooterComponent } from "../footer/footer.component";
import { OnDestroy } from '@angular/core';
import { NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';



/**
 * VideoDetailComponent handles the display of detailed information and video playback
 * for a specific video, including support for multiple resolutions.
 */
@Component({
  selector: 'app-video-detail',
  standalone: true, 
  imports: [
    CommonModule, 
    RouterModule,
    HeaderLogoutComponent,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    FooterComponent
],
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
})
export class VideoDetailComponent implements OnInit, OnDestroy  {

    /** Reference to the HTML video element used for video playback */
  @ViewChild('media', { static: false }) mediaElementRef!: ElementRef<HTMLVideoElement>;

  /** API service for controlling video playback */
  vgApi!: VgApiService;
  

  /** The currently selected video source URL */
  videoSource: string = ''; 

  private routerEventsSubscription!: Subscription;
  

  /** Available bitrate options for the video, including resolution and bitrate */
  bitrates: BitrateOptions[] = [
    { label: '360p', qualityIndex: 0, width: 640, height: 360, bitrate: 500, mediaType: 'video/mp4' },
    { label: '480p', qualityIndex: 1, width: 854, height: 480, bitrate: 1000, mediaType: 'video/mp4' },
    { label: '720p', qualityIndex: 2, width: 1280, height: 720, bitrate: 2500, mediaType: 'video/mp4' },
    { label: '1080p', qualityIndex: 3, width: 1920, height: 1080, bitrate: 5000, mediaType: 'video/mp4' }
  ];


  /** Mapping of quality index to video source URLs */
  videoSources: { [key: number]: string | undefined } = {};

  /** The current video data */
  video!: Video;


  /**
   * Constructor to initialize the necessary services.
   * @param route - ActivatedRoute for retrieving route parameters
   * @param videoService - Service for fetching video details
   * @param router - Router service for navigation
   */
  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private router: Router
  ) {}


  /**
   * OnInit lifecycle hook to load video details when the component is initialized.
   */
  ngOnInit(): void {
    const videoId = Number(this.route.snapshot.paramMap.get('id'));
    this.videoService.getVideoById(videoId).subscribe(
      (data) => {
        this.video = data;

        this.videoSources = {};

        if (this.video.video_file_360p) {
          this.videoSources[0] = this.video.video_file_360p;
        }
        if (this.video.video_file_480p) {
          this.videoSources[1] = this.video.video_file_480p;
        }
        if (this.video.video_file_720p) {
          this.videoSources[2] = this.video.video_file_720p;
        }
        if (this.video.video_file_1080p) {
          this.videoSources[3] = this.video.video_file_1080p;
        }

        this.videoSource =
          this.video.video_file_1080p ||
          this.video.video_file_720p ||
          this.video.video_file_480p ||
          this.video.video_file_360p ||
          '';

        if (!this.videoSource) {
          console.error('No video sources are available.');
          this.router.navigate(['/video-list']);
        }
      },
      (error) => {
        console.error('Error fetching video details', error);
        this.router.navigate(['/video-list']);
      }
    );
    
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.saveCurrentTime();
      }
    });
  }
  



  /**
   * Handles bitrate change events, setting the video source to the selected resolution.
   * @param event - The bitrate change event with the selected quality index.
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
   * @param api - The VgApiService instance controlling the video player.
   */
  onPlayerReady(api: VgApiService) {
    this.vgApi = api;
    const videoId = this.video.id;
  const savedTime = localStorage.getItem(`video-${videoId}-currentTime`);

  if (savedTime) {
    const time = parseFloat(savedTime);
    // Seek to the saved time once the video metadata is loaded
    this.vgApi.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
      this.vgApi.seekTime(time, false);
    });
  }
  }


  /**
   * Navigates back to the video list.
   */
  goBack(): void {
    if (this.video && this.vgApi) {
      this.saveCurrentTime();
    }
    this.router.navigate(['video-list/']);
  }

  private saveCurrentTime(): void {
    if (this.vgApi && this.video) {
      const currentTime = this.vgApi.currentTime;
      const videoId = this.video.id;
  
      if (currentTime !== undefined && videoId !== undefined) {
        localStorage.setItem(`video-${videoId}-currentTime`, currentTime.toString());
      } else {
        console.warn('currentTime or videoId is undefined. Skipping save.');
      }
    } else {
      console.warn('vgApi or video is undefined. Skipping save.');
    }
  }


  ngOnDestroy(): void {
    this.saveCurrentTime();
  
    // Unsubscribe from router events to prevent memory leaks
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
