import { join } from 'path';
import { sync } from 'glob';
import { Component, Manager, Plugin } from '@itsmybot';
import { Collection } from 'discord.js';

export default class ComponentService {
  manager: Manager;
  buttons: Collection<string, Component>;
  selectMenus: Collection<string, Component>;
  modals: Collection<string, Component>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.buttons = manager.components.buttons;
    this.selectMenus = manager.components.selectMenus;
    this.modals = manager.components.modals;
  }

  async initialize() {
    this.manager.logger.info("Component service initialized.");
  }

  getButton(name: string) {
    return this.buttons.get(name) || null;
  }

  getSelectMenu(name: string) {
    return this.selectMenus.get(name) || null;
  }

  getModal(name: string) {
    return this.modals.get(name) || null;
  }

  getButtons() {
    return this.buttons;
  }

  getSelectMenus() {
    return this.selectMenus;
  }

  getModals() {
    return this.modals;
  }

  async registerFromDir(componentDir: string, type: string, plugin: Plugin | undefined = undefined) {
    const componentFiles = sync(join(componentDir, '**', '*.js'));

    for (const filePath of componentFiles) {
      const componentPath = new URL('file://' + filePath.replace(/\\/g, '/')).href;
      const { default: Component } = await import(componentPath);

      switch (type) {
        case 'button':
          await this.registerButton(new Component(this.manager, plugin));
          break;
        case 'selectMenu':
          await this.registerSelectMenu(new Component(this.manager, plugin));
          break;
        case 'modal':
          await this.registerModal(new Component(this.manager, plugin));
          break;
      }
    };
  }

  async registerButton(Button: Component) {
    const logger = Button.plugin ? Button.plugin.logger : this.manager.logger;

    try {
      if (this.buttons.has(Button.name)) throw new Error("Button already exists.");

      this.buttons.set(Button.name, Button);
    } catch (e: any) {
      logger.error(`Error initializing button '${Button.name}'`, e.stack);
    }
  }

  async registerSelectMenu(SelectMenu: Component) {
    const logger = SelectMenu.plugin ? SelectMenu.plugin.logger : this.manager.logger;

    try {
      if (this.selectMenus.has(SelectMenu.name)) throw new Error("SelectMenu already exists.");

      this.selectMenus.set(SelectMenu.name, SelectMenu);
    } catch (e: any) {
      logger.error(`Error initializing selectMenu '${SelectMenu.name}'`, e.stack);
    }
  }

  async registerModal(Modal: Component) {
    const logger = Modal.plugin ? Modal.plugin.logger : this.manager.logger;

    try {
      if (this.modals.has(Modal.name)) throw new Error("Modal already exists.");

      this.modals.set(Modal.name, Modal);
    } catch (e: any) {
      logger.error(`Error initializing modal '${Modal.name}'`, e.stack);
    }
  }
}