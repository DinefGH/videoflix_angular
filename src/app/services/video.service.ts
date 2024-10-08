import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * Interface representing the structure of a video object.
 * It includes details such as the video's ID, title, description, file URLs for different qualities, and other metadata.
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
 * Injectable service responsible for interacting with the video API backend.
 * It fetches video data from the server and exposes methods to retrieve all videos or a specific video by its ID.
 */
@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://127.0.0.1:8000/api/videos/'; 

  constructor(private http: HttpClient) {}


  /**
   * Fetches a list of all videos from the API.
   * 
   * @returns An observable that emits an array of `Video` objects representing the available videos.
   */
  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiUrl);
  }


  /**
   * Fetches the details of a specific video by its ID.
   * 
   * @param id - The ID of the video to retrieve.
   * @returns An observable that emits the `Video` object corresponding to the given ID.
   */
  getVideoById(id: number): Observable<Video> {
    const url = `${this.apiUrl}${id}/`; 
    return this.http.get<Video>(url);
  }
}
