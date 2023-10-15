import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ChatWindowComponent } from 'src/components/chat-window/chat-window.component';
import { HttpClientModule } from '@angular/common/http';
import { CanvasWindowComponent } from 'src/components/canvas-window/canvas-window.component';
import { NavbarComponent } from 'src/components/navbar/navbar.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    declarations: [AppComponent, ChatWindowComponent, CanvasWindowComponent, NavbarComponent]
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
