import { Entity } from "@ash.ts/ash";
import { HomeEngineT, PropertiesComponent, Property, PropertyAccessMode, createGadget, homeEngine, uuidT } from "@sinkapoy/home-core";
import { IServerWidgetsEvents } from "../node/ServerWidgetSystem";
import { ICommonWidgetConfig } from "../interfaces/ICommonWidgetConfig";
interface ISwitchConfig extends ICommonWidgetConfig{
    icon?: string;
}
const engine = homeEngine as HomeEngineT<IServerWidgetsEvents>;
engine.nextUpdate(() => {
    engine.emit('widgets:register-builder', 'switch', (config: ISwitchConfig, widgets: Map<uuidT, Entity>) => {
        if (widgets.has(config.uuid)) return undefined;

        const entity = createGadget(config.uuid, true);
        const props = entity.get(PropertiesComponent)!;
        props.set('key', new Property('key', PropertyAccessMode.rwn, false));
        props.set('led', new Property('led', PropertyAccessMode.rwn, false));
        props.set('widget', new Property('widget', PropertyAccessMode.read, true));
        props.set('type', new Property('type', PropertyAccessMode.read, 'switch'));
        props.set('width', new Property('width', PropertyAccessMode.rw, config.width ?? 2));
        props.set('height', new Property('height',PropertyAccessMode.rw, config.height ?? 2));
        if(config.icon){
            props.set('icon', new Property('icon', PropertyAccessMode.rw, config.icon));
        }
        return entity
    });
});
