import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderTestComponent } from './shader-test.component';

describe('ShaderTestComponent', () => {
  let component: ShaderTestComponent;
  let fixture: ComponentFixture<ShaderTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShaderTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShaderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
