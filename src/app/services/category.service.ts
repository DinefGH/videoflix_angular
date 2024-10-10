import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


/**
 * Represents a video with its details.
 * Optional fields include different video quality file URLs, thumbnail, category, and creation date.
 */
export interface Video {
  id: number;
  title: string;
  description: string;
  video_file: string;
  video_file_360p?: string;
  video_file_480p?: string;
  video_file_720p?: string;
  video_file_1080p?: string;
  thumbnail?: string;
  category?: string;
  created_at?: string;
}


/**
 * Represents a group of videos categorized under a specific category.
 */
export interface CategoryGroup {
  category: string;
  videos: Video[];
}


/**
 * CategoryService is responsible for fetching video data from the API.
 * It includes methods for retrieving videos by category and for fetching individual videos by their ID.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://videoflix.server.fabianduerr.com/api';

  constructor(private http: HttpClient) {}


  /**
   * Fetches a list of video categories, with each category containing multiple videos.
   *
   * @returns An Observable of CategoryGroup[], where each group contains a category and its associated videos.
   */
  getVideosByCategory(): Observable<CategoryGroup[]> {
    return this.http.get<CategoryGroup[]>(`${this.apiUrl}/videos-by-category/`);
  }



  /**
   * Fetches the details of a specific video by its ID.
   *
   * @param id - The unique identifier of the video.
   * @returns An Observable of the Video object representing the video.
   * If an error occurs, it will be caught and handled by logging the error and re-throwing it as an observable error.
   */
  getVideoById(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/videos/${id}/`).pipe(
      catchError((error) => {
        console.error('Error fetching video', error);
        return throwError(error);
      })
    );
  }
}