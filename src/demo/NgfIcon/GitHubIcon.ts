import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Prop} from '../Prop';
import {StaticConf} from '../StaticConf';

@Component({
             changeDetection: ChangeDetectionStrategy.OnPush,
             selector:        'gh-icon',
             templateUrl:     './GitHubIcon.pug'
           })
export class GitHubIcon {

  @Prop(StaticConf.HOMEPAGE)
  public readonly homepage: string;
  @Prop(StaticConf.GITHUB_ICON_SIZE)
  public readonly iconSize: number;
}
