import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-legacy-page',
  standalone: true,
  template: `
    <iframe
      #legacyFrame
      class="legacy-frame"
      [src]="pageUrl"
      title="Al Fajjar Sports Complex page"
      (load)="syncFrameNavigation()">
    </iframe>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #11150f;
    }

    .legacy-frame {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      background: #fff;
    }
  `]
})
export class LegacyPageComponent implements OnInit, OnDestroy {
  @ViewChild('legacyFrame') private legacyFrame?: ElementRef<HTMLIFrameElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly zone = inject(NgZone);
  private subscription?: Subscription;
  private frameClickCleanup?: () => void;
  private readonly routeByPage: Record<string, string> = {
    'index.html': '/indoor-arena',
    'homev2.html': '/cricket-stadium',
    'about.html': '/about',
    'event.html': '/bookings',
    'event-details.html': '/booking-details',
    'community.html': '/teams',
    'profile.html': '/profile',
    'dashboard.html': '/dashboard',
    'contact.html': '/contact'
  };
  private readonly pageByRoute: Record<string, string> = Object.entries(this.routeByPage)
    .reduce((pages, [page, route]) => ({ ...pages, [route]: page }), {});

  pageUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/legacy/index.html');

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe((data) => {
      this.setPage(data['page'] as string || 'index.html');
    });
    this.subscription.add(this.route.queryParams.subscribe(() => {
      this.setPage(this.route.snapshot.data['page'] as string || 'index.html');
    }));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.frameClickCleanup?.();
  }

  syncFrameNavigation(): void {
    this.frameClickCleanup?.();
    const frame = this.legacyFrame?.nativeElement;
    const documentRef = frame?.contentDocument;
    if (!documentRef) return;

    this.rewriteFrameLinks(documentRef);

    const frameRoute = this.routeFromHref(frame.contentWindow?.location.href || '');
    if (frameRoute && frameRoute !== this.router.url) {
      this.zone.run(() => this.router.navigateByUrl(frameRoute));
      return;
    }

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;

      const route = this.routeFromHref(link.getAttribute('href') || '');
      if (!route) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      this.zone.run(() => this.router.navigateByUrl(route));
    };

    documentRef.addEventListener('click', clickHandler, true);
    this.frameClickCleanup = () => documentRef.removeEventListener('click', clickHandler, true);
  }

  private setPage(page: string): void {
    this.frameClickCleanup?.();
    const bookingId = this.route.snapshot.queryParamMap.get('id');
    const query = bookingId && page === 'event-details.html' ? `?id=${encodeURIComponent(bookingId)}` : '';
    const nextPageUrl = `/legacy/${page}${query}`;
    this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(nextPageUrl);
    const frame = this.legacyFrame?.nativeElement;
    if (frame) {
      frame.src = nextPageUrl;
    }
  }

  private rewriteFrameLinks(documentRef: Document): void {
    documentRef.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
      const route = this.routeFromHref(link.getAttribute('href') || '');
      if (route) {
        link.setAttribute('href', route);
      }
    });
  }

  private routeFromHref(href: string): string | null {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return null;
    }

    try {
      const url = new URL(href, 'http://local/');
      if (this.pageByRoute[url.pathname]) return url.pathname + url.search;
      const page = url.pathname.split('/').pop() || 'index.html';
      return this.routeByPage[page] ? this.routeByPage[page] + url.search : null;
    } catch {
      const page = href.split('?')[0].split('#')[0].split('/').pop() || 'index.html';
      return this.routeByPage[page] || null;
    }
  }
}
