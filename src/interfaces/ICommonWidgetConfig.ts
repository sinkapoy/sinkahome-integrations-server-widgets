import { uuidT } from "@sinkapoy/home-core";

export type CommonWidgetTypeT = 'switch';
export interface ICommonWidgetConfig {
    type: CommonWidgetTypeT & string;
    uuid: uuidT;
    x: number;
    y: number;
    name: string;
    width: number;
    height: number;
    description?: string;
    parent?: uuidT;
}