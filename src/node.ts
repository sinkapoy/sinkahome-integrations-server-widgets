import { homeEngine } from "@sinkapoy/home-core";
import { ServerWidgetSystem } from "./systems/ServerWidgetSystem";
import "./builders/switchBuilder";
import "./builders/folderBuilder";
import "./builders/bindingBuilder";

homeEngine.addSystem(new ServerWidgetSystem(), 1);