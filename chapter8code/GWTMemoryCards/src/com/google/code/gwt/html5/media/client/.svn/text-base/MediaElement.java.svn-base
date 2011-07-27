/*
 * Copyright 2009 Mark Renouf
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHDIR
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.code.gwt.html5.media.client;

import com.google.gwt.user.client.Element;

public abstract class MediaElement extends Element {

  protected MediaElement() {
  }

  public final native MediaError getError() /*-{
    return (this.error == null) ? 0 : this.error;
  }-*/;

  public final native String getSrc() /*-{
    return this.getAttribute('src');
  }-*/;

  public final native void setSrc(String url) /*-{
    this.setAttribute('src', url);
  }-*/;

  public final native String getCurrentSrc() /*-{
    return this.currentSrc;
  }-*/;

  public final native int getNetworkState() /*-{
    return this.networkState;
  }-*/;

  public final native void setAutobuffer(boolean autobuffer) /*-{
    this.autobuffer = autobuffer;
  }-*/;

  public final native TimeRanges getBuffered() /*-{
    return this.buffered;
  }-*/;

  public final native void load() /*-{
    this.load();
  }-*/;

  public final native String canPlayType(String type) /*-{
    return this.canPlayType(type);
  }-*/;

  public final native int getReadyState() /*-{
    return this.readyState;
  }-*/;

  public final native boolean isSeeking() /*-{
    return media.seeking;
  }-*/;

  public final native double getCurrentTime() /*-{
    return this.currentTime;
  }-*/;

  public final native void setCurrentTime(double time) /*-{
    this.currentTime = time;
  }-*/;

  public final native double getStartTime() /*-{
    return this.startTime;
  }-*/;

  public final native double getDuration() /*-{
    return this.duration;
  }-*/;

  public final native boolean isPaused() /*-{
    return this.paused;
  }-*/;

  public final native double getDefaultPlaybackRate() /*-{
    return this.defaultPlaybackRate;
  }-*/;

  public final native void setDefaultPlaybackRate(double rate) /*-{
    this.defaultPlaybackRate = rate;
  }-*/;

  public final native double getPlaybackRate() /*-{
    return this.playbackRate;
  }-*/;

  public final native void setPlaybackRate(double rate) /*-{
    this.playbackRate = rate;
  }-*/;

  public final native TimeRanges getPlayed() /*-{
    return this.played;
  }-*/;

  public final native TimeRanges getSeekable() /*-{
    return this.seekable;
  }-*/;

  public final native boolean hasEnded() /*-{
    return this.ended;
  }-*/;

  public final native void setAutoplay(boolean autoplay) /*-{
    this.autoplay = autoplay;
  }-*/;

  public final native void setLoop(boolean loop) /*-{
    this.loop = loop;
  }-*/;

  public final native boolean isLoop() /*-{
    return !!(this.loop);
  }-*/;

  public final native void play() /*-{
    this.play();
  }-*/;

  public final native void pause() /*-{
    this.pause();
  }-*/;

  public final void setControls(boolean controls) {
    setBooleanAttr("controls", controls);
  }

  public final native double getVolume() /*-{
    return this.volume;
  }-*/;

  public final native void setVolume(double volume) /*-{
    this.volume = volume
  }-*/;

  public final native boolean isMuted() /*-{
    return this.muted;
  }-*/;

  public final native void setMute(boolean muted) /*-{
    this.muted = muted;
  }-*/;

  private void setBooleanAttr(String name, boolean value) {
    if (value)
      setAttribute(name, "");
    else
      removeAttribute(name);
  }

  public final native boolean hasControls() /*-{
    return !!(elem.getAttribute('controls'));
  }-*/;
}
