import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="stats-widget-card"
      [class.clickable]="hasAction"
      (click)="onClick()"
      tabindex="0"
      (keydown.enter)="onClick()"
      [attr.role]="hasAction ? 'button' : 'region'"
      [attr.aria-label]="title + ': ' + value + '. ' + (trendText || '')"
    >
      <div class="widget-header">
        <span class="widget-title">{{ title }}</span>
        @if (badge) {
          <span class="widget-badge" [style.backgroundColor]="badgeBg">{{ badge }}</span>
        }
      </div>

      <div class="widget-body">
        <div class="widget-value">{{ value }}</div>
      </div>

      @if (trendText || subtitle) {
        <div class="widget-footer">
          @if (trendText) {
            <span class="trend-indicator" [style.color]="trendColor">
              {{ trendText }}
            </span>
          }
          @if (subtitle) {
            <span class="widget-sub">{{ subtitle }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      min-width: 220px;
    }

    .stats-widget-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.25rem 1.4rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .stats-widget-card.clickable {
      cursor: pointer;
    }

    .stats-widget-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #3880ff;
    }

    .stats-widget-card:focus-visible {
      outline: 2px solid #3880ff;
      outline-offset: 2px;
    }

    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .widget-title {
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
    }

    .widget-body {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 0.4rem;
    }

    .widget-value {
      font-size: 1.95rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
    }

    .widget-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      color: #ffffff;
    }

    .widget-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.82rem;
    }

    .trend-indicator {
      font-weight: 600;
    }

    .widget-sub {
      color: #94a3b8;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsWidgetComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() trendText: string = '';
  @Input() trendColor: string = '#16a34a';
  @Input() subtitle: string = '';
  @Input() badge: string = '';
  @Input() badgeBg: string = '#3880ff';
  @Input() hasAction: boolean = false;

  @Output() actionClicked = new EventEmitter<void>();

  onClick(): void {
    if (this.hasAction) {
      this.actionClicked.emit();
    }
  }
}
