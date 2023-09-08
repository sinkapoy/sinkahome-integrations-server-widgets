import { uuidT } from "@sinkapoy/home-core";

export type CommonWidgetTypeT = 'switch';
export interface ICommonWidgetConfig {
    type: CommonWidgetTypeT & string;
    uuid: uuidT;
    name: string;
    width: number;
    height: number;
    description?: string;
}