import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BoardPlayerComponent } from './board-player.component';
import { ElementRef } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';


/**
 * Test suite for BoardPlayerComponent
 */
describe('BoardPlayerComponent', () => {
  let component: BoardPlayerComponent;
  let fixture: ComponentFixture<BoardPlayerComponent>;
  let mockVideoElement: any;
  let onLoadedMetadataHandler: (() => void) | null = null;
  let vgApiMock: jasmine.SpyObj<VgApiService>;


  /**
   * Setup before each test.
   * Initializes the component, sets up mocks, and defines the video sources.
   */
  beforeEach(
    waitForAsync(() => {
      vgApiMock = jasmine.createSpyObj('VgApiService', ['play', 'pause', 'getDuration']);

      TestBed.configureTestingModule({
        imports: [BoardPlayerComponent],
        providers: [
          { provide: VgApiService, useValue: vgApiMock },
        ],
      })
        .overrideComponent(BoardPlayerComponent, {
          set: {
            template: `
              <video #media controls></video>
            `,
          },
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(BoardPlayerComponent);
          component = fixture.componentInstance;

          fixture.detectChanges();

          mockVideoElement = {
            currentTime: 0,
            paused: true,
            play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
            pause: jasmine.createSpy('pause'),
            load: jasmine.createSpy('load'),
            src: '',
            onloadedmetadata: null,
          };

          fixture.detectChanges();
          component.mediaElementRef = new ElementRef(mockVideoElement);

          Object.defineProperty(mockVideoElement, 'onloadedmetadata', {
            configurable: true,
            set(fn: () => void) {
              onLoadedMetadataHandler = fn;
            },
            get() {
              return onLoadedMetadataHandler;
            },
          });

          component.videoSources = {
            0: 'assets/img/videos/HDVideo_360p.mp4',
            1: 'assets/img/videos/HDVideo_480p.mp4',
            2: 'assets/img/videos/HDVideo_720p.mp4',
            3: 'assets/img/videos/HDVideo_1080p.mp4',
          };

          component.videoSource = component.videoSources[0];
        });
    })
  );


  /**
   * Test case to ensure that the video playback time is restored and playback resumes after a bitrate change.
   */
  it('should restore video playback time and resume if playing after bitrate change', () => {
    mockVideoElement.currentTime = 50;
    mockVideoElement.paused = false; 

    const bitrateChangeEvent = { qualityIndex: 2 }; 
    component.setBitrate(bitrateChangeEvent);

    if (onLoadedMetadataHandler) {
      onLoadedMetadataHandler();
    }

    expect(mockVideoElement.currentTime).toBe(50);

    expect(mockVideoElement.play).toHaveBeenCalled();
  });


  /**
   * Test case to ensure that vgApi is set correctly when onPlayerReady is called.
   */
  it('should set vgApi when onPlayerReady is called', () => {
    component.onPlayerReady(vgApiMock);

    expect(component.vgApi).toBe(vgApiMock);
  });


  /**
   * Test case to ensure no error is logged when mediaElementRef is available.
   */
  it('should not log error when mediaElementRef is available', () => {
    spyOn(console, 'error'); 

    component.mediaElementRef = new ElementRef(mockVideoElement);

    component.ngAfterViewInit();

    expect(console.error).not.toHaveBeenCalled(); 
  });


  /**
   * Test case to ensure an error is logged when mediaElementRef is not available.
   */
  it('should log error when mediaElementRef is not available', () => {
    spyOn(console, 'error'); 

    component.mediaElementRef = undefined as unknown as ElementRef<HTMLVideoElement>;

    component.ngAfterViewInit(); 

    expect(console.error).toHaveBeenCalledWith('Media element is not available.'); 
  });
});
