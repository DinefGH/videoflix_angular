import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { VideoDetailComponent } from './video-detail.component';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/services/category.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';


/**
 * Test suite for the VideoDetailComponent.
 */
describe('VideoDetailComponent', () => {
  let component: VideoDetailComponent;
  let fixture: ComponentFixture<VideoDetailComponent>;
  let videoService: jasmine.SpyObj<VideoService>;
  let router: Router;



  /**
   * Set up the test environment and create mocks for the services.
   */
  beforeEach(async () => {
    const videoServiceSpy = jasmine.createSpyObj('VideoService', ['getVideoById']);

    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'id') return '1';
            return null;
          }
        }
      }
    };


    await TestBed.configureTestingModule({
      imports: [
        VideoDetailComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: 'not-found', redirectTo: '' }]),
      ],
      providers: [
        { provide: VideoService, useValue: videoServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoDetailComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService) as jasmine.SpyObj<VideoService>;
    router = TestBed.inject(Router);
  });


  /**
   * Test to ensure the component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });



  /**
   * Test to ensure video details are fetched correctly on initialization.
   */
  it('should fetch video details on init', fakeAsync(() => {
    const mockVideo: Video = {
      id: 1,
      title: 'Test Video',
      description: 'This is a test video',
      video_file: 'default.mp4',
      video_file_360p: '360p.mp4',
      video_file_480p: '480p.mp4',
      video_file_720p: '720p.mp4',
      video_file_1080p: '1080p.mp4',
      category: 'Test Category',
      created_at: '2024-09-28T12:34:56'
    };

    videoService.getVideoById.and.returnValue(of(mockVideo));

    component.ngOnInit();
    tick(); 

    expect(videoService.getVideoById).toHaveBeenCalledWith(1); 
    expect(component.video).toEqual(mockVideo);
    expect(component.videoSource).toBe('1080p.mp4'); 
  }));


  /**
   * Test to handle the scenario where video details fetching fails and the user is navigated to the "not-found" page.
   */
  it('should navigate to "not-found" if video details fetch fails', fakeAsync(() => {
    spyOn(router, 'navigate');

    videoService.getVideoById.and.returnValue(throwError('Video not found'));

    component.ngOnInit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
  }));


  /**
   * Test to handle when no video source is available, navigate to "no-video-available".
   */
  it('should navigate to "no-video-available" if no video source is available', fakeAsync(() => {
    spyOn(router, 'navigate');
  
    const mockVideo: Video = {
      id: 1,
      title: 'Test Video',
      description: 'Test video description',
      video_file: '',
      category: 'Test Category',
      created_at: '2024-09-28T12:34:56'
    };
  
    videoService.getVideoById.and.returnValue(of(mockVideo));
  
    component.ngOnInit();
    tick();
  
    expect(router.navigate).toHaveBeenCalledWith(['/no-video-available']);
  }));



  /**
   * Test to ensure the VgApiService is set correctly when onPlayerReady is called.
   */
  it('should set vgApi when onPlayerReady is called', () => {
    const mockApi = jasmine.createSpyObj('VgApiService', ['getDefaultMedia']);
    component.onPlayerReady(mockApi);
    expect(component.vgApi).toBe(mockApi);
  });



  /**
   * Test to ensure the user is navigated back to the video list when the goBack method is called.
   */
  it('should navigate back to video list when goBack is called', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(routerSpy).toHaveBeenCalledWith(['video-list/']);
  });


  /**
   * Test to ensure the currentTime is restored and video playback resumes after bitrate change.
   */
  it('should restore currentTime and play the video if it was playing on loadedmetadata event', (done) => {
    const mockEvent = { qualityIndex: 2 }; 
    const mockVideoElement = jasmine.createSpyObj('HTMLVideoElement', ['play', 'pause', 'load']);
    mockVideoElement.currentTime = 50; 
    mockVideoElement.paused = false; 
  
    component.mediaElementRef = { nativeElement: mockVideoElement };
  
    const consoleLogSpy = spyOn(console, 'log');
  
    component.videoSources = {
      0: 'video_360p.mp4',
      1: 'video_480p.mp4',
      2: 'video_720p.mp4', 
      3: 'video_1080p.mp4',
    };
  
    mockVideoElement.play.and.returnValue(Promise.resolve());
  
    component.setBitrate(mockEvent);
  
    expect(mockVideoElement.pause).toHaveBeenCalled();
    expect(mockVideoElement.src).toBe('video_720p.mp4');
    expect(mockVideoElement.load).toHaveBeenCalled();
  
    mockVideoElement.onloadedmetadata();
  
    expect(mockVideoElement.currentTime).toBe(50);
  
    mockVideoElement.play().then(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Video resumed successfully.');
      done();
    }).catch(() => {
      fail('Expected play() to resolve successfully.');
    });
  });
});

