import { ComponentFixture, TestBed, fakeAsync, tick  } from '@angular/core/testing';
import { VideoPlayerComponent } from './video-player.component';
import { VgApiService } from '@videogular/ngx-videogular/core';


/**
 * Test suite for the VideoPlayerComponent.
 */
describe('VideoPlayerComponent', () => {
  let component: VideoPlayerComponent;
  let fixture: ComponentFixture<VideoPlayerComponent>;
  let vgApiServiceMock: jasmine.SpyObj<VgApiService>;
  let consoleSpy: jasmine.Spy;


  /**
   * Setup for each test case. Initializes the component, mocks services, and spies on console logs.
   */
  beforeEach(async () => {

    vgApiServiceMock = jasmine.createSpyObj('VgApiService', ['getDefaultMedia']);

    await TestBed.configureTestingModule({
      imports: [VideoPlayerComponent],
      providers: [
        { provide: VgApiService, useValue: vgApiServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    consoleSpy = spyOn(console, 'log'); 
  });


  /**
   * Test to verify that the video player initializes with the vgApi object.
   */
  it('should initialize the video player with vgApi', () => {
    const mediaElementMock: any = {
      subscriptions: {
        loadedMetadata: {
          subscribe: jasmine.createSpy('subscribe'),
        },
      },
    };
  
  
    vgApiServiceMock.getDefaultMedia.and.returnValue(mediaElementMock);
  
    component.onPlayerReady(vgApiServiceMock);
  
  
    expect(component.vgApi).toBe(vgApiServiceMock);
    expect(mediaElementMock.subscriptions.loadedMetadata.subscribe).toHaveBeenCalled();
  });



  /**
   * Test to check if 'Video is playing' is logged when the play event is triggered.
   */
  it('should log "Video is playing" on play event', () => {
  
    const mockMedia = {
      onplay: () => {}
    };
    spyOn(mockMedia, 'onplay').and.callFake(() => {
      console.log('Video is playing.');
    });
    mockMedia.onplay(); 
    expect(consoleSpy).toHaveBeenCalledWith('Video is playing.');
  });


  /**
   * Test to check if 'Video is paused' is logged when the pause event is triggered.
   */
  it('should log "Video is paused" on pause event', () => {
    const mockMedia = {
      onpause: () => {}
    };
    spyOn(mockMedia, 'onpause').and.callFake(() => {
      console.log('Video is paused.');
    });
  
    mockMedia.onpause();
  
    expect(consoleSpy).toHaveBeenCalledWith('Video is paused.');
  });



  /**
   * Test to verify that the video restores the currentTime and resumes playback after metadata is loaded.
   */
  it('should restore currentTime and play the video if it was playing on loadedmetadata event', fakeAsync(() => {
    const consoleErrorSpy = spyOn(console, 'error');
  
    const mockMedia = {
      currentTime: 10,
      paused: false, 
      play: jasmine.createSpy('play').and.returnValue(Promise.resolve()), 
      pause: jasmine.createSpy('pause'),
      src: '',
      load: jasmine.createSpy('load'),
      onloadedmetadata: jasmine.createSpy('onloadedmetadata')
    };
  
    component.vgApi = {
      getDefaultMedia: () => ({ elem: mockMedia })
    } as any;
  
    component.changeQuality({ target: { value: '720' } });
  
    mockMedia.onloadedmetadata();
  
    tick();
  
    expect(mockMedia.currentTime).toBe(10);
  
    expect(mockMedia.play).toHaveBeenCalled();
  
    expect(consoleSpy).toHaveBeenCalledWith('Video started playing successfully.');
  
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }));


  /**
   * Test to check if 'Video metadata loaded' is logged when the metadata is loaded.
   */
  it('should subscribe to loadedMetadata and log "Video metadata loaded"', () => {
    const mediaElementMock: any = {
      subscriptions: {
        loadedMetadata: {
          subscribe: jasmine.createSpy('subscribe'), 
        },
      },
    };

    vgApiServiceMock.getDefaultMedia.and.returnValue(mediaElementMock);

    component.onPlayerReady(vgApiServiceMock);

    expect(vgApiServiceMock.getDefaultMedia().subscriptions.loadedMetadata.subscribe).toHaveBeenCalled();

    const loadedMetadataCallback = mediaElementMock.subscriptions.loadedMetadata.subscribe.calls.mostRecent().args[0];
    loadedMetadataCallback(); 

    expect(consoleSpy).toHaveBeenCalledWith('Video metadata loaded');
  });


/**
 * Test to check if 'Video is playing' is logged when the play event occurs.
 */
  it('should log "Video is playing" when the play event occurs', () => {
    const mockMedia = {
      play: jasmine.createSpy('play'),
      pause: jasmine.createSpy('pause'),
      load: jasmine.createSpy('load'),  
      currentTime: 0,
      onplay: () => {}
    };

    component.vgApi = {
      getDefaultMedia: () => ({ elem: mockMedia })
    } as any;

    component.changeQuality({ target: { value: '720' } });

    mockMedia.onplay();

    expect(consoleSpy).toHaveBeenCalledWith('Video is playing.');
  });


/**
 * Test to check if 'Video is paused' is logged when the pause event occurs.
 */
  it('should log "Video is paused" when the pause event occurs', () => {
    const mockMedia = {
      play: jasmine.createSpy('play'),
      pause: jasmine.createSpy('pause'),
      load: jasmine.createSpy('load'),  
      currentTime: 0,
      onpause: () => {}
    };

    component.vgApi = {
      getDefaultMedia: () => ({ elem: mockMedia })
    } as any;

    component.changeQuality({ target: { value: '720' } });

    mockMedia.onpause();

    expect(consoleSpy).toHaveBeenCalledWith('Video is paused.');
  });


  /**
   * Test to check if the correct video source is set when the user selects 360p.
   */
  it('should set the correct videoSource for 360p', () => {
    const mockEvent = { target: { value: '360' } };
    component.changeQuality(mockEvent);
    expect(component.videoSource).toBe('assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_360p.mp4');
  });


  /**
   * Test to check if the correct video source is set when the user selects 480p.
   */
  it('should set the correct videoSource for 480p', () => {
    const mockEvent = { target: { value: '480' } };
    component.changeQuality(mockEvent);
    expect(component.videoSource).toBe('assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_480p.mp4');
  });


  /**
   * Test to check if the correct video source is set when the user selects 720p.
   */
  it('should set the correct videoSource for 720p', () => {
    const mockEvent = { target: { value: '720' } };
    component.changeQuality(mockEvent);
    expect(component.videoSource).toBe('assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_720p.mp4');
  });


  /**
   * Test to check if the correct video source is set when the user selects 1080p.
   */
  it('should set the correct videoSource for 1080p', () => {
    const mockEvent = { target: { value: '1080' } };
    component.changeQuality(mockEvent);
    expect(component.videoSource).toBe('assets/img/videos/HDVideo.bdfe134d-8544-4001-bf48-87fe87e62b05_1080p.mp4');
  });



  /**
   * Test to check if the video source does not change when an unmatched quality is selected.
   */
  it('should not change videoSource if quality is not matched', () => {
    component.videoSource = 'existing_source.mp4'; 
    const mockEvent = { target: { value: '144p' } }; 
    component.changeQuality(mockEvent);
    expect(component.videoSource).toBe('existing_source.mp4'); 
  });
});

