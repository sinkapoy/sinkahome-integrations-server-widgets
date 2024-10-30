import { type Entity } from '@ash.ts/ash';
import { type HomeEngineT, PropertiesComponent, PropertyAccessMode, PropertyDataType, homeEngine, type uuidT } from '@sinkapoy/home-core';
import { type IServerWidgetsEvents } from '../systems/ServerWidgetSystem';
import { type ICommonWidgetConfig } from '../interfaces/ICommonWidgetConfig';
import { buildWidgetBase } from './basicBuilder';
interface ISwitchConfig extends ICommonWidgetConfig {
    icon?: string;
}
const engine = homeEngine as HomeEngineT<IServerWidgetsEvents>;
engine.nextUpdate(() => {
    engine.emit('widgets:register-builder', 'switch', (config: ISwitchConfig, widgets: Map<uuidT, Entity>) => {
        if (widgets.has(config.uuid)) return undefined;

        const entity = buildWidgetBase(config);
        const props = entity.get(PropertiesComponent)!;
        props.createPropertyFromJson({
            id: 'key',
            accessMode: PropertyAccessMode.rwn,
            dataType: PropertyDataType.boolean,
            value: false,
        });
        props.createPropertyFromJson({
            id: 'led',
            accessMode: PropertyAccessMode.rwn,
            dataType: PropertyDataType.boolean,
            value: false,
        });
        props.createPropertyFromJson({
            id: 'icon',
            accessMode: PropertyAccessMode.rwn,
            dataType: PropertyDataType.string,
            value: config.icon ?? '',
        });

        return entity;
    });
});
