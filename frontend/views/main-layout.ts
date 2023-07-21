import '@vaadin/app-layout';
import '@vaadin/avatar';
import '@vaadin/icon';
import '@vaadin/menu-bar';
import type { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import '@vaadin/tabs';
import '@vaadin/tabs/vaadin-tab';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset';
import type User from 'Frontend/generated/zonelogistics/data/entity/User.js';
import { imageDataUrl } from 'Frontend/util.js';
import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { logout } from '../auth.js';
import { router } from '../index.js';
import { appStore } from '../stores/app-store.js';
import { Layout } from './view.js';

interface RouteInfo {
  path: string;
  title: string;
  icon: string;
}

@customElement('main-layout')
export class MainLayout extends Layout {
  render() {
    return html`
      <vaadin-app-layout>
        <header class="box-border flex flex-col w-full" slot="navbar">
          <div class="flex items-center px-l">
            <h1 class="my-m me-auto text-l">${appStore.applicationName}</h1>
            ${appStore.user
              ? html`
                  <vaadin-menu-bar
                    theme="tertiary-inline contrast"
                    .items="${this.getUserMenuItems(appStore.user)}"
                    @item-selected="${this.userMenuItemSelected}"
                  ></vaadin-menu-bar>
                `
              : html`<a router-ignore href="login">Sign in</a>`}
          </div>
          <nav class="flex overflow-auto px-m py-xs">
            <ul class="flex gap-s list-none m-0 p-0">
              ${this.getMenuRoutes().map(
                (viewRoute) => html`
                  <li>
                    <a
                      ?highlight=${viewRoute.path == appStore.location}
                      class="flex gap-xs
                  h-m items-center px-s text-body"
                      href=${router.urlForPath(viewRoute.path)}
                    >
                      ${viewRoute.icon
                        ? html`
                            <span
                              class="navicon"
                              style="--mask-image: url('line-awesome/svg/${viewRoute.icon}.svg')"
                              aria-hidden="true"
                            ></span>
                          `
                        : ''}
                      <span class="font-medium text-m whitespace-nowrap">${viewRoute.title}</span>
                    </a>
                  </li>
                `
              )}
            </ul>
          </nav>
        </header>
        <slot></slot>
      </vaadin-app-layout>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('block', 'h-full');
  }

  private getUserMenuItems(user: User): MenuBarItem[] {
    return [
      {
        component: this.createUserMenuItem(user),
        children: [{ text: 'Sign out' }],
      },
    ];
  }

  private createUserMenuItem(user: User) {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = 'var(--lumo-space-s)';
    render(
      html`
        <vaadin-avatar
          theme="xsmall"
          img="${until(imageDataUrl(user.profilePicture))}"
          name="${user.name}"
          tabindex="-1"
        ></vaadin-avatar>
        <span>${user.name}</span>
        <vaadin-icon icon="lumo:dropdown"></vaadin-icon>
      `,
      item
    );
    return item;
  }

  private userMenuItemSelected(e: MenuBarItemSelectedEvent) {
    if (e.detail.value.text === 'Sign out') {
      logout();
    }
  }

  private getMenuRoutes(): RouteInfo[] {
    return [
      {
        path: './home/index.html',
        title: 'Home Page',
        icon: 'home-solid',
      },

      {
        path: 'Sign-up',
        title: 'Sign Up',
        icon: 'user',
      },

      {
        path: 'crm-master-list',
        title: 'Customer Master List For Hilla',
        icon: 'columns-solid',
      },
    ];
  }
}
