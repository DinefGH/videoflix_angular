import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VideoListComponent } from './video-list.component';
import { CategoryService, CategoryGroup } from 'src/app/services/category.service';
import { VideoService, Video } from 'src/app/services/video.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; 



/**
 * Test suite for the VideoListComponent.
 */
describe('VideoListComponent', () => {
  let component: VideoListComponent;
  let fixture: ComponentFixture<VideoListComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let videoService: jasmine.SpyObj<VideoService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: Router;


  /**
   * Setup for each test case. Initializes the component, mocks services, and injects dependencies.
   */
  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getVideosByCategory']);
    const videoServiceSpy = jasmine.createSpyObj('VideoService', ['getVideoById']);
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule, 
        VideoListComponent        
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: VideoService, useValue: videoServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(VideoListComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    videoService = TestBed.inject(VideoService) as jasmine.SpyObj<VideoService>;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router);
  });


  /**
   * Test to check if the component is created successfully.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  /**
   * Test to ensure that videos are fetched on component initialization.
   */
  it('should fetch video data on init', fakeAsync(() => {
    const mockCategoryGroup: CategoryGroup[] = [
      {
        category: 'Main',
        videos: [
          {
            id: 1,
            title: 'Test Video',
            description: 'This is a test video',
            video_file: 'default.mp4',
            video_file_360p: '360p.mp4',
            video_file_480p: '480p.mp4',
            video_file_720p: '720p.mp4',
            video_file_1080p: '1080p.mp4',
            thumbnail: 'thumbnail.jpg',
            category: 'Main',
            created_at: '2024-09-28T12:34:56',
          },
        ],
      },
    ];
    

    categoryService.getVideosByCategory.and.returnValue(of(mockCategoryGroup));

    component.ngOnInit();
    tick();

    expect(categoryService.getVideosByCategory).toHaveBeenCalled();
    expect(component.mainVideo).toEqual(mockCategoryGroup[0].videos[0]);
    expect(component.videoSource).toBe('1080p.mp4');
  }));



  /**
   * Test to ensure navigation to the video detail page works correctly.
   */
  it('should navigate to the video detail page', () => {
    spyOn(router, 'navigate');
    component.navigateToVideoDetail(1);
    expect(router.navigate).toHaveBeenCalledWith(['/video', 1]);
  });


  /**
   * Test to check if the user can log out successfully and is navigated to the login page.
   */
  it('should log out the user and navigate to login', () => {
    spyOn(router, 'navigate');
    component.logout();
    expect(loginService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });



  /**
   * Test to check if video playback is restored after a bitrate change.
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
