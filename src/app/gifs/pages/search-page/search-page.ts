import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifsList } from "../../components/gifs-list/gifs-list";
import { GifService } from '../../services/gifs';
import { Gif } from '../../interfaces/gif';

@Component({
  selector: 'app-search-page',
  imports: [GifsList],
  templateUrl: './search-page.html',
})
export default class SearchPage {
  gifService = inject(GifService);
  gifs = signal<Gif[]>([]);
  query = signal('');
  scrollDiv = viewChild<ElementRef<HTMLDivElement>>('gifList');

  onSearch(query: string) {
    this.query.set(query);
    this.gifService.newSearch(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }

  onScroll() {
    const scrollDiv = this.scrollDiv()?.nativeElement;
    if(!scrollDiv)
      return;
    const scrollTop:number = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight: number = scrollDiv.scrollHeight;
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;


    if(isAtBottom && this.query){
      console.log(123);

      this.gifService.searchGifs(this.query()).subscribe((resp)=> {
        this.gifs.update((currentGifs)=>[...currentGifs, ...resp])
      });
    }
  }

}
