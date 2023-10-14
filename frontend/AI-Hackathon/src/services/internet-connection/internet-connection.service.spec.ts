import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { InternetConnectionService } from './internet-connection.service';

describe('InternetConnectionService', () => {
  let service: InternetConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially return the correct online status', () => {
    const initialStatus = service.getConnectionStatus();
    const online = window.navigator.onLine;
    expect(initialStatus).toBe(online);
  });

  it('should update online status correctly when the "online" event is triggered', () => {
    const onlineEvent = new Event('online');
    window.dispatchEvent(onlineEvent);

    const onlineStatus = service.getConnectionStatus();
    expect(onlineStatus).toBe(true);
  });

  it('should update online status correctly when the "offline" event is triggered', () => {
    const offlineEvent = new Event('offline');
    window.dispatchEvent(offlineEvent);

    const offlineStatus = service.getConnectionStatus();
    expect(offlineStatus).toBe(false);
  });

  it('should observe changes in online status', fakeAsync(() => {
    const onlineStatuses: boolean[] = [];
    const expectedOnlineStatuses = [true, false]; // Expected status changes
  
    // Trigger online event and wait for changes to propagate
    window.dispatchEvent(new Event('online'));
    tick();

    const subscription = service.observeConnectionStatus().subscribe((isOnline) => {
      onlineStatuses.push(isOnline);
    });
  
    // Trigger offline event and wait for changes to propagate
    window.dispatchEvent(new Event('offline'));
    tick();
  
    // Check that the service correctly reports online/offline status changes.
    expect(onlineStatuses).toEqual(expectedOnlineStatuses);
  
    subscription.unsubscribe(); // Clean up subscription
  }));
});