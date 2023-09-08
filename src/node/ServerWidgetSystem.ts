import { Entity } from "@ash.ts/ash";
import { FileT, IProperty, PropertiesComponent, PropertyAccessMode } from "@sinkapoy/home-core";
import { HomeSystem, IHomeCoreEvents, uuidT } from "@sinkapoy/home-core";
import { ICommonWidgetConfig } from "../interfaces/ICommonWidgetConfig";
import { WidgetComponent } from "../components/common";

type BuilderFuncT = (config: ICommonWidgetConfig, widgets: Map<uuidT, Entity>) => Entity | undefined;

export interface IServerWidgetsEvents extends IHomeCoreEvents {
    'widgets:register-builder': [string, BuilderFuncT];
}

export class ServerWidgetSystem extends HomeSystem<IServerWidgetsEvents>{
    static PATH = 'server-data/widgets.conf.json'

    protected widgets = new Map<uuidT, Entity>();

    protected builders = new Map<string, BuilderFuncT>();

    onInit() {
        this.engine.emit('appendFile', { path: ServerWidgetSystem.PATH, content: '' });
        this.setupEvent('widgets:register-builder', this.registerBuilder);
        this.setupEvent('fileContent', this.readConfig);
        this.setupEvent('writeGadgetProperty', this.onWriteProperty);
        setTimeout(() => this.engine.emit('readFile', ServerWidgetSystem.PATH), 20);
    }

    onDestroy(): void {

    }

    onUpdate(dt: number): void {

    }

    onWriteProperty = (entity: Entity, propId: string, value: string | number | boolean) => {
        if (!entity.has(WidgetComponent)) return;
        const properties = entity.get(PropertiesComponent);
        if (!properties) return;
        const prop = properties.get(propId);
        if (!prop) return;
        if (prop.accessMode & PropertyAccessMode.write) {
            prop.value = value;
            if (prop.accessMode & PropertyAccessMode.notify) {
                this.engine.emit('gadgetPropertyEvent', entity, prop);
            }
        }
    }

    private registerBuilder = (type: string, builder: BuilderFuncT) => {
        // console.log('register builder for type ' + type);
        this.builders.set(type, builder);
    }

    private readConfig = (file: FileT) => {
        if (file.path !== ServerWidgetSystem.PATH) return;
        const config = JSON.parse(file.content) as ICommonWidgetConfig[];
        const entities: Entity[] = [];
        config.forEach(widget => {
            const builder = this.builders.get(widget.type);
            if (builder) {
                const result = builder(widget, this.widgets);
                if (result) {
                    entities.push(result);
                }
            }
        });
        entities.forEach(entity => {
            entity.add(new WidgetComponent());
            if (!this.engine.getEntityByName(entity.name)) {
                this.engine.addEntity(entity);
            } else {
                // todo: add logs
            }
        });
        // console.log('added widgets to the engine', entities);
    }

}