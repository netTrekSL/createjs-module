// Type definitions for CreateJS
// Project: http://www.createjs.com/
// Definitions by: Pedro Ferreira <https://bitbucket.org/drk4>, Chris Smith <https://github.com/evilangelist>, Satoru Kimura <https://github.com/gyohk>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/*
    Copyright (c) 2012 Pedro Ferreira
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// Common class and methods for CreateJS.
// Library documentation : http://www.createjs.com/Docs/PreloadJS/modules/PreloadJS.html
// Library documentation : http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html


// rename the native MouseEvent, to avoid conflict with createjs's MouseEvent
interface NativeMouseEvent extends MouseEvent {

}
declare namespace createjs {
    export class Event {
        constructor(type: string, bubbles: boolean, cancelable: boolean);

        // properties
        bubbles: boolean;
        cancelable: boolean;
        currentTarget: any; // It is 'Object' type officially, but 'any' is easier to use.
        defaultPrevented: boolean;
        eventPhase: number;
        immediatePropagationStopped: boolean;
        propagationStopped: boolean;
        removed: boolean;
        target: any; // It is 'Object' type officially, but 'any' is easier to use.
        timeStamp: number;
        type: string;

        // other event payloads
        data: any;
        delta: number;
        error: string;
        id: string;
        item: any;
        loaded: number;
        name: string;
        next: string;
        params: any;
        paused: boolean;
        progress: number;
        rawResult: any;
        result: any;
        runTime: number;
        src: string;
        time: number;
        total: number;

        // methods
        clone(): Event;
        preventDefault(): void;
        remove(): void;
        set(props: Object): Event;
        stopImmediatePropagation(): void;
        stopPropagation(): void;
        toString(): string;
    }

    export class EventDispatcher {
        constructor();

        // methods
        addEventListener(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): Function;
        addEventListener(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): Function;
        addEventListener(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): Object;
        addEventListener(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): Object;
        dispatchEvent(eventObj: Object, target?: Object): boolean;
        dispatchEvent(eventObj: string, target?: Object): boolean;
        dispatchEvent(eventObj: Event, target?: Object): boolean;
        hasEventListener(type: string): boolean;
        static initialize(target: Object): void;
        off(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): void;
        off(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): void;
        off(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): void;
        off(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): void;
        off(type: string, listener: Function, useCapture?: boolean): void; // It is necessary for "arguments.callee"
        on(type: string, listener: (eventObj: Object) => boolean, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Function;
        on(type: string, listener: (eventObj: Object) => void, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Function;
        on(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Object;
        on(type: string, listener: { handleEvent: (eventObj: Object) => void; }, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Object;
        removeAllEventListeners(type?: string): void;
        removeEventListener(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): void;
        removeEventListener(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): void;
        removeEventListener(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): void;
        removeEventListener(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): void;
        removeEventListener(type: string, listener: Function, useCapture?: boolean): void; // It is necessary for "arguments.callee"
        toString(): string;
        willTrigger(type: string): boolean;
    }

    export function extend(subclass: () => any, superclass: () => any): () => any;     // returns the subclass prototype
    export function indexOf(array: any[], searchElement: Object): number;
    export function promote(subclass: () => any, prefix: string): () => any;

    export function proxy(method: (eventObj: Object) => boolean, scope: Object, ...arg: any[]): (eventObj: Object) => any;
    export function proxy(method: (eventObj: Object) => void, scope: Object, ...arg: any[]): (eventObj: Object) => any;
    export function proxy(method: { handleEvent: (eventObj: Object) => boolean; }, scope: Object, ...arg: any[]): (eventObj: Object) => any;
    export function proxy(method: { handleEvent: (eventObj: Object) => void; }, scope: Object, ...arg: any[]): (eventObj: Object) => any;


    ////////////////////////////////////preloadjs
    
    export class AbstractLoader extends EventDispatcher {
        // properties
        static BINARY: string;
        canceled: boolean;
        static CSS: string;
        static GET: string;
        static IMAGE: string;
        static JAVASCRIPT: string;
        static JSON: string;
        static JSONP: string;
        loaded: boolean;
        static MANIFEST: string;
        static POST: string;
        progress: number;
        resultFormatter: () => any;
        static SOUND: string;
        static SPRITESHEET: string;
        static SVG: string;
        static TEXT: string;
        type: string;
        static VIDEO: string;
        static XML: string;

        // methods
        cancel(): void;
        destroy(): void;
        getItem(value?: string): Object;
        getLoadedItems(): Object[];
        getResult(value?: any, rawResult?: boolean): Object;
        getTag(): Object;
        load(): void;
        setTag(tag: Object): void;
        toString(): string;
    }

    export class AbstractMediaLoader
        {
        constructor(loadItem: Object, preferXHR: boolean, type: string);
        }

    export class AbstractRequest
        {
        constructor(item: LoadItem);

        cancel(): void;
        destroy(): void;
        load(): void;
        }

    export class BinaryLoader extends AbstractLoader
        {
        constructor(loadItem: Object);

        // methods
        static canLoadItem(item: Object): boolean;
        }

    export class CSSLoader extends AbstractLoader
        {
        constructor(loadItem: Object, preferXHR: boolean);

        // methods
        canLoadItem(item: Object): boolean;
        }

    export module DataUtils
        {
        export function parseJSON(value: string): Object;
        export function parseXML(text: string, type: string): XMLDocument;
        }

    export class ErrorEvent
        {
        constructor(title?: string, message?: string, data?: Object);

        // properties
        data: Object;
        message: string;
        title: string;
        }

    export class ImageLoader extends AbstractLoader
        {
        constructor(loadItem: Object, preferXHR: boolean);

        static canLoadItem(item: Object): boolean;
        }

    export class JavaScriptLoader extends AbstractLoader
        {
        constructor(loadItem: Object, preferXHR: boolean);

        static canLoadItem(item: Object): boolean;
        }

    export class JSONLoader extends AbstractLoader
        {
        constructor(loadItem: Object);

        static canLoadItem(item: Object): boolean;
        }

    export class JSONPLoader extends AbstractLoader
        {
        constructor(loadItem: Object);

        static canLoadItem(item: Object): boolean;
        }

    export class LoadItem
        {
        // properties
        callback: string;
        crossOrigin: boolean;
        data: Object;
        headers: Object;
        id: string;
        loadTimeout: number;
        maintainOrder: boolean;
        method: string;
        mimeType: string;
        src: string;
        type: string;
        values: Object;
        withCredentials: boolean;

        // methods
        static create(value: LoadItem | string | Object): Object | LoadItem;
        set(props: Object): LoadItem;
        }

    export class LoadQueue extends AbstractLoader
        {
        constructor(preferXHR?: boolean, basePath?: string, crossOrigin?: string | boolean);

        // properties
        maintainScriptOrder: boolean;
        next: LoadQueue;
        stopOnError: boolean;

        // methods
        close(): void;
        getItems(loaded: boolean): Object[];
        installPlugin(plugin: any): void;
        loadFile(file: Object | string, loadNow?: boolean, basePath?: string): void;
        loadManifest(manifest: Object | string | any[], loadNow?: boolean, basePath?: string): void;
        registerLoader(loader: AbstractLoader): void;
        remove(idsOrUrls: string | any[]): void;
        removeAll(): void;
        reset(): void;
        setMaxConnections(value: number): void;
        setPaused(value: boolean): void;
        setPreferXHR(value: boolean): boolean;
        /**
         * @deprecated - use 'preferXHR' property instead (or setUseXHR())
         */
        setUseXHR(value: boolean): void;
        unregisterLoader(loader: AbstractLoader): void;
    }

    export class ManifestLoader extends AbstractLoader
        {
        constructor(loadItem: LoadItem | Object);

        // methods
        static canLoadItem(item: LoadItem | Object): boolean;
        }

    export class MediaTagRequest
        {
        constructor(loadItem: LoadItem, tag: HTMLAudioElement | HTMLVideoElement, srcAttribute: string);
        }

    export class PreloadJS
        {
        static buildDate: string;
        static version: string;
        }

    export class ProgressEvent
        {
        constructor(loaded: number, total?: number);

        // properties
        loaded: number;
        progress: number;
        total: number;

        // methods
        clone(): ProgressEvent;
        }

    export class RequestUtils
        {
        // properties
        static ABSOLUTE_PATH: RegExp;
        static EXTENSION_PATT: RegExp;
        static RELATIVE_PATH: RegExp;

        // methods
        static buildPath(src: string, data?: Object): string;
        static formatQueryString(data: Object, query?: Object[]): string;
        static getTypeByExtension(extension: string): string;
        static isAudioTag(item: Object): boolean;
        static isBinary(type: string): boolean;
        static isCrossDomain(item: Object): boolean;
        static isImageTag(item: Object): boolean;
        static isLocal(item: Object): boolean;
        static isText(type: string): boolean;
        static isVideoTag(item: Object): boolean;
        static parseURI(path: string): Object;
        }

    export class SoundLoader extends AbstractLoader
        {
        constructor(loadItem: Object, preferXHR: boolean);

        static canLoadItem(item: Object): boolean;
        }

    export class SpriteSheetLoader extends AbstractLoader
        {
        constructor(loadItem: Object);

        static canLoadItem(item: Object): boolean;
        }

    export class SVGLoader extends AbstractLoader
        {
        constructor(loadItem: Object, preferXHR: boolean);

        static canLoadItem(item: Object): boolean;
        }

    export class TagRequest
        {

        }

    export class TextLoader extends AbstractLoader
        {
        constructor(loadItem: Object);

        static canLoadItem(item: Object): boolean;
        }

    export class VideoLoader extends AbstractLoader
        {
        constructor(loadItem: Object, preferXHR: boolean);

        static canLoadItem(item: Object): boolean;
        }

    export class XHRRequest extends AbstractLoader
        {
        constructor(item: Object);

        // methods
        getAllResponseHeaders(): string;
        getResponseHeader(header: string): string;
        }

    export class XMLLoader extends AbstractLoader
        {
        constructor(loadItem: Object);

        static canLoadItem(item: Object): boolean;
        }

        ///////////////////////soundjs


    export class AbstractPlugin
        {
        // methods
        create(src: string, startTime: number, duration: number): AbstractSoundInstance;
        getVolume(): number;
        isPreloadComplete(src: string): boolean;
        isPreloadStarted(src: string): boolean;
        isSupported(): boolean;
        preload(loader: Object): void;
        register(loadItem: string, instances: number): Object;
        removeAllSounds(src: string): void;
        removeSound(src: string): void;
        setMute(value: boolean): boolean;
        setVolume(value: number): boolean;
        }

    export class AbstractSoundInstance extends EventDispatcher
        {
        constructor(src: string, startTime: number, duration: number, playbackResource: Object);

        // properties
        duration: number;
        loop: number;
        muted: boolean;
        pan: number;
        paused: boolean;
        playbackResource: Object;
        playState: string;
        position: number;
        src: string;
        uniqueId: number | string;
        volume: number;

        // methods
        destroy(): void;
        getDuration(): number;
        getLoop(): number;
        getMute(): boolean;
        getPan(): number;
        getPaused(): boolean;
        getPosition(): number;
        getVolume(): number;
        play(interrupt?: string | Object, delay?: number, offset?: number, loop?: number, volume?: number, pan?: number): AbstractSoundInstance;
        setDuration(value: number): AbstractSoundInstance;
        setLoop(value: number): void;
        setMute(value: boolean): AbstractSoundInstance;
        setPan(value: number): AbstractSoundInstance;
        setPlayback(value: Object): AbstractSoundInstance;
        setPosition(value: number): AbstractSoundInstance;
        setVolume(value: number): AbstractSoundInstance;
        stop(): AbstractSoundInstance;
        }

    export class FlashAudioLoader extends AbstractLoader
        {
        // properties
        flashId: string;

        // methods
        setFlash(flash: Object): void;
        }

    export class FlashAudioPlugin extends AbstractPlugin
        {
        // properties
        flashReady: boolean;
        showOutput: boolean;
        static swfPath: string;

        // methods
        static isSupported(): boolean;
        }

    export class FlashAudioSoundInstance extends AbstractSoundInstance
        {
        constructor(src: string, startTime: number, duration: number, playbackResource: Object);
        }

    /**
     * @deprecated - use FlashAudioPlugin
     */
    export class FlashPlugin {
        constructor();

        // properties
        static buildDate: string;
        flashReady: boolean;
        showOutput: boolean;
        static swfPath: string;
        static version: string;

        // methods
        create(src: string): AbstractSoundInstance;
        getVolume(): number;
        isPreloadStarted(src: string): boolean;
        static isSupported(): boolean;
        preload(src: string, instance: Object): void;
        register(src: string, instances: number): Object;
        removeAllSounds (): void;
        removeSound(src: string): void;
        setMute(value: boolean): boolean;
        setVolume(value: number): boolean;
    }

    export class HTMLAudioPlugin extends AbstractPlugin
        {
        constructor();

        // properties
        defaultNumChannels: number;
        enableIOS: boolean;     // deprecated
        static MAX_INSTANCES: number;

        // methods
        static isSupported(): boolean;
        }

    export class HTMLAudioSoundInstance extends AbstractSoundInstance
        {
        constructor(src: string, startTime: number, duration: number, playbackResource: Object);
        }

    export class HTMLAudioTagPool
        {

        }

    export class PlayPropsConfig
	{
	delay:number;
	duration:number;
	interrupt:string;
	loop:number;
	offset:number;
	pan:number;
	startTime:number;
	volume:number;
	static create( value:PlayPropsConfig|any ): PlayPropsConfig;
	set ( props:any ): PlayPropsConfig;
	}

    export class Sound extends EventDispatcher
        {
        // properties
        static activePlugin: Object;
        static alternateExtensions: any[];
        static defaultInterruptBehavior: string;
        static EXTENSION_MAP: Object;
        static INTERRUPT_ANY: string;
        static INTERRUPT_EARLY: string;
        static INTERRUPT_LATE: string;
        static INTERRUPT_NONE: string;
        static PLAY_FAILED: string;
        static PLAY_FINISHED: string;
        static PLAY_INITED: string;
        static PLAY_INTERRUPTED: string;
        static PLAY_SUCCEEDED: string;
        static SUPPORTED_EXTENSIONS: string[];
	static muted: boolean;
	static volume: number;
        static capabilities: any;

        // methods
        static createInstance(src: string): AbstractSoundInstance;
        static getCapabilities(): Object;
        static getCapability(key: string): number | boolean;
        static getMute(): boolean;
        static getVolume(): number;
        static initializeDefaultPlugins(): boolean;
        static isReady(): boolean;
        static loadComplete(src: string): boolean;
        static play(src: string, interrupt?: any, delay?: number, offset?: number, loop?: number, volume?: number, pan?: number): AbstractSoundInstance;
        static registerManifest(manifest: Object[], basePath: string): Object;
        static registerPlugins(plugins: any[]): boolean;
        static registerSound(src: string | Object, id?: string, data?: number | Object, basePath?: string): Object;
        static registerSounds(sounds: Object[], basePath?: string): Object[];
        static removeAllSounds(): void;
        static removeManifest(manifest: any[], basePath: string): Object;
        static removeSound(src: string | Object, basePath: string): boolean;
        static setMute(value: boolean): boolean;
        static setVolume(value: number): void;
        static stop(): void;

        // EventDispatcher mixins
        static addEventListener(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): Function;
        static addEventListener(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): Function;
        static addEventListener(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): Object;
        static addEventListener(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): Object;
        static dispatchEvent(eventObj: Object | string | Event, target?: Object): boolean;
        static hasEventListener(type: string): boolean;
        static off(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): void;
        static off(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): void;
        static off(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): void;
        static off(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): void;
        static off(type: string, listener: Function, useCapture?: boolean): void; // It is necessary for "arguments.callee"
        static on(type: string, listener: (eventObj: Object) => boolean, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Function;
        static on(type: string, listener: (eventObj: Object) => void, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Function;
        static on(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Object;
        static on(type: string, listener: { handleEvent: (eventObj: Object) => void; }, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Object;
        static removeAllEventListeners(type?: string): void;
        static removeEventListener(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): void;
        static removeEventListener(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): void;
        static removeEventListener(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): void;
        static removeEventListener(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): void;
        static removeEventListener(type: string, listener: Function, useCapture?: boolean): void; // It is necessary for "arguments.callee"
        static toString(): string;
        static willTrigger(type: string): boolean;
    }

    export class SoundJS {
        static buildDate: string;
        static version: string;
    }

    export class WebAudioLoader
        {
        static context: AudioContext;
        }

    export class WebAudioPlugin extends AbstractPlugin
        {
        constructor();

        // properties
        static context: AudioContext;
        context: AudioContext;
        dynamicsCompressorNode: DynamicsCompressorNode;
        gainNode: GainNode;

        // methods
        static isSupported(): boolean;
        static playEmptySound(): void;
        }

    export class WebAudioSoundInstance extends AbstractSoundInstance
        {
        constructor(src: string, startTime: number, duration: number, playbackResource: Object);

        // properties
        static context: AudioContext;
        static destinationNode: AudioNode;
        gainNode: GainNode;
        panNode: PannerNode;
        sourceNode: AudioNode;
        }
}
  
declare module 'createjs-module' {
  export = createjs;
}
