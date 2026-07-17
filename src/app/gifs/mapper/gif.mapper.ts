import { Gif } from '../interfaces/gif';
import { GiphyItem } from '../interfaces/giphy';
export class GifMapper {

  static mapGiphyItemToGif(giphyItem: GiphyItem): Gif {
    return {
      id: giphyItem.id,
      title: giphyItem.title,
      url: giphyItem.images.original.url,
    };
  }

  static mapGiphyItemsToArray(giphyArray: GiphyItem[]): Gif[] {
    return giphyArray.map(this.mapGiphyItemToGif);
  }
}
