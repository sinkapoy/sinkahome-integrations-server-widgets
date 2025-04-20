import { type Entity } from '@ash.ts/ash';
import { type FileT, PropertiesComponent, PropertyAccessMode, HomeSystem, type IHomeCoreEvents, type uuidT, serviceLocator } from '@sinkapoy/home-core';

import { type ICommonWidgetConfig } from '../interfaces/ICommonWidgetConfig';
import { WidgetComponent } from '../components/common';

type BuilderFuncT = (config: ICommonWidgetConfig | any, widgets: Map<uuidT, Entity>) => Entity | undefined;

export interface IServerWidgetsEvents extends IHomeCoreEvents {
    'widgets:register-builder': [string, BuilderFuncT];
    'widgets:from-config': [config: ICommonWidgetConfig];
}

export class ServerWidgetSystem extends HomeSystem<IServerWidgetsEvents> {
    static PATH = 'server-data/widgets.conf.json';

    protected widgets = new Map<uuidT, Entity>();

    protected builders = new Map<string, BuilderFuncT>();

    protected fileSize = 0;

    protected fileModifyTime = 0;

    protected updateFileMetaTimer = 2000;

    protected updateFileMetaCountdown = this.updateFileMetaTimer;

    async onInit() {
        this.setupEvent('widgets:register-builder', this.registerBuilder);
        this.setupEvent('widgets:from-config', this.onWidgetFromConfig.bind(this));
        const fs = serviceLocator().get('files');
        if (!await fs.exist(ServerWidgetSystem.PATH)) {
            await fs.write(ServerWidgetSystem.PATH, '[]');
        } else {
            this.readConfig(await fs.read(ServerWidgetSystem.PATH));
        }
        const meta = fs.fileMetadata(ServerWidgetSystem.PATH);
        this.fileSize = meta.size;
        this.fileModifyTime = meta.mTimeMs;
        this.setupEvent('writeGadgetProperty', this.onWriteProperty);
    }

    onDestroy(): void {
        // todo: remove widgets on detouch
    }

    onUpdate(dt: number): void {
        if(this.fileSize){
            this.updateFileMetaCountdown -= dt;
            if(this.updateFileMetaCountdown <= 0){
                this.updateFileMetaCountdown = this.updateFileMetaTimer;
                const fs = serviceLocator().get('files');
                const meta = fs.fileMetadata(ServerWidgetSystem.PATH);
                if(meta.size !== this.fileSize || meta.mTimeMs !== this.fileModifyTime){
                    this.fileSize = meta.size;
                    this.fileModifyTime = meta.mTimeMs;

                    fs.read(ServerWidgetSystem.PATH).then(this.readConfig);
                }
            }
        }
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
    };

    private readonly registerBuilder = (type: string, builder: BuilderFuncT) => {
        this.builders.set(type, builder);
    };

    private readonly readConfig = (file: string) => {
        try {
            const config = JSON.parse(file) as ICommonWidgetConfig[];
            config.forEach(widget => {
                this.onWidgetFromConfig(widget);
            });
        } catch (e) {
            console.error(e);
        }

    };

    private onWidgetFromConfig(config: ICommonWidgetConfig) {
        const builder = this.builders.get(config.type);
        if (builder) {
            const entity = builder(config, this.widgets);
            if (entity) {
                entity.add(new WidgetComponent());
                if (!this.engine.getEntityByName(entity.name)) {
                    this.engine.addEntity(entity);
                } else {
                    const original = this.engine.getByUUID(entity.name)!;
                    const originalProps = original.get(PropertiesComponent);
                    const newProps = entity.get(PropertiesComponent);
                    if(originalProps && newProps){
                        newProps.forEach(prop=>{
                            newProps.add(prop);
                            this.engine.emit('gadgetPropertyEvent', original, prop);
                        });
                        
                    }
                }
            } else {
                console.error('cant create a widget');
            }
        } else {
            console.error('no builder for ', config);
        }
    }
}
