import { Entity } from "@ash.ts/ash";
import { HomeEngineT, PropertiesComponent, Property, PropertyAccessMode, PropertyDataType, createGadget, homeEngine, uuidT } from "@sinkapoy/home-core";
import { IServerWidgetsEvents } from "../systems/ServerWidgetSystem";
import { ICommonWidgetConfig } from "../interfaces/ICommonWidgetConfig";
import { buildWidgetBase } from "./basicBuilder";
interface IFolderConfig extends ICommonWidgetConfig {
    description?: string;
    children: ICommonWidgetConfig[];
}
const engine = homeEngine as HomeEngineT<IServerWidgetsEvents>;
engine.nextUpdate(() => {
    engine.emit('widgets:register-builder', 'folder', (config: IFolderConfig, widgets: Map<uuidT, Entity>) => {
        if (widgets.has(config.uuid)) return undefined;

        const entity = buildWidgetBase(config);
        const props = entity.get(PropertiesComponent)!;

        if (config.children) {
            props.createPropertyFromJson({
                id: 'children',
                accessMode: PropertyAccessMode.read,
                value: config.children.map(c => c.uuid) as object,
                dataType: PropertyDataType.object,
            });
            
            for (const child of config.children) {
                homeEngine.emit('widgets:from-config', {
                    ...child,
                    parent: config.uuid,
                });
            }
        }
        return entity;
    });
});
