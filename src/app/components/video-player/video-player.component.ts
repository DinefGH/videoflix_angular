import { Component, ViewChild, AfterViewInit, ElementRef    } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgApiService } from '@videogular/ngx-videogular/core';


/**
 * VideoPlayerComponent is responsible for playing a video, handling bitrate changes, and managing video playback state.
 * It leverages the Videogular library for enhanced video controls and overlays.
 */
@Component({
  selector: 'app-video-player',
  standalone: true,
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule]
})
export class VideoPlayerComponent {

  /** ViewChild to access the video element in the template */
  @ViewChild('media', { static: true }) media: any;

  /** The source URL of the video to be played */
  videoSource: string = 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_720p.mp4';


  /** Reference to the Videogular API service, used to control video playback */
  vgApi!: VgApiService;


  /**
   * Callback when the video player is ready.
   * @param api - The VgApiService controlling the video player
   */
  onPlayerReady(api: VgApiService) {
    this.vgApi = api;

    this.vgApi.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
    });
  }


  /**
   * Handles quality changes by switching video sources based on user input.
   * @param event - The event triggered when the quality dropdown is changed
   */
  changeQuality(event: any) {
    const selectedQuality = event.target.value;
  
    switch (selectedQuality) {
      case '360':
        this.videoSource = 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_360p.mp4';
        break;
      case '480':
        this.videoSource = 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_480p.mp4';
        break;
      case '720':
        this.videoSource = 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_720p.mp4';
        break;
      case '1080':
        this.videoSource = 'assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_1080p.mp4';
        break;
    }
  
    if (this.vgApi) {
      const media = this.vgApi.getDefaultMedia().elem;
  
      const currentTime = media.currentTime;
      const wasPlaying = !media.paused;
  
      media.pause();
  
      media.src = this.videoSource;
      media.load();
  
      media.onloadedmetadata = () => {
        media.currentTime = currentTime;
  
        if (wasPlaying) {
          media.play().then(() => {
          }).catch((error: any) => {
            console.error('Error trying to play the video:', error);
          });
        }
      };
  
      media.onplay = () => {
      };
      media.onpause = () => {
      };
    }
  }
}