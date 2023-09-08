import { homeEngine } from "@sinkapoy/home-core";
import { ServerWidgetSystem } from "./node/ServerWidgetSystem";
import "./builders/switchBuilder";

homeEngine.addSystem(new ServerWidgetSystem(), 1);