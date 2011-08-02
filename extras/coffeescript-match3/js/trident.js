/*
 * Copyright (c) 2005-2010 Trident Kirill Grouchnikov. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  o Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 *  o Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *  o Neither the name of Trident Kirill Grouchnikov nor the names of
 *    its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
/*
 * Spline ease and key frames are based on the BSD-licensed code from <a
 * href="https://timingframework.dev.java.net">TimingFramework</a> by Chet Haase
 * and Romain Guy.
 *
 * Some of the ease classes are based on the MIT-licensed code from
 * <a href="http://github.com/sole/tween.js">Tween.js</a> by Soledad Penadés.
 */
var lastTime = new Date().getTime();

var timelineId = 0;
var timelineScenarioId = 0;

var TimelineState = {"IDLE":"IDLE", "READY":"READY", 
  "PLAYING_FORWARD":"PLAYING_FORWARD", "PLAYING_REVERSE":"PLAYING_REVERSE", 
  "SUSPENDED":"SUSPENDED", "CANCELLED":"CANCELLED", "DONE":"DONE"};

var TimelineScenarioState = {"IDLE":"IDLE", "PLAYING":"PLAYING", 
  "SUSPENDED":"SUSPENDED", "DONE":"DONE"};

var RepeatBehavior = {"LOOP":"LOOP", "REVERSE":"REVERSE"};

/**
 * Interpolators
 */
function RGBPropertyInterpolator() {
  var interpolateSingle = function(from, to, at) {
    var intFrom = parseInt(from);
    var intTo = parseInt(to);
    return parseInt(parseFloat(intFrom + at * (intTo - intFrom)));
  }

  this.interpolate = function(from, to, timelinePosition) {
    var fromParts = from.substring(4,from.length-1).split(',');
    var toParts = to.substring(4,to.length-1).split(',');
    var red = interpolateSingle(fromParts[0], toParts[0], timelinePosition);
    var green = interpolateSingle(fromParts[1], toParts[1], timelinePosition);
    var blue = interpolateSingle(fromParts[2], toParts[2], timelinePosition);
    return "rgb(" + red + "," + green + "," + blue + ")";
  }
}

function IntPropertyInterpolator() {
  this.interpolate = function(from, to, timelinePosition) {
    return parseInt(parseFloat(from + (to - from) * timelinePosition));
  }
}

function FloatPropertyInterpolator() {
  this.interpolate = function(from, to, timelinePosition) {
    var fFrom = parseFloat(from);
    var fTo = parseFloat(to);
    return parseFloat(fFrom + (fTo - fFrom) * timelinePosition);
  }
}

/**
 * Ease
 */
function LinearEase() {
  this.map = function(durationFraction) {
    return durationFraction;
  }
}

function SineEase() {
  this.map = function(durationFraction) {
    return Math.sin(durationFraction * Math.PI / 2);
  }
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function LengthItem(len, t) {
  this.len = len;
  this.t = t;
  this.fraction = 0;

  this.setFraction = function(totalLength) {
    this.fraction = this.len / totalLength;
  }
}

function SplineEase(x1, y1, x2, y2) {
  if (x1 < 0 || x1 > 1.0 || y1 < 0 || y1 > 1.0 || x2 < 0 || x2 > 1.0
    || y2 < 0 || y2 > 1.0) {
      throw "Control points must be in the range [0, 1]";
  }

  // Note: (x0,y0) and (x1,y1) are implicitly (0, 0) and (1,1) respectively
  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;
  this.lengths = new Array();

  /**
  * Calculates the XY point for a given t value.
  * 
  * The general spline equation is: x = b0*x0 + b1*x1 + b2*x2 + b3*x3 y =
  * b0*y0 + b1*y1 + b2*y2 + b3*y3 where: b0 = (1-t)^3 b1 = 3 * t * (1-t)^2 b2
  * = 3 * t^2 * (1-t) b3 = t^3 We know that (x0,y0) == (0,0) and (x1,y1) ==
  * (1,1) for our splines, so this simplifies to: x = b1*x1 + b2*x2 + b3 y =
  * b1*x1 + b2*x2 + b3
  * 
  * @param t
  *            parametric value for spline calculation
  */
  this.__getXY = function(t) {
    var xy;
    var invT = (1 - t);
    var b1 = 3 * t * (invT * invT);
    var b2 = 3 * (t * t) * invT;
    var b3 = t * t * t;
    xy = new Point((b1 * x1) + (b2 * x2) + b3, (b1 * y1) + (b2 * y2) + b3);
    return xy;
  }

  /**
  * Utility function: When we are evaluating the spline, we only care about
  * the Y values. See {@link getXY getXY} for the details.
  */
  this.__getY = function(t) {
    var invT = (1 - t);
    var b1 = 3 * t * (invT * invT);
    var b2 = 3 * (t * t) * invT;
    var b3 = t * t * t;
    return (b1 * y1) + (b2 * y2) + b3;
  }

  /**
  * Given a fraction of time along the spline (which we can interpret as the
  * length along a spline), return the interpolated value of the spline. We
  * first calculate the t value for the length (by doing a lookup in our
  * array of previousloy calculated values and then linearly interpolating
  * between the nearest values) and then calculate the Y value for this t.
  * 
  * @param lengthFraction
  *            Fraction of time in a given time interval.
  * @return interpolated fraction between 0 and 1
  */
  this.map = function(lengthFraction) {
    var interpolatedT = 1.0;
    var prevT = 0.0;
    var prevLength = 0.0;
    for (var i = 0; i < this.lengths.length; ++i) {
      var lengthItem = this.lengths[i];
      var fraction = lengthItem.fraction;
      var t = lengthItem.t;
      if (lengthFraction <= fraction) {
        // answer lies between last item and this one
        var proportion = (lengthFraction - prevLength) / (fraction - prevLength);
        interpolatedT = prevT + proportion * (t - prevT);
        return this.__getY(interpolatedT);
      }
      prevLength = fraction;
      prevT = t;
    }
    return this.__getY(interpolatedT);
  }

  // Now contruct the array of all lengths to t in [0, 1.0]
  var prevX = 0.0;
  var prevY = 0.0;
  var prevLength = 0.0; // cumulative length
  for (var t = 0.01; t <= 1.0; t += .01) {
    var xy = this.__getXY(t);
    var length = prevLength
      + Math.sqrt((xy.x - prevX) * (xy.x - prevX)
      + (xy.y - prevY) * (xy.y - prevY));
    var lengthItem = new LengthItem(length, t);
    this.lengths[this.lengths.length] = lengthItem;
    prevLength = length;
    prevX = xy.x;
    prevY = xy.y;
  }
  // Now calculate the fractions so that we can access the lengths
  // array with values in [0,1]. prevLength now holds the total
  // length of the spline.
  for (var i = 0; i < this.lengths.length; ++i) {
    var lengthItem = this.lengths[i];
    lengthItem.setFraction(prevLength);
  }
}

function QuadraticEaseIn() {
  this.map = function(durationFraction) {
    return durationFraction * durationFraction;
  }
}

function QuadraticEaseOut() {
  this.map = function(durationFraction) {
    return -durationFraction * (durationFraction - 2);
  }
}

function QuadraticEaseInOut() {
  this.map = function(durationFraction) {
    if ((durationFraction *= 2) < 1) {
      return 0.5 * durationFraction *durationFraction;
    }
    return - 0.5 * (--durationFraction * (durationFraction - 2) - 1);
  }
}

function CubicEaseIn() {
  this.map = function(durationFraction) {
    return durationFraction * durationFraction * durationFraction;
  }
}

function CubicEaseOut() {
  this.map = function(durationFraction) {
    return --durationFraction * durationFraction * durationFraction + 1;
  }
}

function CubicEaseInOut() {
  this.map = function(durationFraction) {
    if ( (durationFraction *= 2) < 1 ) {
      return 0.5 * durationFraction * durationFraction * durationFraction;
    }
    return 0.5 * ((durationFraction -= 2) * durationFraction * durationFraction + 2 );
  }
}

function QuarticEaseIn() {
  this.map = function(durationFraction) {
    return durationFraction * durationFraction * durationFraction * durationFraction;
  }
}

function QuarticEaseOut() {
  this.map = function(durationFraction) {
    return -(--durationFraction * durationFraction * durationFraction * durationFraction - 1 );
  }
}

function QuarticEaseInOut() {
  this.map = function(durationFraction) {
    if ((durationFraction *= 2) < 1) {
      return 0.5 * durationFraction * durationFraction * durationFraction * durationFraction;
    }
    return -0.5 * ((durationFraction -= 2) * durationFraction * durationFraction * durationFraction - 2);
  }
}

function SinusoidalEaseIn() {
  this.map = function(durationFraction) {
    return - Math.cos(durationFraction * Math.PI / 2) + 1;
  }
}

function SinusoidalEaseOut() {
  this.map = function(durationFraction) {
    return Math.sin(durationFraction * Math.PI / 2);
  }
}

function SinusoidalEaseInOut() {
  this.map = function(durationFraction) {
    return -0.5 * (Math.cos(Math.PI * durationFraction) - 1);
  }
}

function ExponentialEaseIn() {
  this.map = function(durationFraction) {
    return durationFraction == 0 ? 0 : Math.pow(2, 10 * (durationFraction - 1));
  }
}

function ExponentialEaseOut() {
  this.map = function(durationFraction) {
    return durationFraction == 1 ? 1 : -Math.pow(2, - 10 * durationFraction) + 1;
  }
}

function ExponentialEaseInOut() {
  this.map = function(durationFraction) {
    if (durationFraction == 0) {
      return 0;
    }
    if (durationFraction == 1) {
      return 1;
    }
    if ((durationFraction *= 2) < 1) {
      return 0.5 * Math.pow(2, 10 * (durationFraction - 1));
    }
    return 0.5 * (-Math.pow(2, -10 * (durationFraction - 1)) + 2);
  }
}

function CircularEaseIn() {
  this.map = function(durationFraction) {
    return -(Math.sqrt(1 - durationFraction * durationFraction) - 1);
  }
}

function CircularEaseOut() {
  this.map = function(durationFraction) {
    return Math.sqrt(1 - --durationFraction * durationFraction);
  }
}

function CircularEaseInOut() {
  this.map = function(durationFraction) {
    if ((durationFraction /= 0.5) < 1) {
      return -0.5 * (Math.sqrt(1 - durationFraction * durationFraction) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (durationFraction -= 2) * durationFraction) + 1);
  }
}

function ElasticEaseIn() {
  this.map = function(durationFraction) {
    var s, a = 0.1, p = 0.4;
    if (durationFraction == 0) {
      return 0;
    } 
    if (durationFraction == 1) {
      return 1;
    } 
    if (!p) {
      p = 0.3;
    }
    if (!a || a < 1) { 
      a = 1; 
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    return -(a * Math.pow(2, 10 * (durationFraction -= 1)) * Math.sin((durationFraction - s) * (2 * Math.PI) / p));
  }
}

function ElasticEaseOut() {
  this.map = function(durationFraction) {
    var s, a = 0.1, p = 0.4;
    if (durationFraction == 0) {
      return 0; 
    }
    if (durationFraction == 1) {
      return 1; 
    }
    if (!p) {
      p = 0.3;
    }
    if (!a || a < 1) { 
      a = 1; 
      s = p / 4; 
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    return (a * Math.pow(2, - 10 * durationFraction) * Math.sin((durationFraction - s) * (2 * Math.PI) / p) + 1);
  }
}

function ElasticEaseInOut() {
  this.map = function(durationFraction) {
    var s, a = 0.1, p = 0.4;
    if (durationFraction == 0) {
      return 0; 
    }
    if (durationFraction == 1) {
      return 1;
    } 
    if (!p) {
      p = 0.3;
    }
    if (!a || a < 1) { 
      a = 1; 
      s = p / 4; 
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    if ((durationFraction *= 2) < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (durationFraction -= 1)) * Math.sin((durationFraction - s) * (2 * Math.PI) / p));
    }
    return a * Math.pow(2, -10 * (durationFraction -= 1)) * Math.sin((durationFraction - s) * (2 * Math.PI) / p) * 0.5 + 1;
  }
}

function BackEaseIn() {
  this.map = function(durationFraction) {
    var s = 1.70158;
    return durationFraction * durationFraction * ((s + 1) * durationFraction - s);
  }
}

function BackEaseOut() {
  this.map = function(durationFraction) {
    var s = 1.70158;
    return (durationFraction = durationFraction - 1) * durationFraction * ((s + 1) * durationFraction + s) + 1;
  }
}

function BackEaseInOut() {
  this.map = function(durationFraction) {
    var s = 1.70158 * 1.525;
    if ((durationFraction *= 2) < 1) {
      return 0.5 * (durationFraction * durationFraction * ((s + 1) * durationFraction - s));
    }
    return 0.5 * ((durationFraction -= 2 ) * durationFraction * ((s + 1) * durationFraction + s) + 2);
  }
}

function BounceEaseIn() {
  this.bo = new BounceEaseOut();
  this.map = function(durationFraction) {
    return 1 - this.bo.map(1 - durationFraction);
  }
}

function BounceEaseOut() {
  this.map = function(durationFraction) {
    if ((durationFraction /= 1) < (1 / 2.75)) {
      return 7.5625 * durationFraction * durationFraction;
    } else if (durationFraction < (2 / 2.75)) {
      return 7.5625 * (durationFraction -= (1.5 / 2.75)) * durationFraction + 0.75;
    } else if (durationFraction < (2.5 / 2.75)) {
      return 7.5625 * (durationFraction -= (2.25 / 2.75)) * durationFraction + 0.9375;
    } else {
      return 7.5625 * (durationFraction -= (2.625 / 2.75)) * durationFraction + 0.984375;
    } 
  }
}

function BounceEaseInOut() {
  this.bi = new BounceEaseIn();
  this.bo = new BounceEaseOut();

  this.map = function(durationFraction) {
    if (durationFraction < 0.5) {
      return this.bi.map(durationFraction * 2) * 0.5;
    }
    return this.bo.map(durationFraction * 2 - 1) * 0.5 + 0.5;
  }
}

/**
 * Key frames
 */
function KeyEases(numIntervals, eases) {
  this.eases = new Array();

  if (eases == undefined || eases[0] == undefined) {
    for (var i = 0; i < numIntervals; ++i) {
      this.eases[this.eases.length] = new LinearEase();
    }
  } else if (eases.length < numIntervals) {
    for (var i = 0; i < numIntervals; ++i) {
      this.eases[this.eases.length] = eases[0];
    }
  } else {
    for (var i = 0; i < numIntervals; ++i) {
      this.eases[this.eases.length] = eases[i];
    }
  }

  this.interpolate = function(interval, fraction) {
      return this.eases[interval].map(fraction);
  }
}

function KeyTimes(times) {
  this.times = new Array();

  if (times[0] != 0) {
    throw "First time value must be zero";
  }
  if (times[times.length - 1] != 1) {
    throw "Last time value must be one";
  }
  var prevTime = 0;
  for (var i=0; i<times.length; i++) {
    var time = times[i];
    if (time < prevTime) {
      throw "Time values must be in increasing order";
    }
    this.times[this.times.length] = time;
    prevTime = time;
  }

  this.getInterval = function(fraction) {
    var prevIndex = 0;
    for (var i = 1; i < this.times.length; ++i) {
      var time = this.times[i];
      if (time >= fraction) { 
        // inclusive of start time at next interval.  So fraction==1
        // will return the final interval (times.size() - 1)
        return prevIndex;
      }
      prevIndex = i;
    }
    return prevIndex;
  }

  this.getTime = function(index) {
    return this.times[index];
  }
}

function KeyValues(propertyInterpolator, params) {
  this.values = new Array();
  this.propertyInterpolator = propertyInterpolator;
  this.startValue;

  if (params == undefined) {
    throw "params array cannot be null";
  } else if (params.length == 0) {
    throw "params array must have at least one element";
  }
  if (params.length == 1) {
    // this is a "to" animation; set first element to null
    this.values[this.values.length] = undefined;
  }
  for (var i=0; i<params.length; i++) {
    this.values[this.values.length] = params[i];
  }

  this.getSize = function() {
    return values.length;
  }

  this.setStartValue = function(startValue) {
    if (this.isToAnimation()) {
      this.startValue = startValue;
    }
  }

  this.isToAnimation = function() {
    return (values.get(0) == undefined);
  }

  this.getValue = function(i0, i1, fraction) {
    var value;
    var lowerValue = this.values[i0];
    if (lowerValue == undefined) {
      // "to" animation
      lowerValue = startValue;
    }
    if (i0 == i1) {
      // trivial case
      value = lowerValue;
    } else {
      var v0 = lowerValue;
      var v1 = this.values[i1];
      value = this.propertyInterpolator.interpolate(v0, v1, fraction);
    }
    return value;
  }
}

function KeyFrames(timeValueMap, propertyInterpolator, ease) {
  this.keyValues;
  this.keyTimes;
  this.eases;

  this.__init = function(timeValueMap, propertyInterpolator, eases) {
    var __keyValues = new Array();
    var __keyTimes = new Array();
    for (var keyTime in timeValueMap) {
      __keyTimes[__keyTimes.length] = keyTime;
    }
    __keyTimes.sort();
    for (var i=0; i<__keyTimes.length; i++) {
      var k = __keyTimes[i];
      var v = timeValueMap[k];
      __keyValues[__keyValues.length] = v;
    }
    var numFrames = __keyValues.length;
    this.keyTimes = new KeyTimes(__keyTimes);
    this.keyValues = new KeyValues(propertyInterpolator, __keyValues);
    this.eases = new KeyEases(numFrames - 1, eases);
  }

  this.getKeyValues = function() {
    return this.keyValues;
  }

  this.getKeyTimes = function() {
    return this.keyTimes;
  }

  this.getInterval = function(fraction) {
    return this.keyTimes.getInterval(fraction);
  }

  this.getValue = function(fraction) {
    // First, figure out the real fraction to use, given the
    // interpolation type and keyTimes
    var interval = this.getInterval(fraction);
    var t0 = this.keyTimes.getTime(interval);
    var t1 = this.keyTimes.getTime(interval + 1);
    var t = (fraction - t0) / (t1 - t0);
    var interpolatedT = this.eases.interpolate(interval, t);
    // clamp to avoid problems with buggy interpolators
    if (interpolatedT < 0) {
      interpolatedT = 0;
    } else if (interpolatedT > 1) {
      interpolatedT = 1;
    }
    return this.keyValues.getValue(interval, (interval + 1), interpolatedT);
  }
  
  this.__init(timeValueMap, propertyInterpolator, [ease]);
}

function PropertyInfo(mainObject, field, from, to, interpolator) {
  this.mainObject = mainObject;
  this.field = field;
  this.from = from;
  this.to = to;
  this.interpolator = interpolator;

  this.updateValue = function(timelinePosition) {
    this.mainObject[field] = interpolator.interpolate(from, to, timelinePosition);
  }
}

function KeyFramesPropertyInfo(mainObject, field, timeValueMap, propertyInterpolator) {
  this.mainObject = mainObject;
  this.field = field;
  this.keyFrames = new KeyFrames(timeValueMap, propertyInterpolator);

  this.updateValue = function(timelinePosition) {
    var value = this.keyFrames.getValue(timelinePosition);
    this.mainObject[field] = value;
  }
}

function EventHandler(eventName, handler) {
  this.eventName = eventName;
  this.handler = handler;
}

function Stack() {
  var elements = new Array;
  var liveCount = 0;

  this.empty = function() {
    return (liveCount == 0);
  }

  this.peek = function() {
    return elements[liveCount-1];
  }

  this.pop = function() {
    var toReturn = this.peek();
    liveCount--;
    delete elements[liveCount];
    return toReturn;
  }

  this.push = function(element) {
    elements[liveCount] = element;
    liveCount++;
  }
}

function Timeline(mainObject) {
  this.durationFraction = 0;
  this.duration = 500;
  this.timeUntilPlay = 0;
  this.initialDelay = 0;
  this.isLooping = false;
  this.timelinePosition = 0;
  this.toCancelAtCycleBreak = false;
  this.ease = new LinearEase();

  this.cycleDelay = 0;
  this.repeatCount = -1;
  this.repeatBehavior;
  this.doneCount = 0;

  var mainObject = mainObject;
  var handlers = new Array;
  var properties = new Array;
  var stateStack = new Stack();
  var id = timelineId++;

  stateStack.push(TimelineState.IDLE);

  this.getMainObject = function() {
    return mainObject;
  }

  var getId = function() {
    return id;
  }

  var getProperties = function() {
    return properties;
  }

  var addProperty = function(property) {
    var currProperties = getProperties();
    currProperties[currProperties.length] = property;
  }

  this.addPropertyToInterpolate = function(field, from, to, interpolator) {
    var propInfo = new PropertyInfo(this.getMainObject(), field, from, to, interpolator);
    addProperty(propInfo);
  }

  this.addPropertiesToInterpolate = function(properties) {
    for (var i=0; i<properties.length; i++) {
      var propDefinition = properties[i];
      var propName = propDefinition["property"];
      var interpolator = propDefinition["interpolator"];
      var on = propDefinition["on"];
      if (on == undefined) {
        on = this.getMainObject();
      }

      var keyFrames = propDefinition["goingThrough"];
      if (keyFrames != undefined) {
        var propInfo = new KeyFramesPropertyInfo(on, propName, keyFrames, interpolator);
        addProperty(propInfo);
      } else {
        var from = propDefinition["from"];
        var to = propDefinition["to"];
        var propInfo = new PropertyInfo(on, propName, from, to, interpolator);
        addProperty(propInfo);
      }
    }
  }

  this.addEventListener = function(eventName, handler) {
    var eh = new EventHandler(eventName, handler);
    handlers[handlers.length] = eh;
  }

  this.getState = function() {
    return stateStack.peek();
  }

  this.__popState = function() {
    return stateStack.pop();
  }

  this.__pushState = function(state) {
    if (state == TimelineState.DONE)
      this.doneCount++;
    stateStack.push(state);
  }

  this.__replaceState = function(state) {
    stateStack.pop();
    this.__pushState(state);
  }
  
  this.isDone = function() {
    return (this.doneCount > 0);
  }

  this.supportsReplay = function() {
    return true;
  }

  this.resetDoneFlag = function() {
    this.doneCount = 0;
  }

  this.__play = function(reset, msToSkip) {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      var oldState = this.getState();
      this.timeUntilPlay = this.initialDelay - msToSkip;
      if (this.timeUntilPlay < 0) {
        this.durationFraction = -this.timeUntilPlay / this.duration;
        this.timelinePosition = this.ease.map(this.durationFraction);
        this.timeUntilPlay = 0;
      } else {
        this.durationFraction = 0;
        this.timelinePosition = 0;
      }
      this.__pushState(TimelineState.PLAYING_FORWARD);
      this.__pushState(TimelineState.READY);
      runningTimelines[getId()] = this;

      this.__callbackCallTimelineStateChanged(oldState);
    } else {
      var oldState = this.getState();
      if (oldState == TimelineState.READY) {
        // the timeline remains READY, but after that it will be
        // PLAYING_FORWARD
        this.__popState();
        this.__replaceState(TimelineState.PLAYING_FORWARD);
        this.__pushState(TimelineState.READY);
      } else {
        // change the timeline state
        this.__replaceState(TimelineState.PLAYING_FORWARD);
        if (oldState != this.getState()) {
          this.__callbackCallTimelineStateChanged(oldState);
        }
      }
      if (reset) {
        this.durationFraction = 0;
        this.timelinePosition = 0;
        this.__callbackCallTimelinePulse();
      }
    }
  }
  
  this.play = function() {
    this.playSkipping(false, 0);
  }

  this.playSkipping = function(msToSkip) {
    if ((this.initialDelay + this.duration) < msToSkip) {
      throw new IllegalArgumentException("Required skip longer than initial delay + duration");
    }
    this.isLooping = false;
    this.__play(false, msToSkip);
  }

  this.replay = function() {
    this.isLooping = false;
    this.__play(true, 0);
  }

  this.__playReverse = function(reset, msToSkip) {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      var oldState = this.getState();
      this.timeUntilPlay = this.initialDelay - msToSkip;
      if (this.timeUntilPlay < 0) {
        this.durationFraction = 1 + this.timeUntilPlay / this.duration;
        this.timelinePosition = this.ease.map(this.durationFraction);
        this.timeUntilPlay = 0;
      } else {
        this.durationFraction = 1;
        this.timelinePosition = 1;
      }
      this.__pushState(TimelineState.PLAYING_REVERSE);
      this.__pushState(TimelineState.READY);
      runningTimelines[getId()] = this;

      this.__callbackCallTimelineStateChanged(oldState);
    } else {
      var oldState = this.getState();
      if (oldState == TimelineState.READY) {
        // the timeline remains READY, but after that it will be
        // PLAYING_REVERSE
        this.__popState();
        this.__replaceState(TimelineState.PLAYING_REVERSE);
        this.__pushState(TimelineState.READY);
      } else {
        // change the timeline state
        this.__replaceState(TimelineState.PLAYING_REVERSE);
        if (oldState != this.getState()) {
          this.__callbackCallTimelineStateChanged(oldState);
        }
      }
      if (reset) {
        this.durationFraction = 1;
        this.timelinePosition = 1;
        this.__callbackCallTimelinePulse();
      }
    }
  }

  this.playReverse = function() {
    this.playReverseSkipping(false, 0);
  }

  this.playReverseSkipping = function(msToSkip) {
    if ((this.initialDelay + this.duration) < msToSkip) {
      throw "Required skip longer than initial delay + duration";
    }
    this.isLooping = false;
    this.__playReverse(false, msToSkip);
  }

  this.replayReverse = function() {
    this.isLooping = false;
    this.__playReverse(true, 0);
  }

  this.__playLoop = function(msToSkip) {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      var oldState = this.getState();
      this.timeUntilPlay = this.initialDelay - msToSkip;
      if (this.timeUntilPlay < 0) {
        this.durationFraction = -this.timeUntilPlay / this.duration;
        this.timelinePosition = this.ease.map(this.durationFraction);
        this.timeUntilPlay = 0;
      } else {
        this.durationFraction = 0;
        this.timelinePosition = 0;
      }
      this.__pushState(TimelineState.PLAYING_FORWARD);
      this.__pushState(TimelineState.READY);
      this.toCancelAtCycleBreak = false;

      runningTimelines[getId()] = this;
      this.__callbackCallTimelineStateChanged(oldState);
    } else {
      this.toCancelAtCycleBreak = false;
    }
  }

  this.playLoopSkipping = function(loopCount, repeatBehavior, msToSkip) {
    if ((this.initialDelay + this.duration) < msToSkip) {
      throw "Required skip longer than initial delay + duration";
    }
    this.isLooping = true;
    this.repeatCount = loopCount;
    this.repeatBehavior = repeatBehavior;
    this.__playLoop(msToSkip);
  }
  
  this.playInfiniteLoop = function(repeatBehavior) {
    this.playLoop(-1, repeatBehavior);
  }

  this.playInfiniteLoopSkipping = function(repeatBehavior, msToSkip) {
    this.playLoopSkipping(-1, repeatBehavior, msToSkip);
  }

  this.playLoop = function(loopCount, repeatBehavior) {
    this.playLoopSkipping(loopCount, repeatBehavior, 0);
  }

  this.cancelAtCycleBreak = function() {
    this.toCancelAtCycleBreak = true;
  }

  this.cancel = function() {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      return;
    }
    delete runningTimelines[getId()];
    var oldState = this.getState();
    while (this.getState() != TimelineState.IDLE) {
      this.__popState();
    }
    this.__pushState(TimelineState.CANCELLED);
    this.__callbackCallTimelineStateChanged(oldState);
    this.__popState();
    this.__callbackCallTimelineStateChanged(TimelineState.CANCELLED);
  }

  this.end = function() {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      return;
    }
    delete runningTimelines[getId()];
    var oldState = timeline.getState();
    var endFraction = timeline.durationFraction;
    while (this.getState() != TimelineState.IDLE) {
      var state = this.__popState();
      if (state == TimelineState.PLAYING_FORWARD) {
        endFraction = 1;
      }
      if (state == TimelineState.PLAYING_REVERSE) {
        endFraction = 0;
      }
    }
    this.durationFraction = endFraction;
    this.timelinePosition = endFraction;
    this.__callbackCallTimelinePulse();
    this.__pushState(TimelineState.DONE);
    this.__callbackCallTimelineStateChanged(oldState);
    this.__popState();
    this.__callbackCallTimelineStateChanged(TimelineState.DONE);
  }

  this.abort = function() {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      return;
    }
    delete runningTimelines[getId()];
    while (this.getState() != TimelineState.IDLE) {
      this.__popState();
    }
  }

  this.suspend = function() {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      return;
    }
    var oldState = this.getState();
    if ((oldState != TimelineState.PLAYING_FORWARD)
        && (oldState != TimelineState.PLAYING_REVERSE)
        && (oldState != TimelineState.READY)) {
      return;
    }
    this.__pushState(TimelineState.SUSPENDED);
    this.__callbackCallTimelineStateChanged(oldState);
  }

  this.resume = function() {
    var existing = runningTimelines[getId()];
    if (existing == undefined) {
      return;
    }
    var oldState = this.getState();
    if (oldState != TimelineState.SUSPENDED) {
      return;
    }
    this.__popState();
    this.__callbackCallTimelineStateChanged(oldState);
  }

  this.__callbackCallTimelinePulse = function() {
    this.timelinePosition = this.ease.map(this.durationFraction);

    for (var i=0; i<handlers.length; i++) {
      var eventHandler = handlers[i];
      if (eventHandler.eventName == "onpulse") {
        eventHandler.handler(this, this.durationFraction, this.timelinePosition);
      }
    }
    var properties = getProperties();
    for (var i=0; i<properties.length; i++) {
      properties[i].updateValue(this.timelinePosition);
    }
  }
  
  this.__callbackCallTimelineStateChanged = function(oldState) {
    var currState = this.getState();
    this.timelinePosition = this.ease.map(this.durationFraction);
    for (var i=0; i<handlers.length; i++) {
      var eventHandler = handlers[i];
      if (eventHandler.eventName == "onstatechange") {
        eventHandler.handler(this, oldState, this.getState(), 
          this.durationFraction, this.timelinePosition);
      }
    }
    var properties = getProperties();
    for (var i=0; i<properties.length; i++) {
      properties[i].updateValue(this.timelinePosition);
    }
  }
}

function TimelineScenario() {
  this.waitingActors = new Array();
  this.runningActors = new Array();
  this.doneActors = new Array();
  var mapping = new Array();
  
  this.dependencies = {};
  this.state = undefined;
  this.statePriorToSuspension = undefined;
  this.isLooping = false;
  this.id = timelineScenarioId++;
  
  var handlers = new Array();
  
  this.__checkDependencyParam = function(scenarioActor) {
    if (this.waitingActors.indexOf(scenarioActor) == -1) {
      throw "Must be first added with addScenarioActor() API";
    }
  }
  
  this.__checkDoneActors = function() {
    for (var i=this.runningActors.length-1; i>=0; i--) {
      var stillRunning = this.runningActors[i];
      if (stillRunning.isDone()) {
        this.doneActors[this.doneActors.length] = stillRunning;
        this.runningActors.splice(i, 1);
      }
    }
  }

  this.getReadyActors = function() {
    if (this.state == TimelineScenarioState.SUSPENDED)
      return [];

    this.__checkDoneActors();

    var result = new Array();
    for (var i=this.waitingActors.length - 1; i>=0; i--) {
      var waitingActor = this.waitingActors[i];
      var canRun = true;
      var waitingActorId = mapping.indexOf(waitingActor);
      var toWaitFor = this.dependencies[waitingActorId];
      if (toWaitFor != undefined) {
        for (var j = 0; j < toWaitFor.length; j++) {
          var actorToWaitFor = toWaitFor[j];
          if (this.doneActors.indexOf(actorToWaitFor) == -1) {
            canRun = false;
            break;
          }
        }
      }
      if (canRun) {
        this.runningActors[this.runningActors.length] = waitingActor;
        this.waitingActors.splice(i, 1);
        result[result.length] = waitingActor;
      }
    }

    if ((this.waitingActors.length == 0) && (this.runningActors.length == 0)) {
      if (!this.isLooping) {
        this.state = TimelineScenarioState.DONE;
      } else {
        for (var i = 0; i < this.doneActors.length; i++) {
          var done = this.doneActors[i];
          done.resetDoneFlag();
          this.waitingActors[this.waitingActors.length] = done;
        }
        this.doneActors.length = 0;
      }
    }
    return result;
  }

  this.cancel = function() {
    var oldState = this.state;
    if (oldState != TimelineScenarioState.PLAYING)
      return;
    this.state = TimelineScenarioState.DONE;

    for (var i = 0; i < this.waitingActors.length; i++) {
      var waiting = this.waitingActors[i];
      if (waiting instanceof Timeline) {
        waiting.cancel();
      }
    }
    for (var i = 0; i < this.runningActors.length; i++) {
      var running = this.runningActors[i];
      if (running instanceof Timeline) {
        running.cancel();
      }
    }
  }

  this.suspend = function() {
    var oldState = this.state;
    if (oldState != TimelineScenarioState.PLAYING)
      return;
    this.statePriorToSuspension = oldState;
    this.state = TimelineScenarioState.SUSPENDED;

    for (var i = 0; i < this.runningActors.length; i++) {
      var running = this.runningActors[i];
      if (running instanceof Timeline) {
        running.suspend();
      }
    }
  }

  this.resume = function() {
    var oldState = this.state;
    if (oldState != TimelineScenarioState.SUSPENDED)
      return;
    this.state = this.statePriorToSuspension;

    for (var i = 0; i < this.runningActors.length; i++) {
      var running = this.runningActors[i];
      if (running instanceof Timeline) {
        running.resume();
      }
    }
  }
  
  this.__playScenario = function() {
    runningScenarios[this.id] = this;
    var readyActors = this.getReadyActors();
    for (var i = 0; i < readyActors.length; i++) {
      var readyActor = readyActors[i];
      readyActor.play();
    }
  }

  this.__callbackCallTimelineScenarioEnded = function() {
    for (var i=0; i<handlers.length; i++) {
      var eventHandler = handlers[i];
      if (eventHandler.eventName == "ondone") {
        eventHandler.handler(this);
      }
    }
  }

  this.addEventListener = function(eventName, handler) {
    var eh = new EventHandler(eventName, handler);
    handlers[handlers.length] = eh;
  }

  this.addScenarioActor = function(scenarioActor) {
    if (scenarioActor.isDone()) {
      throw "Already finished";
    }
    this.waitingActors[this.waitingActors.length] = scenarioActor;
    mapping[mapping.length] = scenarioActor;
  }

  this.addDependency = function(actor, waitFor) {
    // check params
    this.__checkDependencyParam(actor);
    for (var i = 0; i < waitFor.length; i++) {
      var wait = waitFor[i];
      this.__checkDependencyParam(wait);
    }

    var actorId = mapping.indexOf(actor);
    if (this.dependencies[actorId] == undefined) {
      this.dependencies[actorId] = new Array();
    }
    var deps = this.dependencies[actorId];
    for (var i = 0; i < waitFor.length; i++) {
      var wait = waitFor[i];
      deps[deps.length] = wait;
  //      alert("Added dependency of " + mapping.indexOf(wait) + " on " + actorId);
    }
  }

  this.play = function() {
    this.isLooping = false;
    this.state = TimelineScenarioState.PLAYING;
    this.__playScenario();
  }

  this.playLoop = function() {
    for (var i = 0; i < this.waitingActors.length; i++) {
      var actor = this.waitingActors[i];
      if (!actor.supportsReplay())
      throw "Can't loop scenario with actor(s) that don't support replay";
    }
    this.isLooping = true;
    this.state = TimelineScenarioState.PLAYING;
    this.__playScenario();
  }
}

var runningTimelines = {};
var runningScenarios = {};

var timerCallbackId = setInterval("globalTimerCallback()", 40);

setPulseRate = function(pulseMsDelay) {
  clearInterval(timerCallbackId);
  timerCallbackId = setInterval("globalTimerCallback()", 20);
}

globalTimerCallback = function() {
  var currTime = new Date().getTime();
  var passedSinceLastIteration = currTime - lastTime;
  var liveTimelines = 0;
  var totalTimelines = 0;
  var liveScenarios = 0;
  var totalScenarios = 0;
  for (var timelineId in runningTimelines) {
    totalTimelines++;
    var timeline = runningTimelines[timelineId];
    var timelineState = timeline.getState();
    
    if (timeline.getState() == TimelineState.SUSPENDED) {
      continue;
    }

    var timelineWasInReadyState = false;
    if (timeline.getState() == TimelineState.READY) {
      if ((timeline.timeUntilPlay - passedSinceLastIteration) > 0) {
        // still needs to wait in the READY state
        timeline.timeUntilPlay -= passedSinceLastIteration;
        continue;
      }

      // can go from READY to PLAYING
      timelineWasInReadyState = true;
      timeline.__popState();
      timeline.__callbackCallTimelineStateChanged(TimelineState.READY);
    }

    var hasEnded = false;
    if (timelineState == TimelineState.PLAYING_FORWARD) {
      if (!timelineWasInReadyState) {
        timeline.durationFraction = timeline.durationFraction
          + passedSinceLastIteration / timeline.duration;
      }
      if (timeline.durationFraction > 1) {
        timeline.durationFraction = 1;
        timeline.timelinePosition = 1;
        if (timeline.isLooping) {
          var stopLoopingAnimation = timeline.toCancelAtCycleBreak;
          var loopsToLive = timeline.repeatCount;
          if (loopsToLive > 0) {
            loopsToLive--;
            stopLoopingAnimation = stopLoopingAnimation || (loopsToLive == 0);
            timeline.repeatCount = loopsToLive;
          }
          if (stopLoopingAnimation) {
            // end looping animation
            hasEnded = true;
          } else {
            if (timeline.repeatBehavior == RepeatBehavior.REVERSE) {
              timeline.__replaceState(TimelineState.PLAYING_REVERSE);
              if (timeline.cycleDelay > 0) {
                timeline.__pushState(TimelineState.READY);
                timeline.timeUntilPlay = timeline.cycleDelay;
              }
              timeline.__callbackCallTimelineStateChanged(TimelineState.PLAYING_FORWARD);
            } else {
              timeline.durationFraction = 0;
              timeline.timelinePosition = 0;
              if (timeline.cycleDelay > 0) {
                timeline.__pushState(TimelineState.READY);
                timeline.timeUntilPlay = timeline.cycleDelay;
                timeline.__callbackCallTimelineStateChanged(TimelineState.PLAYING_FORWARD);
              } else {
                // it's still playing forward, but lets
                // the app code know that the new loop has begun
                timeline.__callbackCallTimelineStateChanged(TimelineState.PLAYING_FORWARD);
              }
            }
          }
        } else {
          hasEnded = true;
        }
      }
      timeline.__callbackCallTimelinePulse();
    }
    if (timelineState == TimelineState.PLAYING_REVERSE) {
      if (!timelineWasInReadyState) {
        timeline.durationFraction = timeline.durationFraction
          - passedSinceLastIteration / timeline.duration;
      }
      if (timeline.durationFraction < 0) {
        timeline.durationFraction = 0;
        timeline.timelinePosition = 0;
        if (timeline.isLooping) {
          var stopLoopingAnimation = timeline.toCancelAtCycleBreak;
          var loopsToLive = timeline.repeatCount;
          if (loopsToLive > 0) {
            loopsToLive--;
            stopLoopingAnimation = stopLoopingAnimation || (loopsToLive == 0);
            timeline.repeatCount = loopsToLive;
          }
          if (stopLoopingAnimation) {
            // end looping animation
            hasEnded = true;
          } else {
            timeline.__replaceState(TimelineState.PLAYING_FORWARD);
            if (timeline.cycleDelay > 0) {
              timeline.__pushState(TimelineState.READY);
              timeline.timeUntilPlay = timeline.cycleDelay;
            }
            timeline.__callbackCallTimelineStateChanged(TimelineState.PLAYING_REVERSE);
          }
        } else {
          hasEnded = true;
        }
      }
      timeline.__callbackCallTimelinePulse();
    }

    if (hasEnded) {
      var oldState = timeline.getState();
      timeline.__replaceState(TimelineState.DONE);
      timeline.__callbackCallTimelineStateChanged(oldState);
      timeline.__popState();
      timeline.__callbackCallTimelineStateChanged(TimelineState.DONE);
      delete runningTimelines[timelineId];
    } else {
      liveTimelines++;
    }
  }
  
  for (var scenarioId in runningScenarios) {
    totalScenarios++;
    var scenario = runningScenarios[scenarioId];
    var scenarioState = scenario.state;
    if (scenarioState == TimelineScenarioState.DONE) {
      delete runningScenarios[scenarioId];
      scenario.__callbackCallTimelineScenarioEnded();
      continue;
    }
    liveScenarios++;
    var readyActors = scenario.getReadyActors();
    if (readyActors.length > 0) {
      for (var i = 0; i < readyActors.length; i++) {
        var readyActor = readyActors[i];
        readyActor.play();
      }
    }
  }
	
  //  document.title = liveTimelines + " live timeline(s) out of " + totalTimelines;
 // document.title = liveScenarios + " live scenario(s) out of " + totalScenarios;
  lastTime = currTime;
}