import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

export interface ImgLinkSpec {
  alt: string;
  img: string;
  link: string;
}

@Component({
             changeDetection: ChangeDetectionStrategy.OnPush,
             selector:        'img-link',
             templateUrl:     './ImgLink.pug'
           })
export class ImgLink implements ImgLinkSpec {

  @Input('alt')
  public readonly alt: string;
  @Input('img')
  public readonly img: string;
  @Input('link')
  public readonly link: string;
}
