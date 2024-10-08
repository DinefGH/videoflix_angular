import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VideoService, Video } from './video.service';


/**
 * Unit test suite for the VideoService.
 * This suite tests the methods responsible for retrieving video data from the backend.
 */
describe('VideoService', () => {
  let service: VideoService;
  let httpMock: HttpTestingController;


  /**
   * Initializes the testing module and injects the necessary services before each test.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [
        VideoService
      ]
    });

    service = TestBed.inject(VideoService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  /**
   * Verifies that no unmatched or pending HTTP requests are left open after each test.
   */
  afterEach(() => {
    httpMock.verify();
  });


  /**
   * Test case to check if `getVideos()` successfully retrieves all videos.
   * It mocks an HTTP GET request and verifies the returned video data.
   */
  it('should retrieve all videos', () => {
    const mockVideos: Video[] = [
      {
        id: 1,
        title: 'Sample Video 1',
        description: 'Description 1',
        video_file: 'video1.mp4',
        video_file_360p: 'video1_360p.mp4',
        thumbnail: 'thumbnail1.jpg',
        category: 'Category 1',
        created_at: '2024-09-27T00:00:00Z'
      },
      {
        id: 2,
        title: 'Sample Video 2',
        description: 'Description 2',
        video_file: 'video2.mp4',
        video_file_360p: 'video2_360p.mp4',
        thumbnail: 'thumbnail2.jpg',
        category: 'Category 2',
        created_at: '2024-09-28T00:00:00Z'
      }
    ];

    service.getVideos().subscribe((videos) => {
      expect(videos.length).toBe(2); 
      expect(videos[0].title).toBe('Sample Video 1');  
      expect(videos[1].video_file).toBe('video2.mp4'); 
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/videos/');
    expect(req.request.method).toBe('GET');
    req.flush(mockVideos);  
  });



  /**
   * Test case to check if `getVideoById()` successfully retrieves a video by its ID.
   * It mocks an HTTP GET request and verifies the returned video data.
   */
  it('should retrieve a single video by ID', () => {
    const mockVideo: Video = {
      id: 1,
      title: 'Sample Video 1',
      description: 'Description 1',
      video_file: 'video1.mp4',
      video_file_360p: 'video1_360p.mp4',
      thumbnail: 'thumbnail1.jpg',
      category: 'Category 1',
      created_at: '2024-09-27T00:00:00Z'
    };

    service.getVideoById(1).subscribe((video) => {
      expect(video.id).toBe(1);  
      expect(video.title).toBe('Sample Video 1');  
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/videos/1/');
    expect(req.request.method).toBe('GET');
    req.flush(mockVideo);  
  });
});
