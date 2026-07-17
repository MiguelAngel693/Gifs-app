import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'gifs-list-item',
  imports: [],
  templateUrl: './gifs-list-item.html',
})
export class GifsListItem {
  imageUrl = input.required<string>();
  imageTitle = input.required<string>();
}
