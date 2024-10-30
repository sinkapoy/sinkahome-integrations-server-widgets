import { type Entity } from '@ash.ts/ash';
import { type HomeEngineT, PropertiesComponent, PropertyAccessMode, PropertyDataType, homeEngine, type uuidT } from '@sinkapoy/home-core';
import { type IServerWidgetsEvents } from '../systems/ServerWidgetSystem';
import { type ICommonWidgetConfig } from '../interfaces/ICommonWidgetConfig';
import { buildWidgetBase } from './basicBuilder';
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
