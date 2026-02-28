import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  setItem(key: string, value: any, expiryInMinutes: number): void {
      if (isPlatformBrowser(this.platformId)) {

        const now = new Date();
        const item = {
          value: value,
          expiry: now.getTime() + expiryInMinutes * 60 * 1000, // Convert minutes to milliseconds
        };
        localStorage.setItem(key, JSON.stringify(item));
      }
  }

  getItem(key: string): any | null{ 
    if (isPlatformBrowser(this.platformId)) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) {
          return null;
        }

        const item = JSON.parse(itemStr);
        const now = new Date();

        // Check if the item is expired
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return item.value;
    }
    return null;
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
}
