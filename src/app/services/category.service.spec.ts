import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService, CategoryGroup, Video } from './category.service'; 


/**
 * Test suite for the `CategoryService` class.
 * This suite tests the methods that retrieve videos by category and by video ID from an API.
 */
describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;


  /**
   * Initializes the testing environment and injects the necessary services.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [CategoryService],
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  /**
   * Verifies that there are no outstanding requests after each test.
   */
  afterEach(() => {
    httpMock.verify(); 
  });


  /**
   * Test for the `getVideosByCategory` method.
   * Ensures that the method successfully retrieves videos grouped by category from the API.
   */
  it('should retrieve videos by category', () => {
    const mockCategoryGroups: CategoryGroup[] = [
      {
        category: 'Action',
        videos: [
          {
            id: 1,
            title: 'Test Video',
            description: 'Test Description',
            video_file: 'test_video.mp4',
            thumbnail: 'test_thumbnail.jpg',
          },
        ],
      },
    ];

    service.getVideosByCategory().subscribe((categoryGroups) => {
      expect(categoryGroups.length).toBe(1);
      expect(categoryGroups[0].category).toBe('Action');
      expect(categoryGroups[0].videos[0].title).toBe('Test Video');
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/videos-by-category/');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategoryGroups); 
  });



  /**
   * Test for the `getVideoById` method.
   * Ensures that the method successfully retrieves a video by its ID from the API.
   */
  it('should retrieve a video by ID', () => {
    const mockVideo: Video = {
      id: 1,
      title: 'Test Video',
      description: 'Test Description',
      video_file: 'test_video.mp4',
      thumbnail: 'test_thumbnail.jpg',
    };

    service.getVideoById(1).subscribe((video) => {
      expect(video.id).toBe(1);
      expect(video.title).toBe('Test Video');
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/videos/1/');
    expect(req.request.method).toBe('GET');
    req.flush(mockVideo); 
  });



  /**
   * Test for error handling in the `getVideoById` method.
   * Ensures that the method correctly handles an error response (e.g., 404 Not Found) from the API.
   */
  it('should handle errors when retrieving a video by ID', () => {
    const errorMessage = '404 Not Found';

    service.getVideoById(1).subscribe(
      () => fail('Expected an error, not a video'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/videos/1/');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 404, statusText: errorMessage }); 
  });
});
