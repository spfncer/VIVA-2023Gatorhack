import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ChatWindowComponent } from 'src/components/chat-window/chat-window.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent, ChatWindowComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'AI-Hackathon'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('AI-Hackathon');
  });

});
