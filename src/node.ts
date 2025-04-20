import { homeEngine } from '@sinkapoy/home-core';
import { type IServerWidgetsEvents, ServerWidgetSystem } from './systems/ServerWidgetSystem';
import './builders/switchBuilder';
import './builders/folderBuilder';
import './builders/bindingBuilder';
import { type ICommonWidgetConfig } from './interfaces/ICommonWidgetConfig';
export { buildWidgetBase } from './builders/basicBuilder';

homeEngine.addSystem(new ServerWidgetSystem(), 1);

export type {
    IServerWidgetsEvents,
    ICommonWidgetConfig,
};
