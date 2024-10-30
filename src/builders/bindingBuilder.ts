import { type Entity } from '@ash.ts/ash';
import { type HomeEngineT, PropertiesComponent, PropertyAccessMode, PropertyDataType, homeEngine, type uuidT } from '@sinkapoy/home-core';
import { type IServerWidgetsEvents } from '../systems/ServerWidgetSystem';
import { type ICommonWidgetConfig } from '../interfaces/ICommonWidgetConfig';
import { buildWidgetBase } from './basicBuilder';
interface IBindingConfig extends ICommonWidgetConfig {
    bindInfo?: {
        uuid: uuidT;
        property: string;
    };
    placeholder?: string;
}
const engine = homeEngine as HomeEngineT<IServerWidgetsEvents>;
engine.nextUpdate(() => {
    engine.emit('widgets:register-builder', 'binding', (config: IBindingConfig, widgets: Map<uuidT, Entity>) => {
        if (widgets.has(config.uuid)) return undefined;

        const entity = buildWidgetBase(config);
        const props = entity.get(PropertiesComponent)!;

        props.createPropertyFromJson({
            id: 'placeholder',
            accessMode: PropertyAccessMode.read,
            dataType: PropertyDataType.string,
            value: config.placeholder ?? '',
        });
        props.createPropertyFromJson({
            id: 'bindInfo',
            accessMode: PropertyAccessMode.rw,
            dataType: PropertyDataType.object,
            value: config.bindInfo ?? {},
        });
        return entity;
    });
});
