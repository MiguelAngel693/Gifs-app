import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { GifService } from '../../services/gifs';

interface MenuOptions{
  label: string,
  sublabel: string,
  route: string,
  icon: string
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.html',
})
export class SideMenuOptions {
  gifService = inject(GifService);



  menuOptions: MenuOptions[]=[
    {
      icon:'fa-solid fa-chart-line',
      label: 'Trending',
      sublabel:'Gifs populares',
      route:'/dashboard/trending'
    },
    {
      icon:'fa-solid fa-magnifying-glass',
      label: 'Buscador',
      sublabel:'Buscar gifs',
      route:'/dashboard/search'
    }
  ]
}
