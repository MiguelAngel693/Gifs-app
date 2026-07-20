import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy';
import { Gif } from '../interfaces/gif';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

function loadFromLocalStorage(): Record<string, Gif[]> {
  // const rawHistory = localStorage.getItem('history') ?? '';
  // const raw = JSON.parse(localStorage.getItem('history')??'');
  // const history: Record<string,Gif[]> = raw;
  const history: Record<string, Gif[]> = JSON.parse(localStorage.getItem('history') ?? '{}');
  return history;
}

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private http = inject(HttpClient);
  private trendingPage = signal(0);
  private searchPage = signal(0);
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  foundGifs = signal<Gif[]>([]);

  // searchHistory = signal<Record<string, Gif[]>>({});
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() =>
    Object.keys(this.searchHistory()));

  saveToLocalStorage = effect(() => {
    localStorage.setItem('history', JSON.stringify(this.searchHistory()));
  })

  constructor() {
    this.loadTrendingGifs();
  }


  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return;
    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: `${environment.gifsApiKey}`,
        limit: 20,
        offset: this.trendingPage() * 20,
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToArray(resp.data);
      this.trendingGifs.update(currentGifs => [...currentGifs, ...gifs]);
      this.trendingGifsLoading.set(false);
      this.trendingPage.update(current => current + 1);
    })
  }

  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: `${environment.gifsApiKey}`,
        limit: 20,
        offset: this.searchPage() * 20,
        q: query,
      }
    }).pipe(
      tap(() => { this.searchPage.update(value => value + 1) }),
      map(resp => GifMapper.mapGiphyItemsToArray(resp.data)),
      tap(items => {
        this.searchHistory.update(history => ({ ...history, [query.toLowerCase()]: [...history[query.toLowerCase()] ?? [], ...items] }),
        )
      })
    );
  }

  newSearch(query: string): Observable<Gif[]> {
    this.searchPage.set(0);
    return this.searchGifs(query);
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
