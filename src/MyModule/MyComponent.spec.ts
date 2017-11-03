import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {MyComponent} from "./MyComponent";
import {MyModule} from "./MyModule";
import {By} from "@angular/platform-browser";

describe('MyComponent', () => {
  let componentFixture: ComponentFixture<MyComponent>;
  let componentInstance: MyComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MyModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    componentFixture = TestBed.createComponent(MyComponent);
    componentInstance = componentFixture.componentInstance;
  });

  afterEach(() => {
    componentFixture.destroy();
  });

  it('Should show "hai!"', () => {
    componentFixture.detectChanges();

    const el = componentFixture.debugElement.queryAll(By.css('span'));

    expect(el).toBeDefined();
    expect(el.length).toEqual(1);
    expect(el[0].nativeElement.innerText).toEqual('hai!');
  })
});