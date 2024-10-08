import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { VideoService } from 'src/app/services/video.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


/**
 * Test suite for BoardComponent
 */
describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let videoServiceMock: any;
  let routerMock: any;


  const mockVideos = [
    { id: 1, title: 'Video 1', description: 'Test Description 1', video_file: 'test1.mp4' },
    { id: 2, title: 'Video 2', description: 'Test Description 2', video_file: 'test2.mp4' }
  ];


    /**
   * Setup and configuration before running each test
   */
  beforeEach(async () => {
    videoServiceMock = jasmine.createSpyObj('VideoService', ['getVideos']);
    videoServiceMock.getVideos.and.returnValue(of(mockVideos));

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BoardComponent, 
        RouterTestingModule,
        HttpClientTestingModule 
      ],
      providers: [
        { provide: VideoService, useValue: videoServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  /**
   * Test case to verify that the component is created successfully.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Test case to ensure that videos are fetched correctly when the component initializes.
   */
  it('should fetch videos on init', () => {
    expect(videoServiceMock.getVideos).toHaveBeenCalled();
    expect(component.videos.length).toBe(2);
    expect(component.videos[0].title).toBe('Video 1');
  });


  /**
   * Test case to verify the navigation functionality when viewing video details.
   */
  it('should navigate to video details page', () => {
    component.viewVideoDetails(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/video', 1]);
  });
});
