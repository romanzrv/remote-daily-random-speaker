import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerScreenComponent } from './speaker-screen.component';

describe('SpeakerScreenComponent', () => {
  let component: SpeakerScreenComponent;
  let fixture: ComponentFixture<SpeakerScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
