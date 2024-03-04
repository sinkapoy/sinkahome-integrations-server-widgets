import { PropertiesComponent, PropertyAccessMode, PropertyDataType, createGadget } from "@sinkapoy/home-core";
import { ICommonWidgetConfig } from "../interfaces/ICommonWidgetConfig";

export function buildWidgetBase(config: ICommonWidgetConfig) {
    const entity = createGadget(config.uuid, true);
    const props = entity.get(PropertiesComponent)!;
    props.createPropertyFromJson({
        id: 'widget',
        accessMode: PropertyAccessMode.read,
        dataType: PropertyDataType.boolean,
        value: true,
    });
    props.createPropertyFromJson({
        id: 'type',
        accessMode: PropertyAccessMode.read,
        dataType: PropertyDataType.string,
        value: config.type,
    });
    props.createPropertyFromJson({
        id: 'x',
        accessMode: PropertyAccessMode.rwn,
        dataType: PropertyDataType.int,
        value: config.x || 0,
    });
    props.createPropertyFromJson({
        id: 'y',
        accessMode: PropertyAccessMode.rwn,
        dataType: PropertyDataType.int,
        value: config.y || 0,
    });
    props.createPropertyFromJson({
        id: 'name',
        accessMode: PropertyAccessMode.rwn,
        dataType: PropertyDataType.string,
        value: config.name,
    });
    props.createPropertyFromJson({
        id: 'width',
        accessMode: PropertyAccessMode.rwn,
        dataType: PropertyDataType.int,
        value: config.width || 0,
    });
    props.createPropertyFromJson({
        id: 'height',
        accessMode: PropertyAccessMode.rwn,
        dataType: PropertyDataType.int,
        value: config.height || 0,
    });
    props.createPropertyFromJson({
        id: 'description',
        accessMode: PropertyAccessMode.rwn,
        dataType: PropertyDataType.string,
        value: config.description ?? '',
    });
    if (config.parent)
        props.createPropertyFromJson({
            id: 'parent',
            accessMode: PropertyAccessMode.read,
            dataType: PropertyDataType.string,
            value: config.parent,
        });

    return entity;
}