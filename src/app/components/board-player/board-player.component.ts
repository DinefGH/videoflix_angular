import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { CommonModule } from '@angular/common';
import { BitrateOptions } from '@videogular/ngx-videogular/core/lib/interfaces/bitrate-options.interface';

interface ExtendedBitrateOptions extends BitrateOptions {
  src: string;
}

/**
 * The `BoardPlayerComponent` is a custom video player component built with Videogular.
 * It allows users to switch between different video bitrates (e.g., 360p, 480p, 720p, 1080p).
 * The video player supports features like controls, buffering, and overlay play.
 */
@Component({
  selector: 'app-board-player',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule],
  templateUrl: './board-player.component.html',
  styleUrls: ['./board-player.component.scss']
})


export class BoardPlayerComponent implements AfterViewInit {


  /** 
  * Reference to the video element in the DOM. 
  */
  @ViewChild('media', { static: false }) mediaElementRef!: ElementRef<HTMLVideoElement>;


  /** 
   * Videogular API service used to control the player. 
   */
  vgApi!: VgApiService;


  /**
   * Default video source for playback.
   */
  videoSource: string = 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_360p.mp4'; 



  /**
   * Available bitrate options for the video player.
   */
  bitrates: BitrateOptions[] = [
    { label: '360p', qualityIndex: 0, width: 640, height: 360, bitrate: 500, mediaType: 'video/mp4' },
    { label: '480p', qualityIndex: 1, width: 854, height: 480, bitrate: 1000, mediaType: 'video/mp4' },
    { label: '720p', qualityIndex: 2, width: 1280, height: 720, bitrate: 2500, mediaType: 'video/mp4' },
    { label: '1080p', qualityIndex: 3, width: 1920, height: 1080, bitrate: 5000, mediaType: 'video/mp4' }
  ];


  /**
   * Mapping of quality indices to corresponding video sources.
   */
  videoSources = {
    0: 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_360p.mp4',
    1: 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_480p.mp4',
    2: 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_720p.mp4',
    3: 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_1080p.mp4'
  };


  /**
   * Initializes the component.
   */
  constructor() {}


  /**
   * Lifecycle hook that is called after the view is initialized.
   * It checks whether the media element is available.
   */
  ngAfterViewInit() {
    if (!this.mediaElementRef) {
      console.error('Media element is not available.');
    }
  }

 

  /**
   * Changes the video bitrate based on the user's selection.
   * Pauses the video, updates the source, and resumes playback at the same time position.
   * 
   * @param event - Event containing the selected bitrate's quality index.
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
   * Called when the Videogular player is ready, and sets up the API service.
   * 
   * @param api - The Videogular API service instance.
   */
  onPlayerReady(api: VgApiService) {
    this.vgApi = api;
  }
}