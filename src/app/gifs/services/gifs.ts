import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy';
import { Gif } from '../interfaces/gif';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

function loadFromLocalStorage(): Record<string,Gif[]>{
  // const rawHistory = localStorage.getItem('history') ?? '';
  // const raw = JSON.parse(localStorage.getItem('history')??'');
  // const history: Record<string,Gif[]> = raw;
  const history: Record<string,Gif[]> = JSON.parse(localStorage.getItem('history')??'{}');
  return history;
}

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private http = inject(HttpClient);
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);
  foundGifs = signal<Gif[]>([]);

  // searchHistory = signal<Record<string, Gif[]>>({});
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() =>
    Object.keys(this.searchHistory()));

  saveToLocalStorage = effect(()=>{
    localStorage.setItem('history', JSON.stringify(this.searchHistory()));
  })

  constructor() {
    this.loadTrendingGifs();
  }


  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: `${environment.gifsApiKey}`,
        limit: 20
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      console.log({ gifs });
    })
  }

  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: `${environment.gifsApiKey}`,
        limit: 20,
        q: query,
      }
    }).pipe(
      map(resp => GifMapper.mapGiphyItemsToArray(resp.data)),
      tap(items => {
        this.searchHistory.update(history => ({
          ...history, [query.toLowerCase()]: items
        }))
      })
    )
      ;
    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToArray(resp.data);
    //   this.foundGifs.set(gifs);
    //   // this.trendingGifsLoading.set(false);
    //   console.log({gifs});
    // })
  }

  getHistoryGifs( query: string): Gif[]{
    return this.searchHistory()[query] ?? [];
  }
}
