(function(window, document, undefined) {

    // The absolute URL of the SGF file currently executing. Used
    // to get the <script> reference for parameter parsing, and to
    // get the relative path of library files.
    var scriptName = null
    
    // The <script> node reference of this script. It can have parameters
    // in order to override some default initialization options.
    ,   scriptNode = null
    
    // The absolute path to the folder where this script file lives.
    // Needed to determine the relative locations of library files.
    ,   engineRoot = null
    
    // The 'devicePixelRatio' is used on devices where the pixels are not
    // average size. SGF needs to factor this value in.
    ,   devicePixelRatio = window['devicePixelRatio'] || 1
    
    // 'hasCanvas' and 'hasCanvasText' need to be true in order for the canvas
    // renderer to kick in, otherwise SGF will fall back to a DOM based
    // renderer. To force the DOM renderer on modern browsers, pass a
    // "data-force-dom" param to the SGF script.
    ,   hasCanvas = !!document.createElement( "canvas" ).getContext
    ,   hasCanvasText =  !!(hasCanvas && typeof document.createElement("canvas" ).getContext('2d').fillText == 'function')
    
    // The parsed user options retrieved from the <script> node. These
    // can include. Defining any of these on the node is optional:
    //
    //     prototype - the path to the Prototype (>=v1.6.1) library. You
    //          could use the value:
    //              http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js
    //          for example to load Prototype from Google Ajax Lib servers.
    //          Default: "lib/prototype.js" relative to this script file.
    //
    //     swfobject - the path to SWFObject (>=v2.2) You could use:
    //              http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js
    //          for example to load Prototype from Google Ajax Lib servers.
    //          Default: "lib/swfobject.js" relative to this script file.
    //
    //     fabridge - the path to Adobe's FABridge.js file.
    //          Default: "lib/FABridge.js" relative to this script file.
    //
    // You can convieniently invoke 'SGF.startWithDiv' after SGF has loaded
    // with a 'screen' & 'game' combination:
    //
    //     game - the path to the SGF game to launch.
    //
    //     screen - the 'id' of the <div> to use as the screen. If omitted
    //          but a 'game' value is still supplied, then
    //          'SGF.startFullScreen' gets invoked instead.
    //
    ,   params = {
        'prototype':    'lib/prototype.js',
        'swfobject':    'lib/swfobject.js',
        'fabridge':     'lib/FABridge.js',
        'soundjs':      'lib/Sound.min.js',
        'soundjs-swf':  'lib/Sound.swf',
        'websocket':    'lib/web_socket.js',
        'websocket-swf':'lib/WebSocketMain.swf'
    },

    // The current Date, so that we can measure how long it took to load SGF
    // and the dependant libraries.
    loadStartTime = new Date(),

    // "Modules" are the classes retrieved from calling SGF.require().
    modules = {},
    
    // browser sniffs
    userAgent = navigator.userAgent,
    isOpera = Object.prototype.toString.call(window['opera']) == '[object Opera]',
    isIE = !!window['attachEvent'] && !isOpera,
    isIE7orLower =  isIE && parseFloat(navigator.userAgent.split("MSIE")[1]) <= 7,
    isWebKit = userAgent.indexOf('AppleWebKit/') > -1,
    isGecko = userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1,
    isMobileSafari = /Apple.*Mobile/.test(userAgent),
    
    // used in "arrayClone"
    slice = Array.prototype['slice'],
    
    // inherits an object's prototype onto another object
    inherits = null;
    if ("create" in Object) {
        inherits = function(ctor, superCtor) {
            ctor.prototype = Object['create'](superCtor.prototype, {
                "constructor": {
                    "value": ctor,
                    "enumerable": false
                }
            });
        }
    } else {
        var klass = function() {};
        inherits = function(ctor, superCtor) {
            klass.prototype = superCtor.prototype;
            ctor.prototype = new klass;
            ctor.prototype['constructor'] = ctor;
        }
    }
    




    /* The DOM nodes that SGF manipulates are always modified through
     * JavaScript, but just setting style.blah won't overwrite !important
     * in CSS style sheets. In order to compensate, all style changes must
     * be ensured that they use !important as well
     **/
    var setStyleImportant;
    if ((!isIE) && !!document['documentElement']['style']['setProperty']) {
        // W3C says use setProperty, with the "important" 3rd param
        setStyleImportant = function(element, prop, value) {
            element['style']['setProperty'](prop, value, "important");
        }                    
    } else {
        // IE <= 8 doesn't support setProperty, so we must manually set
        // the cssText, including the !important statement
        setStyleImportant = function(element, prop, value) {
            element['style']['cssText'] += ";"+prop+":"+value+" !important;";
        }
    }







    var setRotation;
    if(window['CSSMatrix']) setRotation = function(element, rotation){
        element.style['transform'] = 'rotate('+(rotation||0)+'rad)';
        return element;
    };
    else if(window['WebKitCSSMatrix']) setRotation = function(element, rotation){
        element.style['webkitTransform'] = 'rotate('+(rotation||0)+'rad)';
        return element;
    };
    else if(isGecko) setRotation = function(element, rotation){
        element.style['MozTransform'] = 'rotate('+(rotation||0)+'rad)';
        return element;
    };
    else if(isIE) setRotation = function(element, rotation){
        if(!element._oDims)
            element._oDims = [element.offsetWidth, element.offsetHeight];
        var c = Math.cos(rotation||0) * 1, s = Math.sin(rotation||0) * 1;
        
        try {
            var matrix = element['filters']("DXImageTransform.Microsoft.Matrix");
            //matrix.sizingMethod = "auto expand";
            matrix['M11'] = c;
            matrix['M21'] = -s;
            matrix['M12'] = s;
            matrix['M22'] = c;
        } catch (ex) {
            element.style['filter'] += " progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11="+c+",M12="+(-s)+",M21="+s+",M22="+c+")";
        }
        element.style.marginLeft = (element._oDims[0]-element.offsetWidth)/2+'px';
        element.style.marginTop = (element._oDims[1]-element.offsetHeight)/2+'px';
        return element;
    };
    else setRotation = function(element){ return element; }



    /**
 * == Components API ==
 * "Components" are the Object Oriented classes that are created by your game code,
 * added to your game loop and rendered on the screen.
 **/

/** section: Components API
 * class Component
 *
 * An abstract base class for game components. It cannot be instantiated
 * directly, but its subclasses are the building blocks for SGF games.
 **/
function Component(options) {
    extend(this, options || {});
    this['element'] = this['getElement']();
}

/*
 * Component#getElement() -> Element
 * Internal method. Game developers need not be aware.
 **/
Component.prototype['getElement'] = (function() {
    var e = document.createElement("div");
    setStyleImportant(e, "position", "absolute");
    setStyleImportant(e, "overflow", "hidden");
    return function() {
        return e.cloneNode(false);
    }
})();

Component.prototype['toElement'] = returnThisProp("element");

/**
 * Component#left() -> Number
 * 
 * Returns the number of pixels from left side of the screen to the left
 * side of the [[Component]].
 **/
Component.prototype['left'] = returnThisProp("x");

/**
 * Component#top() -> Number
 *
 * Returns the number of pixels from the top of the screen to the top
 * of the [[Component]].
 **/
Component.prototype['top'] = returnThisProp("y");

/**
 * Component#right() -> Number
 *
 * Returns the number of pixels from left side of the screen to the right
 * side of the [[Component]].
 **/
Component.prototype['right'] = function() {
    return this['x'] + this['width'] - 1;
}

/**
 * Component#bottom() -> Number
 * 
 * Returns the number of pixels from the top side of the screen to the
 * bottom of the [[Component]].
 **/
Component.prototype['bottom'] = function() {
    return this['y'] + this['height'] - 1;
}

/**
 * Component#render(renderCount) -> undefined
 * - renderCount (Number): The total number of times that [[Game#render]]
 *                         has been called for this game. This value has nothing
 *                         to do with the number of times this [[Component]]
 *                         has been rendered.
 * 
 * Renders the individual [[Component]]. This is called automatically in
 * the game loop once this component has been added through [[Game#addComponent]].
 *
 * Subclasses of [[Component]] override this method, and render how it
 * should be rendered. This default implementation does nothing, since
 * a [[Component]] itself cannot be rendered/instantiated.
 **/
Component.prototype['render'] = function(renderCount) {
    var self = this;
    
    if (self['__rotation'] != self['rotation']) {
        setRotation(self['element'], self['rotation']); // Radians
        self['__rotation'] = self['rotation'];
    }

    if (self['__opacity'] != self['opacity']) {
        Element['setOpacity'](self['element'], self['opacity']);
        self['__opacity'] = self['opacity'];
    }

    if (self['__zIndex'] != self['zIndex']) {
        self['__fixZIndex']();
        self['__zIndex'] = self['zIndex'];
    }

    if (self['__width'] != self['width']) {
        setStyleImportant(self['element'], "width", (self['width'] / devicePixelRatio) + "px");
        self['__width'] = self['width'];
    }
    
    if (self['__height'] != self['height']) {
        setStyleImportant(self['element'], "height", (self['height'] / devicePixelRatio) + "px");
        self['__height'] = self['height'];
    }

    if (self['__x'] != self['x']) {
        setStyleImportant(self['element'], "left", (self['x'] / devicePixelRatio) + "px");
        self['__x'] = self['x'];
    }

    if (self['__y'] != self['y']) {
        self['__y'] = self['y'];
        setStyleImportant(self['element'], "top", (self['y'] / devicePixelRatio) + "px");
    }
}

/**
 * Component#update(updateCount) -> undefined
 * - updateCount (Number): The total number of times that [[Game#update]]
 *                         has been called for this game. This value has nothing
 *                         to do with the number of times this [[Component]]
 *                         has been updated.
 *
 * Updates the state of the individual [[Component]]. This is called in
 * the game loop once this component has been added through
 * [[Game#addComponent]].
 *
 * This function should be thought of as the "logic" function for the [[Component]].
 **/
Component.prototype['update'] = function() {

}

Component.prototype['__fixZIndex'] = function() {
    var z = this.parent && this.parent.__computeChildZIndex ?
        this.parent.__computeChildZIndex(this.zIndex) :
        this.zIndex;
    setStyleImportant(this['element'], "z-index", z);
}

/**
 * Component#width -> Number
 *
 * The width of the [[Component]]. This is a readable and writable
 * property. That is, if you would like to reize the [[Component]],
 * you could try something like:
 *
 *     this.width = this.width * 2;
 *
 * To double the current width of the [[Component]].
 **/
Component.prototype['width'] = 10;

/**
 * Component#height -> Number
 *
 * The height of the [[Component]]. This is a readable and writable
 * property. That is, if you would like to reize the [[Component]],
 * you could try something like:
 *
 *     this.height = Screen.height;
 *
 * To set the height of this [[Component]] to the current height of the
 * game screen.
 **/
Component.prototype['height'] = 10;

/**
 * Component#x -> Number
 *
 * The X coordinate of the top-left point of the [[Component]] from the
 * top-left of the game screen.
 *
 *     var component = SGF.require("component");
 *     var instance = new component();
 *     instance.update = function() {
 *         this.x++;
 *     }
 *
 * This is an example of overwritting the [[Component#update]] method,
 * and incrementing the `x` coordinate every step through the game loop.
 * This will smoothly pan the [[Component]] across the game screen at
 * the game's [[Game#gameSpeed]].
 **/
Component.prototype['x'] = 0;

/**
 * Component#y -> Number
 *
 * The Y coordinate of the top-left point of the [[Component]] from the
 * top-left of the game screen.
 **/
Component.prototype['y'] = 0;

/**
 * Component#opacity -> Number
 *
 * A percentage value (between 0.0 and 1.0, inclusive) that describes the
 * [[Component]]'s opacity. Setting this value to 1.0 (default) will
 * make the [[Component]] fully opaque. Setting to 0.0 will make it
 * fully transparent, or invisible. Setting to 0.5 will make it 50%
 * transparent. You get the idea...
 **/
Component.prototype['opacity'] = 1.0;

/**
 * Component#rotation -> Number
 *
 * The rotation value of the [[Component]] in radians. Note that the
 * [[Component#x]], [[Component#y]] properties, and values returned
 * from [[Component#left]], [[Component#right]], [[Component#top]],
 * and [[Component#bottom]] are not affected by this value. Therefore,
 * any calculations that require the rotation to be a factor, your game code
 * must calculate itself.
 **/
Component.prototype['rotation'] = 0;

/**
 * Component#zIndex -> Number
 *
 * The Z index of this [[Component]]. Setting this value higher than
 * other [[Component]]s will render this [[Component]] above ones
 * with a lower **zIndex**.
 **/
Component.prototype['zIndex'] = 0;

/**
 * Component#parent -> Container
 *  
 * A reference to the current parent component of this component, or `null`
 * if the component is not currently placed inside any containing component.
 **/
Component.prototype['parent'] = null;
Component.prototype['element'] = null;

Component.prototype['toString'] = functionReturnString("[object Component]");

makePrototypeClassCompatible(Component);

modules['component'] = Component;

/** section: Components API
 * class Container < Component
 *
 * A `Container` is a concrete [[Component]] subclass, that acts
 * similar to the main [[Screen]] itself. That is, you can add
 * `Component`s into a container just like you would in your game.
 * Components placed inside containers are rendered with their attributes
 * relative to the Container's attributes. `Container` supports
 * all the regular [[Component]] properties (i.e. `width`, `height`, `x`,
 * `y`, `opacity`, `rotation`, and `zIndex`). Changing the properties
 * on a Container affect the global properties of the Components placed inside.
 **/

/**
 * new Container(components[, options])
 * - components (Array): An array of [[Component]]s that should initally
 *                       be placed into the container. This is a required
 *                       argument, however it can be an empty array. Also
 *                       note that you can add or remove `Component`s
 *                       at any time via [[Container#addComponent]] and
 *                       [[Container#removeComponent]].
 * - options (Object): The optional 'options' object's properties are copied
 *                     this [[Container]] in the constructor. It allows all
 *                     the same default properties as [[Component]].
 *
 * Creates a new [[Container]] instance, adding the [[Component]]s found
 * in `components` initially.
 **/
function Container(components, options) {
    var self = this;
    self['components'] = [];
    Component.call(self, options || {});
    if (Object['isArray'](components)) {
        components['each'](self['addComponent'], self);
    }
    this['__shouldUpdateComponents'] = this['__needsRender'] = true;
}

inherits(Container, Component);
makePrototypeClassCompatible(Container);

Container.prototype['update'] = function(updateCount) {
    if (this['__shouldUpdateComponents']) {
        for (var components = arrayClone(this['components']),
                i=0,
                component=null,
                length = components['length']; i < length; i++) {

            component = components[i];
            if (component['update']) {
                component['update'](updateCount);
            }
        }
    }
}

Container.prototype['render'] = function(renderCount) {
    Component.prototype['render'].call(this, renderCount);
    if (this['__needsRender']) {
        this['__renderComponents'](renderCount);
    }
}

Container.prototype['__renderComponents'] = function(renderCount) {
    for (var components = arrayClone(this['components']),
            i=0,
            component = null,
            length = components['length']; i < length; i++) {

        component = components[i];
        if (component['render']) {
            component['render'](renderCount);
        }
    }
}

/**
 * Container#addComponent(component) -> Container
 * - component (Component): The [[Component]] instance to add to this
 *                              container.
 *
 * Adds a [[Component]] into the container. `component`'s attributes
 * will be rendered to the screen in relation to the attributes of this
 * `Container`.
 **/
Container.prototype['addComponent'] = function(component) {
    if (component.parent !== this) {
        if (component.parent) {
            component.parent['removeComponent'](component);
        }
        this['components'].push(component);
        this['element'].appendChild(component['element']);
        component.parent = this;
        component['__fixZIndex']();
    }
    return this;
}

/**
 * Container#removeComponent(component) -> Container
 * - component (Component): The [[Component]] instance to remove from this
 *                          container.
 *
 * Removes a [[Component]] from the container that has previously been
 * added via [[Container#addComponent]].
 **/
Container.prototype['removeComponent'] = function(component) {
    var index = this['components'].indexOf(component);
    if (index > -1) {
        arrayRemove(this['components'], index);
        this['element'].removeChild(component['element']);
        component.parent = null;
    }
    return this;
}

Container.prototype['__computeChildZIndex'] = function(zIndex) {
    return (parseInt(this.element.style.zIndex) || 0) + (parseInt(zIndex) || 0);
}

Container.prototype['__fixZIndex'] = function() {
    Component.prototype['__fixZIndex'].call(this);
    for (var i=0, l=this['components'].length; i < l; i++) {
        this['components'][i]['__fixZIndex']();
    }
}

Container.prototype['toString'] = functionReturnString("[object Container]");

modules['container'] = Container;

/** section: Components API
 * class DumbContainer < Container
 *
 * There are plenty of cases where a large amount of [[Component]]s are going
 * to be placed inside of a [[Container]], BUT NEVER CHANGE. This scenario
 * can be brought up by creating a tile based map using [[Sprite]]. Map's don't
 * change beyond their initialization (usually), so it's a waste of CPU to
 * re-render and check for updates of each individual tile, because we know that
 * they will never need to change. That very scenario is why [[DumbContainer]]
 * exists. Using a `DumbContainer`, all the tile sprites that were added to the
 * container will only be rendered once, and then re-blitted to the screen for
 * maximum speed.
 *
 * So in short, use [[DumbContainer]] when the components inside will never
 * need to be changed, and save a lot of processing power.
 **/
function DumbContainer(components, options) {
    var self = this;
    Container.call(self, components, options);
    self['__shouldUpdateComponents'] = self['__needsRender'] = false;
}

inherits(DumbContainer, Container);
makePrototypeClassCompatible(DumbContainer);

DumbContainer.prototype['addComponent'] = function(component) {
    Container.prototype['addComponent'].call(this, component);
    this['__needsRender'] = true;
    return this;
}

DumbContainer.prototype['removeComponent'] = function(component) {
    Container.prototype['removeComponent'].call(this, component);
    this['__needsRender'] = true;
    return this;
}

DumbContainer.prototype['render'] = function(renderCount) {
    if (this['width'] != this['__width'] || this['height'] != this['__height'])
        this['__needsRender'] = true;
    Container.prototype['render'].call(this, renderCount);
}

DumbContainer.prototype['__renderComponents'] = function(renderCount) {
    Container.prototype['__renderComponents'].call(this, renderCount);
    this['__needsRender'] = false;
}

DumbContainer.prototype['renderComponents'] = function() {
    this['__needsRender'] = true;
}


DumbContainer.prototype['toString'] = functionReturnString("[object DumbContainer]");

modules['dumbcontainer'] = DumbContainer;


function Label(options) {
    var self = this;
    
    Component.call(self, options);
    
    self['_t'] = "";
    self['_n'] = document.createTextNode(self['_t']);
    self['element'].appendChild(self['_n']);
}

inherits(Label, Component);
makePrototypeClassCompatible(Label);

Label.prototype['getElement'] = (function() {
    var e = document.createElement("pre"), props = {
        "border":"none 0px #000000",
        "background-color":"transparent",
        "position":"absolute",
        "overflow":"hidden",
        "margin":"0px",
        "padding":"0px"
    };
    for (var key in props) {
        setStyleImportant(e, key, props[key]);
    }
    return function() {
        var el = e.cloneNode(false);
        setStyleImportant(el, "color", "#" + this['color']);
        this['_c'] = this['color'];
        setStyleImportant(el, "font-family", this['font']['__fontName']);
        this['_f'] = this['font'];
        setStyleImportant(el, "font-size", (this['size'] / devicePixelRatio) + "px");
        setStyleImportant(el, "line-height", (this['size'] / devicePixelRatio) + "px");
        this['_s'] = this['size'];
        return el;
    }
})();

Label.prototype['render'] = function(renderCount) {
    var self = this;

    Component.prototype['render'].call(self, renderCount);

    if (self['__align'] !== self['align']) {
        setStyleImportant(self['element'], "text-align", self['align'] == 0 ? "left" : self['align'] == 1 ? "center" : "right");
        self['__align'] = self['align'];
    }

    if (self['__font'] !== self['font']) {
        setStyleImportant(self['element'], "font-family", self['font']['__fontName']);
        self['__font'] = self['font'];
    }

    if (self['__size'] !== self['size']) {
        var val = (self['size'] / devicePixelRatio) + "px";
        setStyleImportant(self['element'], "font-size", val);
        setStyleImportant(self['element'], "line-height", val);            
        self['__size'] = self['size'];
    }

    if (self['_c'] !== self['color']) {
        setStyleImportant(self['element'], "color", "#" + self['color']);
        self['_c'] = self['color'];
    }

    if (self['_U']) {
        var text = "", l = self['_t'].length, i=0, pos=0, cur, numSpaces, j;
        for (; i<l; i++) {
            cur = self['_t'].charAt(i);
            if (cur === '\n') {
                pos = 0;
                text += cur;
            } else if (cur === '\t') {
                numSpaces = Label['TAB_WIDTH'] - (pos % Label['TAB_WIDTH']);
                for (j=0; j<numSpaces; j++) {
                    text += ' ';
                }
                pos += numSpaces;
            } else {
                text += cur;
                pos++;
            }
        }
        if (isIE7orLower) {
            text = text.replace(/\n/g, '\r');
        }
        self['_n']['nodeValue'] = text;
        self['_U'] = false;
    }
}
Label.prototype['getText'] = function() {
    return this['_t'];
}
Label.prototype['setText'] = function(textContent) {
    this['_t'] = textContent;
    this['_U'] = true;
}

Label.prototype['align'] = 0;
Label.prototype['color'] ="FFFFFF";
Label.prototype['font'] = new Font("monospace");
Label.prototype['size'] = 12;
Label.prototype['toString'] = functionReturnString("[object Label]");

extend(Label, {
    'LEFT': 0,
    'CENTER': 1,
    'RIGHT': 2,
    
    'TAB_WIDTH': 4
});

modules['label'] = Label;

/** section: Components API
 * class Sprite < Component
 *
 * Probably the most used Class in SGF to develop your games. Represents a single
 * sprite state on a spriteset as a [[Component]]. The state of the sprite
 * can be changed at any time.
 **/


/**
 * new Sprite(spriteset[, options])
 * - spriteset (Spriteset): The spriteset for this Sprite to use. This is
 *                              final once instantiated, and cannot be changed.
 * - options (Object): The optional 'options' object's properties are copied
 *                     this [[Sprite]] in the constructor. It allows all
 *                     the same default properties as [[Component]], but
 *                     also adds [[Sprite#spriteX]] and [[Sprite#spriteY]].
 *
 * Instantiates a new [[Sprite]] based on the given [[Spriteset]].
 * It's more common, however, to make your own subclass of [[Sprite]] in
 * your game code. For example:
 *
 *     var AlienClass = Class.create(Sprite, {
 *         initialize: function($super, options) {
 *             $super(AlienClass.sharedSpriteset, options);
 *         },
 *         update: function($super) {
 *             // Some cool game logic here...
 *             $super();
 *         }
 *     });
 *
 *     AlienClass.sharedSpriteset = new Spriteset("alien.png", 25, 25);
 *
 * Here we are creating a [[Sprite]] subclass called **AlienClass** that
 * reuses the same [[Spriteset]] object for all instances, and centralizes
 * logic code by overriding the [[Component#update]] method.
 **/
function Sprite(spriteset, options) {
    this['spriteset'] = spriteset;
    this['spritesetImg'] = spriteset['image'].cloneNode(false);
    Component.call(this, options);
}

inherits(Sprite, Component);
makePrototypeClassCompatible(Sprite);

Sprite.prototype['getElement'] = function() {
    var element = Component.prototype['getElement'].call(this);
    element.appendChild(this['spritesetImg']);
    return element;
};

Sprite.prototype['render'] = function(renderCount) {
    var self = this;
    if (self['__spriteX'] != self['spriteX'] || self['__spriteY'] != self['spriteY'] ||
        self['__width'] != self['width'] || self['__height'] != self['height']) {
        if (self['spriteset']['loaded']) {
            self['resetSpriteset']();
        } else if (!self['__resetOnLoad']) {
            self['spriteset']['addListener']("load", function() {
                self['resetSpriteset']();
            });
            self['__resetOnLoad'] = true;
        }
    }
    Component.prototype['render'].call(self, renderCount);
};

Sprite.prototype['resetSpriteset'] = function() {
    var self = this, image = self['spritesetImg'];
    setStyleImportant(image, "width", (self['spriteset']['width'] * (self['width']/self['spriteset']['spriteWidth']) / devicePixelRatio) + "px");
    setStyleImportant(image, "height", (self['spriteset']['height'] * (self['height']/self['spriteset']['spriteHeight']) / devicePixelRatio) + "px");
    setStyleImportant(image, "top", -(self['height'] * self['spriteY'] / devicePixelRatio) + "px");
    setStyleImportant(image, "left", -(self['width'] * self['spriteX'] / devicePixelRatio) + "px");
    self['__spriteX'] = self['spriteX'];
    self['__spriteY'] = self['spriteY'];
}

/**
 * Sprite#spriteX -> Number
 *
 * The X coordinate of the sprite to use from the spriteset. The units are
 * whole [[Sprite]] widths. So to use the 3rd sprite across on the spriteset,
 * set this value to 3.
 **/
Sprite.prototype['spriteX'] = 0;

/**
 * Sprite#spriteY -> Number
 *
 * The Y coordinate of the sprite to use from the spriteset. The units are
 * whole [[Sprite]] heights. So to use the 4th sprite down on the spriteset,
 * set this value to 4.
 **/
Sprite.prototype['spriteY'] = 0;

Sprite.prototype['toString'] = functionReturnString("[object Sprite]");

modules['sprite'] = Sprite;

/** section: Components API
 * class Shape < Component
 *
 * Another abstract class, not meant to be instantiated directly. All "shape"
 * type [[Component]] classes use this class as a base class. The only
 * functionality that this class itself adds to a regular [[Component]] is
 * [[Shape#color]], since all shapes can have a color set for them.
 **/

/**
 * new Shape([options])
 * - options (Object): The optional 'options' object's properties are copied
 *                     this [[Shape]] in the constructor. It allows all
 *                     the same default properties as [[Component]], but
 *                     also adds [[Shape#color]].
 *
 * This will never be called directly in your code, use one of the subclasses
 * to instantiate [[Shape]]s.
 **/
function Shape(options) {
    Component.call(this, options);
}

inherits(Shape, Component);
makePrototypeClassCompatible(Shape);

Shape.prototype['render'] = function(renderCount) {

    if (this['__color'] !== this['color']) {
        setStyleImportant(this['element'], 'background-color', "#" + this['color']);
        this['__color'] = this['color'];
    }

    Component.prototype['render'].call(this, renderCount);
}

/**
 * Shape#color -> String
 *
 * The color of the [[Shape]]. The String value is expected to be like
 * a CSS color string. So it should be a **six** (not three) character
 * String formatted in `RRGGBB` form. Each color is a 2-digit hex number
 * between 0 and 255.
 **/
Shape.prototype['color'] = "000000";

Shape.prototype['toString'] = functionReturnString("[object Shape]");

modules['shape'] = Shape;

/** section: Components API
 * class Rectangle < Shape
 *
 * A [[Component]] that renders a single rectangle onto the screen
 * as a solid color.
 **/
function Rectangle(options) {
    Shape.call(this, options);
}

inherits(Rectangle, Shape);
makePrototypeClassCompatible(Rectangle);

Rectangle.prototype['getElement'] = function() {
    this['__color'] = this['color'];
    var element = new Element("div");
    setStyleImportant(element, 'position', "absolute");
    setStyleImportant(element, 'background-color', "#" + this['color']);
    return element;
}

Rectangle.prototype['toString'] = functionReturnString("[object Rectangle]");

modules['rectangle'] = Rectangle;


//components/Circle.js remove for now

    /**
 * == Core API ==
 * The lowest level functions and classes. The `Core API` contains objects
 * automatically generated when the engine and game are loaded.
 **/

/** section: Core API
 * class EventEmitter
 *
 * A base class that implements the
 * [observer pattern](http://en.wikipedia.org/wiki/Observer_pattern) commonly
 * used throughout the `Resources API` classes, [[Game]] and [[Input]], to
 * name just a few.
 *
 * If you are writing a custom class that fires "events",
 * `EventEmitter` may be subclassed by calling the constructor
 * function inside your class' constructor function, and
 * inheriting `EventEmitter`'s _prototype_ via [[SGF.inherits]]:
 *
 *     var EventEmitter = SGF.require("EventEmitter");
 *     
 *     function MySubclass() {
 *         // Sets up instance properties
 *         EventEmitter.call(this);
 *     }
 *     // Make MySubclass.prototype inherit from EventEmitter.prototype
 *     SGF.inherits(MySubclass, EventEmitter);
 **/
function EventEmitter() {
    var self = this;
    self['_l'] = {};

    // In order to get EventEmitter functionality on a Class that already
    // extends another Class, invoke `EventEmitter.call(this)` in the
    // constructor without the call to `SGF.inherits(Class, EventEmitter)`.
    // This is needed for Game, which directly extends Container, but also
    // needs EventEmitter functionality.
    if (!(self instanceof EventEmitter)) {
        for (var i in EventEmitter.prototype) {
            self[i] = EventEmitter.prototype[i];
        }
    }
}

/**
 * EventEmitter#addListener(eventName, listener) -> this
 * - eventName (String): The name of the event that needs to be emitted
 *                       in order for `listener` to be invoked.
 * - listener (Function): The `function` to call when `eventName` is
 *                        fired. The arguments to the function are passed
 *                        from [[EventEmitter#emit]].
 *                              
 * Adds a listener `function` for the specified event name. If `eventName`
 * is fired using [[EventEmitter#emit]], then `listener` will be invoked,
 * with the `EventEmitter` instance as `this`. Any number of listeners
 * may be attached to a single `eventName`.
 **/
EventEmitter.prototype['addListener'] = function(eventName, listener) {
    var listeners = this['_l'];
    if (eventName in listeners) {
        listeners[eventName]['push'](listener);
    } else {
        listeners[eventName] = [ listener ];
    }
    return this;
}

/**
 * EventEmitter#removeListener(eventName, listener) -> this
 * - eventName (String): The name of the event in which `listener` needs
 *                       to be removed.
 * - listener (Function): The `function` to remove from the array of
 *                        listeners for `eventName`.
 *                              
 * Removes a single listener for `eventName`. If `listener` is not found
 * in `eventName`'s list of listeners, then this function does nothing.
 **/
EventEmitter.prototype['removeListener'] = function(eventName, listener) {
    var listeners = this['_l'][eventName];
    if (listeners) {
        var index = listeners['indexOf'](listener);
        if (index >= 0) {
            arrayRemove(listeners, index);
        }
    }
    return this;
}

/**
 * EventEmitter#removeAllListeners(eventName) -> this
 * - eventName (String): The name of the event in which all listeners
 *                       need to be removed.
 *                              
 * Removes all listeners for `eventName`.
 **/
EventEmitter.prototype['removeAllListeners'] = function(eventName) {
    delete this['_l'][eventName];
    return this;
}

/**
 * EventEmitter#emit(eventName, args) -> this
 * - eventName (String): The name of the event to emit.
 * - args (Array): Optional. An array of arguments for the listeners
 *                 of the event.
 *                              
 * Fires event `eventName` on the `EventEmitter` instance. If a
 * second argument is passed, it will be the contents of `arguments`
 * inside the listener functions.
 **/
EventEmitter.prototype['emit'] = function(eventName, args) {
    var listeners = this['_l'][eventName];
    if (listeners) {
        listeners = arrayClone(listeners);
        args = args || [];
        for (var i=0, length = listeners.length; i<length; i++) {
            listeners[i].apply(this, args);
        }
    }
    return this;
}


// Deprecated
var fireEventMessage = false;
EventEmitter.prototype['fireEvent'] = function() {
    if (!fireEventMessage) {
        log("DEPRECATED: 'EventEmitter#fireEvent' is deprecated, "+
            "please use 'EventEmitter#emit' instead.");
        fireEventMessage = true;
    }
    return this['emit']['apply'](this, arguments);
};

var observeMessage = false;
EventEmitter.prototype['observe'] = function() {
    if (!observeMessage) {
        log("DEPRECATED: 'EventEmitter#observe' is deprecated, "+
            "please use 'EventEmitter#addListener' instead.");
        observeMessage = true;
    }
    return this['addListener']['apply'](this, arguments);
};

var stopObservingMessage = false;
EventEmitter.prototype['stopObserving'] = function() {
    if (!stopObservingMessage) {
        log("DEPRECATED: 'EventEmitter#stopObserving' is deprecated, "+
            "please use 'EventEmitter#removeListener' instead.");
        stopObservingMessage = true;
    }
    return this['removeListener']['apply'](this, arguments);    
};

modules['eventemitter'] = EventEmitter;

var REQUIRED_OVERFLOW = "hidden";

/** section: Core API
 * class Screen
 *
 * Contains information about the screen the game is being rendered to.
 **/
var Screen = function(game) {
    var self = this;
    
    EventEmitter.call(self);
        
    self['_bind'] = function(element) {
        // First, we need to "normalize" the Screen element by first removing
        // all previous elements, and then setting some standard styles
        var style = element['style'];
        style['padding'] = 0;
        style['overflow'] = REQUIRED_OVERFLOW;
        if (style['MozUserSelect'] !== undefined) {
            style['MozUserSelect'] = "moz-none";
        } else if (style['webkitUserSelect'] !== undefined) {
            style['webkitUserSelect'] = "none";
        }
        Element['makePositioned'](element);
        for (var i=0, nodes=element.childNodes, l=nodes.length, node=null; i<l ;i++) {
            node = nodes[i];
            if (node && (node.id != "webSocketContainer")) {
                element.removeChild(node);
            }
        }
        //Element['immediateDescendants'](element)['without']($("webSocketContainer"))['invoke']("remove");

        // If Screen#bind has been called prevously, then this call has to
        // essentially move all game elements to the new Screen element
        if (self['element'] !== null && Object['isElement'](self['element'])) {
            Element['immediateDescendants'](self['element'])['invoke']("remove")['each'](element['insert'], element);
        }
        
        self['element'] = element;
        game['element'] = element;

        self['isFullScreen'] = (element === document.body);
    }

    self['useNativeCursor'] = function(cursor) {
        var val = null;
        if (Boolean(cursor) == false) {
            cursor = "none";
        }
        if (Object['isString'](cursor)) {
            cursor = cursor.toLowerCase();
            if ("default" == cursor) {
                val = "default";
            } else if ("crosshair" == cursor) {
                val = "crosshair";
            } else if ("hand" == cursor) {
                val = "pointer";
            } else if ("move" == cursor) {
                val = "move";
            } else if ("text" == cursor) {
                val = "text";
            } else if ("wait" == cursor) {
                val = "wait";
            } else if ("none" == cursor) {
                val = "url(" + engineRoot + "blank." + (isIE ? "cur" : "gif") + "), none";
            }
        }

        self['element'].style.cursor = val;
    }

    // SGF API parts
    /**
     * Screen#useNativeCursor(cursor) -> undefined
     * - cursor (String | false)
     *
     * Changes the mouse icon to one of the specified `cursor` values.
     * These values correspond to the system native cursors, and those
     * icons will be used.
     *
     * The allowed `cursor` values are:
     *
     *   - `default`: The default system mouse pointer.
     *
     *   - `hand`: A hand that has an index finger pointing to the hot spot.
     *
     *   - `crosshair`: A crosshair symbol, or + sign. Could be useful as a gun shoot point.
     *
     *   - `move`: Makes arrows point in all directions. Maybe if something is draggable in your UI.
     *
     *   - `text`: Makes it look like an element can be typed inside of.
     *
     *   - `wait`: A busy icon. Useful for loading script files or other dependencies.
     *
     *   - `none` or `false`: Invisible mouse cursor. Note that all mouse movement and button click event will still be fired. This is very useful if your game doesn't use the mouse, or if your game uses a custom mouse cursor (possibly via a [[Sprite]]).
     **/
    /**
     * Screen#width -> Number
     *
     * The total width available to your game. Use this value for centering
     * (or any kind of positioning) components.
     **/
    /**
     * Screen#height -> Number
     *
     * The total height available to your game. Use this value for centering
     * (or any kind of positioning) components.
     **/
}

inherits(Screen, EventEmitter);

Screen.prototype['_r'] = function() {
    var self = this, color = self['color'], element = self['element'];
    self['_browserWidth'] = (self['isFullScreen'] && document.documentElement.clientWidth !== 0 ? document.documentElement.clientWidth : self['element'].clientWidth);
    self['_browserHeight'] = (self['isFullScreen'] && document.documentElement.clientHeight !== 0 ? document.documentElement.clientHeight : self['element'].clientHeight);
    self['width'] = self['_browserWidth'] * devicePixelRatio;
    self['height'] = self['_browserHeight'] * devicePixelRatio;
    
    if (color != self['_c']) {
        element['style']['backgroundColor'] = "#" + color;
        self['_c'] = color;
    }
}

Screen.prototype['color'] = "000000";

Screen.prototype['isFullScreen'] = false;

Screen.prototype['toString'] = functionReturnString("[object Screen]");

modules['screen'] = Screen;

var currentInput = null;

/** section: Core API
 * class Input
 *
 * Contains information and utility methods concerning player input for games.
 * This covers mouse movement, mouse clicks, and key presses.
 **/
function Input(game) {
    
    
    var downMouseButtons = {},
    self = this;

    EventEmitter.call(self);

    self['game'] = game;
    self['_k'] = {};
    

    /**
     * Input.observe(eventName, handler) -> Input
     * - eventName (String): The name of the input event to observe. See below.
     * - handler (Function): The function to execute when `eventName` occurs.
     *
     * Sets the engine to call Function `handler` when input event `eventName`
     * occurs from the user. Allowed `eventName` values are:
     *
     *  - `keydown`: Called when a key is pressed down. The term "key" is meant
     *               to be used loosley, as in, a game client that contains a
     *               keyboard should call this for each key pressed. If the client
     *               contains is a portable gaming device, this should be called
     *               for each button pressed on the controller. The `Input.KEY_*`
     *               values should be used as the "basic" keyCode values.
     *               Optionally, the `keyCode` property in the argument object
     *               can be used to determine more precisely which key was pressed.
     *
     *  - `keyup`: Called when a key is released. See `keydown` above for more
     *             details.
     *
     *  - `mousemove`: Called continually as the mouse moves across the game screen.
     *                 The `x` and `y` properties in the argument object can be
     *                 used to determine the mouse position.
     *
     *  - `mousedown`: Called when any of the mouse keys are pressed down. The
     *                 `button` value in the argument object can be used to
     *                 determine which mouse button was pressed, along with `x`
     *                 and `y` to determine where on the screen the button was
     *                 pressed down.
     *
     *  - `mouseup`: Called when any of the mouse keys are released. The
     *               `button` value in the argument object can be used to
     *               determine which mouse button was pressed, along with `x`
     *               and `y` to determine where on the screen the button was
     *               pressed released.
     *                 
     **/
    /**
     * Input.stopObserving(eventName, handler) -> Input
     * - eventName (String): The name of the input event to stop observing.
     * - handler (Function): The function to remove from execution.
     *
     * Detaches Function `handler` from event `eventName`. See the description
     * and list of events in [[Input.observe]] for more information on the
     * allowed `eventName` values.
     **/
}

inherits(Input, EventEmitter);

/**
 * Input#pointerX -> Number
 *
 * The current X coordinate of the mouse pointer.
 **/
Input.prototype['pointerX'] = 0;
/**
 * Input#pointerY -> Number
 *
 * The current Y coordinate of the mouse pointer.
 **/
Input.prototype['pointerY'] = 0;
/**
 * Input#isKeyDown(keyCode) -> Boolean
 * - keyCode (Number): The keyCode to check if it is being pressed.
 *
 * Returns `true` if the key `keyCode` is currently being pressed down, or
 * `false` otherwise. `keyCode` can be any of the `Input.KEY_*` values,
 * or any other key code value for a input device with more keys (like a
 * full keyboard).
 **/
Input.prototype['isKeyDown'] = function(keyCode) {
    return this['_k'][keyCode] === true;
}

Input.prototype['toString'] = functionReturnString("[object Input]");

// Constants
/**
 * Input.MOUSE_PRIMARY -> ?
 *
 * Indicates that the primary mouse button has been clicked. This is
 * usually the left mouse button for right-handed people, and the right
 * mouse button for left-handed people.
 **/
Input['MOUSE_PRIMARY'] = 0;
/**
 * Input.MOUSE_MIDDLE -> ?
 *
 * Indicates that the middle button on the mouse has been clicked. Note
 * that not all mice have a middle button, so if you are planning on
 * using this functionality, it would be a good idea to make to action
 * be performed some other way as well (like a keystroke).
 **/
Input['MOUSE_MIDDLE'] = 1;
/**
 * Input.MOUSE_SECONDARY -> ?
 *
 * Indicates that the secondary mouse button has been clicked. This is
 * usually the right mouse button for right-handed people, and the left
 * mouse button for left-handed people.
 **/
Input['MOUSE_SECONDARY'] = 2;
/**
 * Input.KEY_DOWN -> ?
 *
 * Indicates that the `down` arrow or button is being pressed on the keypad.
 **/
Input['KEY_DOWN'] = 40;
/**
 * Input.KEY_UP -> ?
 *
 * Indicates that the `up` arrow or button is being pressed on the keypad.
 **/
Input['KEY_UP'] = 38;
/**
 * Input.KEY_LEFT -> ?
 *
 * Indicates that the `left` arrow or button is being pressed on the keypad.
 **/
Input['KEY_LEFT'] = 37;
/**
 * Input.KEY_RIGHT -> ?
 *
 * Indicates that the `right` arrow or button is being pressed on the keypad.
 **/
Input['KEY_RIGHT'] = 39;
/**
 * Input.KEY_1 -> ?
 *
 * Indicates that first button on the keypad is being pressed. The "first
 * button" can be configurable to say a client with a keyboard, but if
 * a controller is being used, this should also be the value returned.
 **/
Input['KEY_1'] = 32;
/**
 * Input.KEY_2 -> ?
 *
 * Indicates that second button on the keypad is being pressed.
 **/
Input['KEY_2'] = 33;
/**
 * Input.KEY_3 -> ?
 *
 * Indicates that third button on the keypad is being pressed.
 **/
Input['KEY_3'] = 34;
/**
 * Input.KEY_4 -> ?
 *
 * Indicates that fourth button on the keypad is being pressed.
 **/
Input['KEY_4'] = 35;

function blur() {
    currentInput = null;
}

function focus(input) {
    currentInput = input;
}

function getPointerCoords(event) {
    var offset = currentInput['game']['screen']['element']['cumulativeOffset']();
    return {
        'x': (event['pointerX']() - offset['left']),
        'y': (event['pointerY']() - offset['top'])
    };
}


function contextmenuHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {
            event['stop']();
        }
    }
}

function keypressHandler(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (currentInput) {
        event['stop']();
    }
}

function keydownHandler(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (currentInput) {
        event['stop']();
        if (currentInput['_k'][event.keyCode] === true) return;
        var eventObj = {
                'keyCode': event.keyCode,
                'shiftKey': event.shiftKey
            };

        currentInput['_k'][event.keyCode] = true;

        currentInput['emit']("keydown", [eventObj]);
    }
}

function keyupHandler(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (currentInput) {
        event['stop']();
        if (currentInput['_k'][event.keyCode] === false) return;
        var eventObj = {
                keyCode: event.keyCode,
                shiftKey: event.shiftKey
            };

        currentInput['_k'][event.keyCode] = false;

        currentInput['emit']("keyup", [eventObj]);
    }
}

function mousedownHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        eventObj['button'] = event['button'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {
            
            focus(currentInput);
            event['stop']();
            window.focus();

            //downMouseButtons[event.button] = true;

            currentInput['pointerX'] = eventObj.x;
            currentInput['pointerY'] = eventObj.y;

            currentInput['emit']("mousedown", [eventObj]);
        } else {
            blur();
            mousedownHandler(event);
        }
    } else {
        var i = runningGameInstances.length
        ,   offset = null
        ,   element = null
        ,   pointerX = event['pointerX']()
        ,   pointerY = event['pointerY']();
        while (i--) {
            element = runningGameInstances[i]['element'];
            offset = element['cumulativeOffset']();
            
            if (pointerX >= (offset['left'])
             && pointerX <= (offset['left'] + element['clientWidth'])
             && pointerY >= (offset['top'])
             && pointerY <= (offset['top'] + element['clientHeight'])) {
                 
                currentInput = runningGameInstances[i]['input'];
                mousedownHandler(event);
            }
        }
    }
}

function mouseupHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        eventObj['button'] = event['button'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {

            event['stop']();

            //downMouseButtons[event.button] = false;

            currentInput['pointerX'] = eventObj.x;
            currentInput['pointerY'] = eventObj.y;
            
            currentInput['emit']("mouseup", [eventObj]);
        }
    }
}

function mousemoveHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height &&
            (currentInput['pointerX'] !== eventObj['x'] || currentInput['pointerY'] !== eventObj['y'])) {

            event['stop']();

            currentInput['pointerX'] = eventObj.x;
            currentInput['pointerY'] = eventObj.y;
            
            currentInput['emit']("mousemove", [eventObj]);
        }
    }
}

function touchstartHandler(event) {
    if (currentInput) {

        var currentScreen = currentInput['game']['screen'];
        for (var i=0, l=event['touches'].length; i<l; i++) {
        }
        
        /*if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {*/
            
            focus(currentInput);
            event['stop']();
            window.focus();

            //currentInput['pointerX'] = eventObj.x;
            //currentInput['pointerY'] = eventObj.y;

            currentInput['emit']("touchstart", [event]);
        /*} else {
            // Blur the current input
            blur();
            // Check for any other game instances' touches
            touchstartHandler(event);
        }*/

    } else {
        var i = runningGameInstances.length
        ,   game = null
        ,   element = null
        ,   offset = null
        ,   pointerX = null
        ,   pointerY = null;

        while (i--) {
            game = runningGameInstances[i];
            element = game['element'];
            offset = element['cumulativeOffset']();

            for (var j=0, l=event['changedTouches'].length; j<l; j++) {

                pointerX = event['changedTouches'][j]['pageX'];
                pointerY = event['changedTouches'][j]['pageY'];

                if (pointerX >= (offset['left'])
                    && pointerX <= (offset['left'] + game['screen']['width'])
                    && pointerY >= (offset['top'])
                    && pointerY <= (offset['top'] + game['screen']['height'])) {
                 
                    currentInput = game['input'];
                    touchstartHandler(event);
                }
            }
        }
    }
}

function touchmoveHandler(event) {
    if (currentInput) {
        event['stop']();

        currentInput['pointerX'] = event['touches'][0].x;
        currentInput['pointerY'] = event['touches'][0].y;
        
        currentInput['emit']("touchmove", [event]);
    }
}

function touchendHandler(event) {
    if (currentInput) {
        event['stop']();
    }
}

Input['grab'] = function() {
    document['observe']("keydown", keydownHandler)
            ['observe']("keypress", keypressHandler)
            ['observe']("keyup", keyupHandler)
            ['observe']("mousemove", mousemoveHandler)
            ['observe']("mousedown", mousedownHandler)
            ['observe']("mouseup", mouseupHandler)
            ['observe']("touchstart", touchstartHandler)
            ['observe']("touchmove", touchmoveHandler)
            ['observe']("touchend", touchendHandler)
            ['observe']("contextmenu", contextmenuHandler);
    Input.grabbed = true;
}

Input['release'] = function() {
    document['stopObserving']("keydown", keydownHandler)
            ['stopObserving']("keypress", keypressHandler)
            ['stopObserving']("keyup", keyupHandler)
            ['stopObserving']("mousemove", mousemoveHandler)
            ['stopObserving']("mousedown", mousedownHandler)
            ['stopObserving']("mouseup", mouseupHandler)
            ['stopObserving']("touchstart", touchstartHandler)
            ['stopObserving']("touchmove", touchmoveHandler)
            ['stopObserving']("touchend", touchendHandler)
            ['stopObserving']("contextmenu", contextmenuHandler);
    Input.grabbed = false;
}

modules['input'] = Input;
// Returns the current timestamp in milliseconds, opting
// for the native 'Date.now' function if available.
var now = (function() {
    if ("now" in Date) {
        return Date['now'];
    } else {
        return function() {
            return (new Date).getTime();
        };
    }
})(),
// A private variable containing the 'current' game. Used
// internally by `Game.getInstance()`.
currentGame = null,
// An private array of the currently running SGF games.
// More than 1 are able to be displayed on a single HTML
// page by calling `SGF.startWithDiv()` multiple times.
runningGameInstances = [];


/** section: Core API
 * class Game < Container
 *
 * Represents your game itself. That is, an instance of [[Game]] is
 * automatically created every time an SGF game is loaded. The
 * [[Game]] class is in charge of the "game loop", and invokes it's
 * own [[Game#update]] and [[Game#render]] functions to execute the
 * game.
 *
 * The [[Game]] class is a subclass of [[Container]], and will be the
 * top-level [[Container]] that you will be inserting custom [[Component]]
 * instances into.
 *  
 * [[Game]] is an [[EventEmitter]], which emits the following events:
 *
 *  - `load`: Fired immediately after the game's _main.js_ file finishes
 *            loading and executing into the game environment.
 *  
 *  - 'start': 
 *  
 *  - 'stopping':
 *  
 *  - 'stopped' :
 **/
function Game(rootUrl, screen, options) {

    var self = this;
    
    /**
     * Game#addComponent(component) -> Game
     * - component (Component): The top-level component to add to the game
     *                              loop and begin rendering.
     *                              
     * Adds a [[Component]] to the game. It will be rendered onto the screen,
     * and considered in the game loop. Returns the [[Game]] object (this),
     * for chaining.
     **/

    /**
     * Game#removeComponent(component) -> Game
     * - component (Component): The top-level component to remove from the
     *                              game loop and stop rendering.
     *                              
     * Removes a [[Component]] that has previously been added to the game
     * loop via [[Game#addComponent]].
     **/






    EventEmitter.call(self);
    
    Container.call(self, options);
    
    
    self['input'] = new Input(self);
    
    self['screen'] = new Screen(self);
    self['screen']['_bind'](screen);



    // 'root' is the path to the folder containing the Game's 'main.js' file.
    if (rootUrl['endsWith']("main.js")) rootUrl = rootUrl.substring(0, rootUrl.lastIndexOf("main.js"));
    
    /**
     * Game#root -> String
     *  
     * Read-only. The absolute path to the root directory (where `main.js`
     * resides) of the SGF game. Trailing slash is included.
     **/
    self['root'] = rootUrl['endsWith']('/') ? rootUrl : rootUrl + '/';
    
    // Set the initial game speed. This can be changed during gameplay.
    self['setGameSpeed'](self['gameSpeed']);

    // Init some standard properties
    self['running'] = false;
    self['startTime'] = NaN;

    // Set as currentGame for `Game.getInstance()`
    currentGame = self;

    // A binded 'step' function
    self['_s'] = function() {
        self['step']();
    }

    // Last step of initialization is to load the Game's 'main.js' file
    self['getScript']("main.js", function() {
        self['loaded'] = true;
        // Notify all the game's 'load' listeners
        self['emit']('load');
        self['start']();
    });
}

inherits(Game, Container);
makePrototypeClassCompatible(Game);

/**
 * Game#gameSpeed -> Number
 *  
 * Read-only. The current target updates-per-second the game is attepting
 * to achieve. If you must dynamically change the game speed during
 * runtime, use [[Game#setGameSpeed]] instead.
 *  
 * The default game speed attempted is **30** (thirty) updates per second.
 **/
Game.prototype['gameSpeed'] = 30;

/**
 * Game#loaded -> Boolean
 *  
 * Read-only. `false` immediately after instantiation. `true` once the
 * ___main.js___ file has finished loading and has been executed.
 **/
Game.prototype['loaded'] = false;

/**
 * Game#maxFrameSkips -> Number
 *  
 * Read and write. The maximum allowed number of times [[Game#update]] may
 * be called in between [[Game#render]] calls if the game's demand is more
 * than current harware is capable of.
 * 
 * The default value is **5** (five).
 **/
Game.prototype['maxFrameSkips'] = 5;

/**
 * Game#renderCount -> Number
 *
 * Read-only. The total number of times that [[Game#render]] has been
 * called throughout the lifetime of the game.
 **/
Game.prototype['renderCount'] = 0;
 
 /**
  * Game#updateCount -> Number
  *
  * Read-only. The total number of times that [[Game#update]] has been
  * called throughout the lifetime of the game.
  **/
Game.prototype['updateCount'] = 0;




/**
 * Game#setGameSpeed(updatesPerSecond) -> Game
 * - updatesPerSecond (Number): The number of updates-per-second the
 *                              game should attempt to achieve.
 *                              
 * Sets the "Game Speed", or attempted times [[Game#update]] gets called
 * per second. This can be called at any point during gameplay. Note that
 * sounds and music playback speed do not get affected by this value.
 **/
Game.prototype['setGameSpeed'] = function(updatesPerSecond) {
    this['gameSpeed'] = updatesPerSecond;

    // 'period' is the attempted time between each update() call (in ms).
    this['period'] = 1000 / updatesPerSecond;
    return this;
}

Game.prototype['start'] = function() {
    debug('Starting "' + this['root'] + '"');

    // The 'running' flag is used by step() to determine if the loop should
    // continue or end. Do not set directly, use stop() to kill game loop.
    this['running'] = true;

    runningGameInstances.push(this);

    // Note when the game started, and when the next
    // call to update() should take place.
    this['startTime'] = this['nextGamePeriod'] = now();
    this['updateCount'] = this['renderCount'] = 0;

    // Start the game loop itself!
    setTimeout(this['_s'], 0);

    // Notify game's 'start' listeners
    this['emit']("start");
}

/**
 * Game#getFont(relativeUrl[, callback = null]) -> Font
 * - relativeUrl (String): A URL relative to the [[Game#root]] of a font
 *                         resource to load.
 * - callback (Function): Optional. A `Function` to invoke when the font
 *                        loading process has completed, successfully or
 *                        not. If an error occured (ex: file not found),
 *                        an `Error` object will be passed as the first
 *                        argument to `callback`.
 *                              
 * A convienience function that returns a `new` [[Font]], but forcing the
 * URL to be relative to [[Game#root]], instead of the default.
 **/
Game.prototype['getFont'] = function(relativeUrl, callback) {
    return new modules['font'](this, relativeUrl, callback);
}

/**
 * Game#getScript(relativeUrl[, callback = null]) -> Script
 * - relativeUrl (String): A URL relative to the [[Game#root]] of a
 *                         JavaScript source file to load.
 * - callback (Function): Optional. A `Function` to invoke when the script
 *                        loading and executing process has completed,
 *                        successfully or not. If an error occured (ex:
 *                        file not found), an `Error` object will be passed
 *                        as the first argument to `callback`.
 *                              
 * A convienience function that returns a `new` [[Script]], but forcing the
 * URL to be relative to [[Game#root]], instead of the default.
 **/
Game.prototype['getScript'] = function(relativeUrl, callback) {
    return new modules['script'](this, relativeUrl, callback);
}

/**
 * Game#getSound(relativeUrl[, callback = null]) -> Sound
 * - relativeUrl (String): A URL relative to the [[Game#root]] of sound
 *                         file to load.
 * - callback (Function): Optional. A `Function` to invoke when the sound
 *                        loading process has completed, successfully or
 *                        not. If an error occured (ex: file not found),
 *                        an `Error` object will be passed as the first
 *                        argument to `callback`.
 *                              
 * A convienience function that returns a `new` [[Sound]], but forcing the
 * URL to be relative to [[Game#root]], instead of the default.
 **/
Game.prototype['getSound'] = function(relativeUrl, callback) {
    return new modules['sound'](this, relativeUrl, callback);
}

/**
 * Game#getSpriteset(relativeUrl[, callback = null]) -> Spriteset
 * - relativeUrl (String): A URL relative to the [[Game#root]] of an
 *                         image resource to load.
 * - callback (Function): Optional. A `Function` to invoke when the image
 *                        loading process has completed, successfully or
 *                        not. If an error occured (ex: file not found),
 *                        an `Error` object will be passed as the first
 *                        argument to `callback`.
 *                              
 * A convienience function that returns a `new` [[Spriteset]], but forcing the
 * URL to be relative to [[Game#root]], instead of the default.
 **/
Game.prototype['getSpriteset'] = function(relativeUrl, width, height, callback) {
    return new modules['spriteset'](this, relativeUrl, width, height, callback);
}

/**
 * Game#render() -> undefined
 *                           
 * The game render function that gets called automatically during each pass
 * in the game loop. Calls [[Component#render]] on all components added
 * through [[Container#addComponent]]. Afterwards, increments the
 * [[Game#renderCount]] value by _1_.
 * 
 * SGF game code should never have to call this method, it is handled
 * automatically by the game loop.
 **/
Game.prototype['render'] = function() {
    for (var components = arrayClone(this['components']),
            i=0,
            component=null,
            renderCount = this['renderCount']++,
            length = components.length; i<length; i++) {
        
        component = components[i];
        if (component['render']) {
            component['render'](renderCount);
        }
    }
}


/*
 * The main iterator function. Called as fast as the browser can handle
 * (i.e. setTimeout(this.step, 0)) in order to implement variable FPS.
 * This method, however, ensures that update() is called at the requested
 * "gameSpeed", so long as hardware is capable.
 **/
Game.prototype['step'] = function() {
    // Stop the loop if the 'running' flag is changed.
    if (!this['running']) return this['stopped']();

    currentGame = this;

    // This while loop calls update() as many times as required depending
    // on the current time and the last time update() was called. This
    // could happen 0 times if the hardware is calling step() more times
    // than the requested 'gameSpeed'. This will result in higher FPS than UPS
    var loops = 0;
    while (now() > this['nextGamePeriod'] && loops < this['maxFrameSkips']) {
        this['update']();
        this['nextGamePeriod'] += this['period'];
        loops++;
    }

    // Sets the screen background color, screen width and height
    this['screen']['_r']();

    // Renders all game components.
    this['render']();

    // Continue the game loop, as soon as the browser has time for it,
    // allowing for other JS on the stack to be executed (events, etc.)
    setTimeout(this['_s'], 0);
}

/*
 * Stops the game loop if the game is running.
 **/
Game.prototype['stop'] = function() {
    this['emit']("stopping");
    this['running'] = false;
    return this;
}

Game.prototype['stopped'] = function() {
    this['screen']['useNativeCursor'](true);
    currentGame = null;
    this['emit']("stopped");
}

/**
 * Game#update() -> undefined
 *                           
 * The game update function that gets called automatically during each pass
 * in the game loop. Calls [[Component#update]] on all components added
 * through [[Container#addComponent]]. Afterwards, increments the
 * [[Game#updateCount]] value by _1_.
 * 
 * SGF game code should never have to call this method, it is handled
 * automatically by the game loop.
 **/
Game.prototype['update'] = function() {
    for (var components = arrayClone(this['components']),
            i=0,
            component=null,
            updateCount=this['updateCount']++,
            length = components.length; i < length; i++) {
        
        component = components[i];
        if (component['update']) {
            component['update'](updateCount);
        }
    }
}

/* HTML/DOM Client specific function
 * Computes the z-index of a component added through addComponent.
 **/
Game.prototype['__computeChildZIndex'] = function(zIndex) {
    return ((parseInt(zIndex)||0)+1) * 1000;
}

Game.prototype['toString'] = functionReturnString("[object Game]");

/**
 * Game.getInstance() -> Game
 *
 * Gets the `Game` instance for your game. This will likely be one
 * of the first lines of code in your SGF game's `main.js` file.
 **/
Game['getInstance'] = function() {
    return currentGame;
}

modules['game'] = Game;


    /**
 * == Resources API ==
 * The `Resources API` is meant for loading various types of external
 * game resources into your SGF game environment. Game resources include
 * additional JavaScript source files ([[Script]]), image files ([[Spriteset]]),
 * music and sounds ([[Sound]]), and more.
 **/

/** section: Resources API
 * class Font
 * 99% of games use some sort of text in the game. Whether to display a score
 * or dialog from a character, rendering text on the game screen begins with
 * an [[Font]] instance, to specify which font will be used with the text.
 *
 * [[Font]] is an [[EventEmitter]], which emits the following events:
 *
 *  - `load`: Fired when the font resource has completed it's loading process,
 *  either successfully or with an error (i.e. file not found). If
 *  an error occured, a native `Error` will be the first argument
 *  passed to any load listeners.
 **/


 /**
  * new Font(path[, options = null, callback = null])
  * - path (String): The relative or absolute path to a font resource. The
  *                  path should omit the file extension, and supply a `formats`
  *                  property in the `options` argument.
  * - options (Object): Optional. An object containing the instance properties
  *                     that need to be changed from the default. With [[Font]],
  *                     a `formats` Array options will most likely be specified
  *                     to inform the engine which different file types are
  *                     available for use.
  * - callback (Function): Optional. The function to invoke when the `load`
  *                        event is emitted.
  *
  * 
  **/
function Font(game, path, onLoad) {

    var self = this;
    
    EventEmitter.call(self);

    if (game instanceof Game) {
        // We're trying to load a font living inside the game folder.
        path = game['root'] + path;
        self['__fontName'] = "SGF_font"+Math.round(Math.random() * 10000);
        self['__styleNode'] = embedCss(
            '@font-face {'+
            '  font-family: "' + self['__fontName'] + '";'+
            '  src: url("'+path+'");'+
            '}'
        );
    } else {
        // Just a font name supplied, ex: "Comic Sans MS"
        // Must be installed on local computer
        path = game;
        self['__fontName'] = path;
    }
}

function embedCss(cssString) {
    var node = document.createElement("style");
    node['type'] = "text/css";
    if (node['styleSheet']) {  // IE
        node['styleSheet']['cssText'] = cssString;
    } else {                // the world
        node.appendChild(document.createTextNode(cssString));
    }
    document.getElementsByTagName('head')[0].appendChild(node);
    return node;
};

inherits(Font, EventEmitter);
makePrototypeClassCompatible(Font);

Font.prototype['toString'] = functionReturnString("[object Font]");

modules['font'] = Font;

/** section: Resources API
 * class Script
 *
 * The `Script` class is responsible for loading additional JavaScript source
 * files into your SGF game's JavaScript environment.
 **/
function Script(game, scriptUrl, onLoad) {
    if (game instanceof Game) {
        scriptUrl = game['root'] + scriptUrl;
    } else {
        // Absolute URL was given...
        onLoad = scriptUrl;
        scriptUrl = game;
    }

    // Create a new script element with the specified src
    var script = document.createElement("script")
    ,   self = this;
    
    EventEmitter.call(self);
    
    if (onLoad) {
        self['addListener']("load", onLoad);
    }
    
    script['type'] = "text/javascript";
    script['setAttribute']("async", "true");

    script['onload'] = script['onreadystatechange'] = function() {
        if ((!script['readyState'] || script['readyState'] == "loaded" || script['readyState'] == "complete")) {

            // Remove script from the document.
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            // Now remove all properties on the object
            for (var prop in script) {
                delete script[prop];
            }
            script = null;

            //log("readyState: " + script['readyState']);
            self['loaded'] = true;
        	self['emit']("load");
        }
    }

    script['src'] = scriptUrl;

    // Add the script element to the document head
    document.getElementsByTagName("head")[0].appendChild(script);

    // Set our 'src' after appending to "head" so that the URL is absolute.
    self['src'] = script['src'];
}

inherits(Script, EventEmitter);
makePrototypeClassCompatible(Script);

Script.prototype['loaded'] = false;
Script.prototype['toString'] = functionReturnString("[object Script]");

modules['script'] = Script;

function Sound(game, path, callback) {
    var self = this;

    EventEmitter.call(self);
}

inherits(Sound, EventEmitter);
makePrototypeClassCompatible(Sound);

Sound.prototype['toString'] = functionReturnString("[object Sound]");

modules['sound'] = Sound;

/** section: Resources API
 * class Spriteset
 *
 * The `Spriteset` class is responsible for loading and keeping a
 * reference to the in-memory Image data for a Spriteset. The actual type of
 * Image resource supported depends on the SGF engine in use. However, `.jpg`
 * `.png`, `.gif` are highly recommended to be implemented in every engine.
 **/

 /**
  * new Spriteset(path, spriteWidth, spriteHeight[, callback = null])
  * - path (String): The absolute or relative path of the Image resource to
  *                  load. A relative path using `new` will be relative to the
  *                  current page. To get a resource relative to your game
  *                  root, use [[Game#getSpriteset]] instead.
  * - spriteWidth (Number): The width in pixels of each sprite on the spriteset.
  *                         If you are loading a single sprite, this should be
  *                         the width of the image itself.
  * - spriteHeight (Number): The height in pixels of each sprite on the spriteset.
  *                          If you are loading a single sprite, this should be
  *                          the height of the image itself.
  * - callback (Function): Optional. A `Function` to invoke when the image
  *                        loading process has completed, successfully or
  *                        not. If an error occured (ex: file not found),
  *                        an `Error` object will be passed as the first
  *                        argument to `callback`.
  *
  * To create an instance of a [[Spriteset]], you must first know the
  * relative path of the image file in your game folder, and you must know
  * the width and height of each sprite in pixels on this [[Spriteset]].
  *
  * Once instantiated, there are no instance methods to call, you just need
  * to pass the [[Spriteset]] reference to new [[Sprite]]s.
  **/
function Spriteset(game, path, spriteWidth, spriteHeight, onLoad) {
    if (game instanceof Game) {
        path = game['root'] + path;
    } else {
        // Absolute URL was given...
        onLoad = spriteHeight;
        spriteHeight = spriteWidth;
        spriteWidth = path;
        path = game;
    }

    var self = this;
    
    EventEmitter.call(self);
    
    self['spriteWidth'] = spriteWidth;
    self['spriteHeight'] = spriteHeight;

    if (onLoad) {
        self['addListener']("load", onLoad);
    }

    var img = new Image;
    img['style']['position'] = "absolute";
    img['onload'] = function() {
        self['width'] = img['width'];
        self['height'] = img['height'];
        self['loaded'] = true;
        self['emit']("load");
    };

    self['image'] = img;

    // Finally begin loading the image itself!
    img['src'] = path;
    self['src'] = img['src'];
}

inherits(Spriteset, EventEmitter);
makePrototypeClassCompatible(Spriteset);


/**
 * Spriteset#loaded -> Boolean
 *
 * Read-only. `false` immediately after instantiation, `true` once the Image
 * file has been completely loaded into memory, just before the `load` event
 * is fired.
 **/
Spriteset.prototype['loaded'] = false;

/**
 * Spriteset#width -> Number
 *
 * Read-only. The total width of this [[Spriteset]]. The value of this
 * property is `NaN` before it has loaded completely
 * (i.e. [[Spriteset#loaded]] == false).
 **/
Spriteset.prototype['width'] = NaN;

/**
 * Spriteset#height -> Number
 *
 * Read-only. The total height of this [[Spriteset]]. The value of this
 * property is `NaN` before it has loaded completely
 * (i.e. [[Spriteset#loaded]] == false).
 **/
Spriteset.prototype['height'] = NaN;

/**
 * Spriteset#spriteWidth -> Number
 *
 * Read-only. The width of each sprite on this [[Spriteset]]. This
 * is the value that was set in the constructor.
 **/
Spriteset.prototype['spriteWidth'] = NaN;

/**
 * Spriteset#spriteHeight -> Number
 *
 * Read-only. The height of each sprite on this [[Spriteset]]. This
 * is the value that was set in the constructor.
 **/
Spriteset.prototype['spriteHeight'] = NaN;

/**
 * Spriteset#src -> String
 * 
 * Read-only. The absolute URL to the image resource.
 **/
Spriteset.prototype['src'] = null;

Spriteset.prototype['toString'] = functionReturnString("[object Spriteset]");

modules['spriteset'] = Spriteset;


    /**
 * == Networking API ==
 * SGF offers a low-level socket connection through the WebSocket protocol.
 * This allows for real time networking inside your game.
 * All game clients **MUST** implement [[Client]], but only capable game
 * clients should implement [[Server]].
 **/

/** section: Networking API
 * class Client
 *
 * Connects to remote instances of [[Server]], or any other compliant
 * WebSocket server.
 *
 * An [[Client]] instance by itself does nothing except connect to the
 * specified server. You must implement an `onOpen`, `onClose`, and `onMessage`
 * function in either a subclass:
 *
 *     Class.create(Client, {
 *         onOpen: function() {
 *             // Connection to WebSocket has been established.
 *         },
 *         onClose: function() {
 *             // WebSocket connection has been closed.
 *         },
 *         onMessage: function(message) {
 *             // A message has been recieved from the server.
 *             SGF.log(message);
 *         }
 *     });
 *
 * or by directly setting the functions on a standard [[Client]] instance:
 *
 *     var conn = new Client("ws://somegameserver");
 *     conn.onOpen = function() {
 *         // Connection to WebSocket has been established.
 *     };
 *     conn.onClose = function() {
 *         // WebSocket connection has been closed.
 *     };
 *     conn.onMessage = function(message) {
 *         // A message has been recieved from the server.
 *         SGF.log(message);
 *     };
 **/


/**
 * new Client(url[, options])
 * - url (String): The WebSocket URL to the server to connect to. This should
 *                 use the `ws` protocol, port 80 by default. Ex: `ws://mygame.com:8080`
 * - options (Object): The optional `options` object's properties are copied
 *                     to the [[Client]] instance. Allows all the same
 *                     values as found in [[Client.DEFAULTS]].
 *
 * Instantiates a new [[Client]], using the options found in the
 * `options` parameter to configure. Clients do not make a socket connection
 * during construction (unlike the WebSocket API in HTML 5). To connect to
 * the server, the [[Client#connect]] method must be called first.
 **/
function Client(url, options) {
    var self = this;
    
    EventEmitter.call(self);

    extend(self, options || {});

    self['URL'] = url;
    
    self['_O'] = functionBind(onClientOpen, self);
    self['_C'] = functionBind(onClientClose, self);
    self['_M'] = functionBind(onClientMessage, self);

    if (self['autoconnect']) self['connect']();
}

inherits(Client, EventEmitter);
makePrototypeClassCompatible(Client);

/**
 * Client#onOpen() -> undefined
 *
 * Event handler that is called after an invokation to [[Client#connect]]
 * has been successful, and a proper WebSocket connection has been established.
 * You must implement this function in a subclass to be useful.
 **/
//onOpen: Prototype['emptyFunction'],

/**
 * Client#onClose() -> undefined
 *
 * Event handler that is called after an invokation to [[Client#close]]
 * has been called, resulting in a socket being closed. That is, if you call
 * [[Client#close]] on an instance that is already closed, then this
 * event will not be called.
 * Perhaps more importantly, this event will be called if the server closes
 * the connection (either directly through code or otherwise).
 * You must implement this function in a subclass to be useful.
 **/
//onClose: Prototype['emptyFunction'],

/**
 * Client#onMessage(message) -> undefined
 * - message (String): The String value of the message sent from the server.
 *
 * Event handler that is called after the server sends a message to this
 * instance through the network. You must implement this function in a
 * subclass to be useful with the `message` value in your game.
 **/
//onMessage: Prototype['emptyFunction'],

/**
 * Client#connect() -> undefined
 *
 * Makes this [[Client]] instance attempt to connect to the currently
 * set WebSocket server. This function will connect the underlying socket
 * connection on a network level, and call the [[Client#onOpen]] event
 * when the connection is properly established, and the WebSocket handshake
 * is successful.
 **/
Client.prototype['connect'] = function() {
    var webSocket = new WebSocket(this['URL']);
    webSocket['onopen'] = this['_O'];
    webSocket['onclose'] = this['_C'];
    webSocket['onmessage'] = this['_M'];
    this['_w'] = webSocket;
}

/**
 * Client#close() -> undefined
 *
 * Closes the underlying socket connection from the server, if there is a
 * connection, and calls the [[Client#onClose]] event when complete.
 * If the connection is already closed, then this function does nothing, and
 * the `onClose` event is not fired.
 **/
Client.prototype['close'] = function() {
    if (this['_w']) {
        this['_w']['close']();
    }
}

/**
 * Client#send(message) -> undefined
 * - message (String): The String that you will be sending to the server.
 *
 * Sends `message` to the currently connected server if it is connected.
 * If this [[Client]] instance is not connected when this is called,
 * then an exception is thrown. As such, it's a good idea to place calls
 * to [[Client#send]] inside of a try catch block:
 *
 *     try {
 *         client.send("hello server!");
 *     } catch(ex) {
 *         SGF.log(ex);
 *     }
 *
 * A use case when an exception is thrown would be to add `message` to some
 * sort of queue that gets sent during the [[Client#onOpen]] event.
 **/
Client.prototype['send'] = function(message) {
    this['_w']['send'](message);
}

function onClientOpen() {
    this['emit']("open");
}

function onClientClose() {
    this['emit']("close");
    this['_w'] = null;
}

function onClientMessage(event) {
    this['emit']("message", event['data']);
}


Client.prototype['autoconnect'] = false;
Client.prototype['toString'] = functionReturnString("[object Client]");

extend(Client, {
    'CONNECTING': 0,
    'OPEN':       1,
    'CLOSED':     2
});

modules['client'] = Client;
/** section: Networking API
 * class Server
 *
 * Acts as a server to maintain connections between multiple instances of your
 * game (and possibly even different game engines!).
 *
 * Underneath the hood, the [[Server]] class is intended to implement a WebSocket
 * server that rejects anything but valid WebSocket connection requests.
 *
 * Using this class is useful for game client to game client (peer-to-peer)
 * communication. It is entirely possible, however, to write a more dedicated
 * server for your game by
 * <a href="http://github.com/TooTallNate/Java-WebSocket#readme">Writing
 * Your Own WebSocket Server</a>. You would be more likely able to hard-code
 * the server address at that point in your game, making it more seamless for
 * your users.
 **/

/**
 * new Server([options])
 * - options (Object): The optional `options` object's properties are copied
 *                     to the [[SGF.Server]] instance. Allows all the same
 *                     values as found in [[SGF.Server.DEFAULTS]].
 *
 * Instantiates a new [[Server]], using the options found in the
 * `options` parameter to configure.
 **/
function Server() {
    throw new Error("The HTML game engine is not capable of starting a `Server`.");
}

/**
 * Server#start() -> undefined
 *
 * Starts the underlying WebSocket server listening on the currently
 * configured port number.
 **/
// start:null,

/**
 * Server#stop() -> undefined
 *
 * Stops the server from listening on the specified port. If the server is
 * currently running, then [[Server#onClientClose]] will be called for
 * all current connections.
 **/
// stop:null,

/**
 * Server#connections() -> Array
 *
 * Gets an [[Client]] array of the currerntly connected clients. These
 * instances can be used to individually send messages or close a client.
 **/
 
/**
 * Server#sendToAll(message) -> undefined
 * - message (String): The message to send to all current connections.
 *
 * Sends `message` to all currently connected game clients.
 **/
// sendToAll:null,

/**
 * Server#onClientOpen(client) -> undefined
 * - client (Client): The connection instance, in case you would like to
 *                        [[Client#send]] or [[Client#close]] this
 *                        connection specifically.
 *
 * Event handler that is called every time a WebSocket client makes a
 * connection to this server. This function should be overridden in a
 * subclass to actually be any useful.
 **/
// onClientOpen:null,

/**
 * Server#onClientClose(client) -> undefined
 * - client (Client): The connection instance. Note that the connection
 *                        to the client has been closed at this point, and
 *                        calling [[Client#send]] or [[Client#close]]
 *                        will throw an exception.
 *
 * Event handler that is called every time a WebSocket client disconnects
 * from this server. This function should be overridden in a  subclass to
 * actually be any useful. Be careful not to call [[Client#send]] or
 * [[Client#close]] on the `client` instance, since it's socket
 * connection has been closed.
 **/
// onClientClose:null,

/**
 * Server#onClientMessage(client, message) -> undefined
 * - client (Client): The connection instance, in case you would like to
 *                        [[Client#send]] or [[Client#close]] this
 *                        connection specifically.
 * - message (String): The String value of the message sent from `client`.
 *
 * Event handler that is called every time a WebSocket client sends a
 * message to this server. This function should be overridden in a subclass
 * to actually be any useful.
 **/
// onClientMessage:null


/**
 * Server.canServe -> Boolean
 *
 * Use this property as a feature-check to determine whether or not the
 * current game engine has the capability to host a [[Server]]. This value,
 * for instance, is set to `false` on the HTML engine, as a web browser is not
 * capable of starting it's own WebSocket server. On the Java game engine,
 * this value is `true`, as Java has a WebSocket server written for it that
 * can be used by your game.
 *
 *     var Server = SGF.require("Server");
 *     if (Server.canServe) {
 *         var server = new Server();
 *         server.start();
 *     }
 **/
Server['canServe'] = false;

modules['server'] = Server;


    
    
    
    
    
    /** section: Core API
     * SGF
     *
     * The `SGF` namespace is the single global object that gets exported to
     * the global scope of `Simple Game Framework`'s JavaScript environment.
     *
     * [[SGF.require]] will be the most used throughout your SGF game code.
     **/
    var SGF = new EventEmitter();
    SGF['toString'] = functionReturnString("[object SGF]");
    window['SGF'] = SGF;
    
    //////////////////////////////////////////////////////////////////////
    //////////////////// "SGF" PUBLIC FUNCTIONS //////////////////////////
    //////////////////////////////////////////////////////////////////////
    /**
     * SGF.log(arg1) -> undefined
     *
     * SGF's logging function, which accepts a variable number of arbitrary
     * arguments to log for debugging purposes.
     *
     * The objects passed as arguments will be passed to the SGF Engine's
     * terminal or console (`System.out.print` on the Java Engine,
     * `console.log` for the HTML Engine, for example).
     *
     * The `SGF` namespace itself will also emit a `log` event, for game code
     * too optionally hook into.
     **/
    function log() {
        var args = arguments, cnsl = window['console'];
        if (cnsl && cnsl['log']) {
            // Function.prototype.apply.call is necessary for IE, which
            // doesn't support console.log.apply. 
            Function.prototype.apply.call(cnsl['log'], cnsl, args);
        }
        // Optionally listen for 'log' events from the SGF object, which you
        // could then write to a <textarea> or something for a custom debug
        // panel.
        SGF['emit']("log", args);
    }
    SGF['log'] = log;

    /**
     * SGF.inherits(constructor, superConstructor) -> undefined
     * - constructor (Function): A "constructor" Function that will inherit
     *                           from `superConstructor`.
     * - superConstructor (Function): A "constructor" Function that
     *                               `constructor` will inherit from.
     *
     * Convienience function to make a "constructor" Function's `prototype`
     * inherit from another "constructor" function.
     * 
     * In other words, after calling this:
     *
     *     (new constructor) instanceof superConstructor
     *         // true
     **/
    SGF['inherits'] = inherits;
    
    /**
     * SGF.require(moduleName) -> Object
     * - moduleName (String): The name of the internal SGF module that is
     *                        attempted to be imported. Module names are
     *                        case-insensitive.
     *  
     * All of SGF's classes are hidden by default, to avoid unnecessary
     * variable leakage into the global scope. In order to get access to one,
     * it must first be "_imported_" via `SGF.require`.
     *  
     *     var component = SGF.require("component");
     **/
    function require(moduleName) {
        if (typeof moduleName == "string") {
            moduleName = String(moduleName).toLowerCase();
            if (moduleName in modules) {
                return modules[moduleName];                
            }
            throw new Error("SGF.require: module name '" + moduleName + "' does not exist");
        }
        throw new Error("SGF.require: expected argument typeof 'string', got '" + (typeof moduleName) + "'");
    }
    SGF['require'] = require;
    
    function startWithDiv(gameSrc, screen) {
        return new modules['game'](gameSrc, $(screen));
    }
    SGF['startWithDiv'] = startWithDiv;

    function startFullScreen(gameSrc) {
        return startWithDiv(gameSrc, document['body']);
    }
    SGF['startFullScreen'] = startFullScreen;



    

    // Attempts to retrieve the absolute path of the executing script.
    // Pass a function as 'callback' which will be executed once the
    // URL is known, with the first argument being the string URL.
    function getScriptName(callback) {
        try {
            (0)();
        } catch (ex) {
            // Getting the URL of the exception is non-standard, and
            // different in EVERY browser unfortunately.
            if (ex['fileName']) { // Firefox
                callback(ex['fileName']);
            } else if (ex['sourceURL']) { // Safari
                callback(ex['sourceURL']);
            } else if (ex['arguments']) { // V8 (Chrome)
                var originalPrepareStackTrace = Error['prepareStackTrace'];
                Error['prepareStackTrace'] = function(error, structuredStackTrace) {
                    return structuredStackTrace[1]['getFileName']();
                }
                var stack = ex['stack'];
                Error['prepareStackTrace'] = originalPrepareStackTrace;
                callback(stack);

            } else if (ex['stack']) { // Opera 10
                var s = ex['stack'];
                s = s.split("\n")[0];
                s = s.substring(s.indexOf("@")+1);
                callback(s.substring(0, s.lastIndexOf(":")));

            } else { // Internet Explorer 8+
                var origOnError = window['onerror'];
                window['onerror'] = function(msg, url){
                    window['onerror'] = origOnError;
                    callback(url);
                    return true;
                }
                throw ex;
            }
        }
    }
    
    // Attempts to retrieve a reference to the currently executing
    // DOM node. The node can then be inspected for any user-given
    // runtime arguments (data-* attributes) on the <script>.
    function getScript(scriptName) {
        var scripts = document.getElementsByTagName("script"),
            length = scripts.length,
            script = document.getElementById("SGF-script");
        
        if (script) return script;
        
        while (length--) {
            script = scripts[length];
            if (script['src'] === scriptName) {
                return script;
            }
        }
        
        throw new Error('FATAL: Could not find <script> node with "src" === "'+scriptName+'"\n'
            + 'Please report this to the SGF issue tracker. You can work around this error by '
            + 'explicitly setting the "id" of the <script> node to "SGF-script".');
    }

    // Looks through the script node and extracts any 'data-*'
    // user parameters to use, and adds them to the 'params' var.
    function getParams(scriptNode) {
        var length = scriptNode.attributes.length;
        while (length--) {
            var name = scriptNode.attributes[length].nodeName;
            if (name.indexOf("data-") === 0) {
                params[name.substring(5)] = scriptNode.getAttribute(name);
            }
        }
    }


    //////////////////////////////////////////////////////////////////////
    ///////////////////// "LIBRARY" FUNCTIONS ////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // Called repeadedly after each library file is loaded. Checks to see
    // if all required libraries have been loaded, and if so begins the next
    // stage of initializing SGF.
    function libraryLoaded(e) {
        var ready = isPrototypeLoaded()
                &&  isSwfObjectLoaded()
                &&  isSoundJsLoaded()
                &&  hasWebSocket();
        if (ready) {
            allLibrariesLoaded();
        }
    }

    // Returns true if Prototype, AT LEAST version 1.6.1, is loaded, false
    // otherwise.
    function isPrototypeLoaded() {
        var proto = "Prototype", isLoaded = false;
        if (proto in window) {
            var mainVersion = parseFloat(window[proto]['Version'].substring(0,3));
            if (mainVersion > 1.6 || (mainVersion == 1.6 && parseInt(window[proto]['Version'].charAt(4)) >= 1)) {
                isLoaded = true;
            }
        }
        return isLoaded;
    }
    
    // Called once Prototype (v1.6.1 or better) is assured loaded
    function prototypeLoaded() {
        libraryLoaded();
    }
    
    // Returns true if Sound.js is loaded, false otherwise.
    function isSoundJsLoaded() {
        return "Sound" in window && "SoundChannel" in window;
    }
    
    function soundJsLoaded() {
        window['Sound']['swfPath'] = makeFullyQualified(params['soundjs-swf']);
        debug("Setting SoundJS SWF Path: " + window['Sound']['swfPath']);
        libraryLoaded();
    }
    
    // Returns true if SWFObject, at least version 2.2, is loaded, false otherwise.
    function isSwfObjectLoaded() {
        var swfobject = 'swfobject', embedSWF = 'embedSWF';
        return swfobject in window && embedSWF in window[swfobject];
    }
    
    // Called once SWFObject (v2.2 or better) is assured loaded
    function swfObjectLoaded() {
        // Load Sound.js
        if (isSoundJsLoaded()) {
            soundJsLoaded();
        } else {
            new Script(makeFullyQualified(params['soundjs']), soundJsLoaded);
        }
        
        // Load gimite's Flash WebSocket implementation (only if required)
        if (!hasWebSocket()) {
            new Script(makeFullyQualified(params['fabridge']), function() {
                new Script(makeFullyQualified(params['websocket']), flashWebSocketLoaded);
            });
        }
    }
    
    function hasWebSocket() {
        return 'WebSocket' in window;
    }
    
    function flashWebSocketLoaded() {
        window['WebSocket']['__swfLocation'] = makeFullyQualified(params['websocket-swf']);
        window['WebSocket']['__initialize']();
        libraryLoaded();
    }


    //////////////////////////////////////////////////////////////////////
    ///////////////////// "UTILITY" FUNCTIONS ////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // Borrowed respectfully from Prototype
    // TODO: Make public? "SGF.extend"?
    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }
    
    // Returns a clone of the array
    function arrayClone(array) {
        return slice.call(array, 0);
    }
    
    // Array Remove - By John Resig (MIT Licensed)
    function arrayRemove(array, from, to) {
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }

    // Tests if the given path is fully qualified or relative.
    //    TODO: Replace this with a nice regexp.
    function isFullyQualified(path) {
        return path.substring(0,7) == "http://"
            || path.substring(0,8) == "https://"
            || path.substring(0,7) == "file://";
    }
    
    function makeFullyQualified(path) {
        return isFullyQualified(path) ? path : engineRoot + path;
    }
    
    // Performs the necessary operations to make a regular JavaScript
    // constructor Function compatible with Prototype's Class implementation.
    function makePrototypeClassCompatible(classRef) {
        classRef.prototype['initialize'] = classRef;
        classRef['subclasses'] = [];
    }
    
    
    function functionBind(funcRef, context) {
        return function() {
            return funcRef.apply(context, arguments);
        }
    }

    // Returns a new Function that returns the value passed into the function
    // Used for the 'toString' implementations.
    function functionReturnString(string) {
        return function() {
            return string;
        }
    }
    
    // Returns a function that returns the name of the property specified on 'this'
    function returnThisProp(prop) {
        return function() {
            return this[prop];
        }
    }
    
    // Same as SGF.log, but not public, and only actually outputs anything
    // when the 'debug' param is present on the <script> node.
    function debug() {
        if (!!params['debug']) {
            log.apply(SGF, arguments);
        }
    }

    //////////////////////////////////////////////////////////////////////
    ////////////////////// "EVENT" FUNCTIONS /////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // Called as an 'event' (possibly asynchronously) once the absolute
    // URL of the executing JavaScript file is known.
    function scriptNameKnown(n) {
        scriptName = n;
        engineRoot = scriptName.substring(0, scriptName.lastIndexOf("/")+1);
        scriptNode = getScript(scriptName);
        getParams(scriptNode);
        
        // The first real matter of buisness: load dependant libraries
        if (isPrototypeLoaded()) {
            prototypeLoaded();
        } else {
            new Script(makeFullyQualified(params['prototype']), prototypeLoaded);
        }
        if (isSwfObjectLoaded()) {
            swfObjectLoaded();
        } else {
            new Script(makeFullyQualified(params['swfobject']), swfObjectLoaded);
        }
        
    }

    // Called as an 'event' (asynchronously) once all the required library
    // files have finished their loading process. Once this happens, we can
    // define all the SGF classes, and afterwards invoke the 'load' listeners.
    function allLibrariesLoaded() {
        debug("All dependant libraries loaded!");
                
        Input['grab']();
        
        sgfLoaded();
    }
    
    // Called as an 'event' when the SGF engine has finished initializing.
    // At this point, export stuff from the closure to the global scope,
    // then check for the existence of a 'game' or 'game'&'screen' param
    // on the <script> node to begin autoplaying.
    function sgfLoaded() {

        var loadEndTime = new Date();
        debug("Load Time: "+(loadEndTime.getTime() - loadStartTime.getTime())+" ms");

        if (params['game']) {
            if (params['screen']) {
                startWithDiv(params['game'], params['screen']);
            } else {
                startFullScreen(params['game']);
            }
        }
        
    }

    


    //// Start things off... /////////////////////////////////////////////
    getScriptName(scriptNameKnown);

})(this, document);
