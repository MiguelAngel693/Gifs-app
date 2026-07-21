import { AfterViewInit, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifsList } from "../../components/gifs-list/gifs-list";
import { GifService } from '../../services/gifs';
import { ScrollState } from '../../shared/services/scroll state';

@Component({
  selector: 'app-trending-page',
  imports: [GifsList],
  templateUrl: './trending-page.html',
})


export default class TrendingPage implements AfterViewInit {
  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDiv()?.nativeElement;
    if (!scrollDiv)
      return;

    scrollDiv.scrollTop = this.ScrollState.trendingScrollState();
  }

  gifService = inject(GifService);
  ScrollState = inject(ScrollState);

  gifs = this.gifService.trendingGifs();

  scrollDiv = viewChild<ElementRef<HTMLDivElement>>('gifList');


  onScroll() {
    const scrollDiv = this.scrollDiv()?.nativeElement;
    if (!scrollDiv)
      return;
    const scrollTop: number = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight: number = scrollDiv.scrollHeight;
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    this.ScrollState.trendingScrollState.set(scrollTop);
    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }

}
