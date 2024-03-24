import { Entity } from "@ash.ts/ash";
import { HomeEngineT, PropertiesComponent, Property, PropertyAccessMode, PropertyDataType, createGadget, homeEngine, uuidT } from "@sinkapoy/home-core";
import { IServerWidgetsEvents } from "../systems/ServerWidgetSystem";
import { ICommonWidgetConfig } from "../interfaces/ICommonWidgetConfig";
import { buildWidgetBase } from "./basicBuilder";
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
        if (config.bindInfo) {
            props.createPropertyFromJson({
                id: 'targetUuid',
                accessMode: PropertyAccessMode.read,
                dataType: PropertyDataType.string,
                value: config.bindInfo.uuid,
            });
            props.createPropertyFromJson({
                id: 'targetProperty',
                accessMode: PropertyAccessMode.read,
                dataType: PropertyDataType.string,
                value: config.bindInfo.property,
            });
        }
        return entity;
    });
});
