import { Injectable } from '@angular/core';

interface Toast {
  title: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info'): void {
    const toast: Toast = { title, message, type, show: true };
    this.toasts.push(toast);
    setTimeout(() => this.remove(toast), 3000); // Auto-hide after 3 seconds
  }

  remove(toast: Toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}