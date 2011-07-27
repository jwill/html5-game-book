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

import com.google.code.gwt.html5.media.client.event.AbortEvent;
import com.google.code.gwt.html5.media.client.event.AbortHandler;
import com.google.code.gwt.html5.media.client.event.CanPlayEvent;
import com.google.code.gwt.html5.media.client.event.CanPlayHandler;
import com.google.code.gwt.html5.media.client.event.CanPlayThroughEvent;
import com.google.code.gwt.html5.media.client.event.CanPlayThroughHandler;
import com.google.code.gwt.html5.media.client.event.DurationChangeEvent;
import com.google.code.gwt.html5.media.client.event.DurationChangeHandler;
import com.google.code.gwt.html5.media.client.event.EmptiedEvent;
import com.google.code.gwt.html5.media.client.event.EmptiedHandler;
import com.google.code.gwt.html5.media.client.event.EndedEvent;
import com.google.code.gwt.html5.media.client.event.EndedHandler;
import com.google.code.gwt.html5.media.client.event.ErrorEvent;
import com.google.code.gwt.html5.media.client.event.ErrorHandler;
import com.google.code.gwt.html5.media.client.event.HasAbortHandlers;
import com.google.code.gwt.html5.media.client.event.HasCanPlayHandlers;
import com.google.code.gwt.html5.media.client.event.HasCanPlayThroughHandlers;
import com.google.code.gwt.html5.media.client.event.HasDurationChangeHandlers;
import com.google.code.gwt.html5.media.client.event.HasEmptiedHandlers;
import com.google.code.gwt.html5.media.client.event.HasEndedHandlers;
import com.google.code.gwt.html5.media.client.event.HasErrorHandlers;
import com.google.code.gwt.html5.media.client.event.HasLoadStartHandlers;
import com.google.code.gwt.html5.media.client.event.HasLoadedDataHandlers;
import com.google.code.gwt.html5.media.client.event.HasLoadedMetadataHandlers;
import com.google.code.gwt.html5.media.client.event.HasPauseHandlers;
import com.google.code.gwt.html5.media.client.event.HasPlayHandlers;
import com.google.code.gwt.html5.media.client.event.HasPlayingHandlers;
import com.google.code.gwt.html5.media.client.event.HasProgressHandlers;
import com.google.code.gwt.html5.media.client.event.HasRateChangeHandlers;
import com.google.code.gwt.html5.media.client.event.HasSeekedHandlers;
import com.google.code.gwt.html5.media.client.event.HasSeekingHandlers;
import com.google.code.gwt.html5.media.client.event.HasStalledHandlers;
import com.google.code.gwt.html5.media.client.event.HasSuspendHandlers;
import com.google.code.gwt.html5.media.client.event.HasTimeUpdateHandlers;
import com.google.code.gwt.html5.media.client.event.HasVolumeChangeHandlers;
import com.google.code.gwt.html5.media.client.event.HasWaitingHandlers;
import com.google.code.gwt.html5.media.client.event.LoadStartEvent;
import com.google.code.gwt.html5.media.client.event.LoadStartHandler;
import com.google.code.gwt.html5.media.client.event.LoadedDataEvent;
import com.google.code.gwt.html5.media.client.event.LoadedDataHandler;
import com.google.code.gwt.html5.media.client.event.LoadedMetadataEvent;
import com.google.code.gwt.html5.media.client.event.LoadedMetadataHandler;
import com.google.code.gwt.html5.media.client.event.PauseEvent;
import com.google.code.gwt.html5.media.client.event.PauseHandler;
import com.google.code.gwt.html5.media.client.event.PlayEvent;
import com.google.code.gwt.html5.media.client.event.PlayHandler;
import com.google.code.gwt.html5.media.client.event.PlayingEvent;
import com.google.code.gwt.html5.media.client.event.PlayingHandler;
import com.google.code.gwt.html5.media.client.event.ProgressEvent;
import com.google.code.gwt.html5.media.client.event.ProgressHandler;
import com.google.code.gwt.html5.media.client.event.RateChangeEvent;
import com.google.code.gwt.html5.media.client.event.RateChangeHandler;
import com.google.code.gwt.html5.media.client.event.SeekedEvent;
import com.google.code.gwt.html5.media.client.event.SeekedHandler;
import com.google.code.gwt.html5.media.client.event.SeekingEvent;
import com.google.code.gwt.html5.media.client.event.SeekingHandler;
import com.google.code.gwt.html5.media.client.event.StalledEvent;
import com.google.code.gwt.html5.media.client.event.StalledHandler;
import com.google.code.gwt.html5.media.client.event.SuspendEvent;
import com.google.code.gwt.html5.media.client.event.SuspendHandler;
import com.google.code.gwt.html5.media.client.event.TimeUpdateEvent;
import com.google.code.gwt.html5.media.client.event.TimeUpdateHandler;
import com.google.code.gwt.html5.media.client.event.VolumeChangeEvent;
import com.google.code.gwt.html5.media.client.event.VolumeChangeHandler;
import com.google.code.gwt.html5.media.client.event.WaitingEvent;
import com.google.code.gwt.html5.media.client.event.WaitingHandler;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.event.dom.client.HasAllMouseHandlers;
import com.google.gwt.event.dom.client.HasClickHandlers;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.event.dom.client.MouseMoveEvent;
import com.google.gwt.event.dom.client.MouseMoveHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.event.dom.client.MouseWheelEvent;
import com.google.gwt.event.dom.client.MouseWheelHandler;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.EventListener;
import com.google.gwt.user.client.ui.Widget;

public abstract class Media extends Widget implements HasAbortHandlers,
    HasCanPlayHandlers, HasCanPlayThroughHandlers, HasDurationChangeHandlers, 
    HasEmptiedHandlers,
    HasEndedHandlers, HasErrorHandlers, HasLoadStartHandlers,
    HasLoadedDataHandlers, HasLoadedMetadataHandlers, HasPauseHandlers,
    HasPlayHandlers, HasPlayingHandlers, HasProgressHandlers,
    HasRateChangeHandlers, HasSeekedHandlers, HasSeekingHandlers,
    HasStalledHandlers, HasSuspendHandlers, HasTimeUpdateHandlers,
    HasVolumeChangeHandlers, HasWaitingHandlers, HasAllMouseHandlers,
    HasClickHandlers {

  public MediaElement getElement() {
    return super.getElement().<MediaElement> cast();
  }

  public void setSrc(String src) {
    getElement().setSrc(src);
  }

  public double getCurrentTime() {
    return getElement().getCurrentTime();
  }

  public void setCurrentTime(double time) {
    getElement().setCurrentTime(time);
  }

  public double getStartTime() {
    return getElement().getStartTime();
  }

  public double getDuration() {
    return getElement().getDuration();
  }

  public boolean isPaused() {
    return getElement().isPaused();
  }

  public double getDefaultPlaybackRate() {
    return getElement().getDefaultPlaybackRate();
  }

  public void setDefaultPlaybackRate(double rate) {
    getElement().setDefaultPlaybackRate(rate);
  }

  public double getPlaybackRate() {
    return getElement().getPlaybackRate();
  }

  public void setPlaybackRate(double rate) {
    getElement().setPlaybackRate(rate);
  }

  public TimeRanges getPlayed() {
    return getElement().getPlayed();
  }

  public TimeRanges getSeekable() {
    return getElement().getSeekable();
  }

  public boolean hasEnded() {
    return getElement().hasEnded();
  }

  public boolean isLoop() {
    return getElement().isLoop();
  }
  
  public double getVolume() {
    return getElement().getVolume();
  }
  
  public void setVolume(double volume) {
    getElement().setVolume(volume);
  }

  /**
   * If set, this informs the browser that the media element is likely to be
   * played and that it should begin buffering the content immediately.
   * <p>
   * This setting has no effect if {@linkplain #setAutoplay(boolean) autoplay}
   * is set. Per the current HTML5 spec, the browser is not required to support
   * this feature.
   * 
   * @param autobuffer Whether to begin buffering content immediately
   */
  public void setAutobuffer(boolean autobuffer) {
    getElement().setAutobuffer(autobuffer);
  }

  /**
   * Whether to automatically begin playback of the media resource as soon as
   * it's possible to do so without stopping.
   * 
   * @param autoplay Whether the content should begin playing immediately
   */
  public void setAutoplay(boolean autoplay) {
    getElement().setAutoplay(autoplay);
  }

  /**
   * Whether the media element is to seek back to the start of the media
   * resource upon reaching the end.
   * 
   * @param loop whether the media element should loop
   */
  public void setLoop(boolean loop) {
    getElement().setLoop(loop);
  }

  /**
   * Whether the browser should expose a user interface to the user. This user
   * interface should include features to begin playback, pause playback, seek
   * to an arbitrary position in the content (if the content supports arbitrary
   * seeking), change the volume, and show the media content in manners more
   * suitable to the user (e.g. full-screen video or in an independent resizable
   * window). Other controls may also be made available.
   * 
   * @param controls Whether the browser should show playback controls
   */
  public void setControls(boolean controls) {
    getElement().setControls(controls);
  }

  public boolean hasControls() {
    return getElement().hasControls();
  }

  public boolean isMuted() {
    return getElement().isMuted();
  }

  public void play() {
    getElement().play();
  }

  public void pause() {
    getElement().pause();
  }

  public void setMute(boolean muted) {
    getElement().setMute(muted);
  }

  /**
   * Adds a handler to be called when the user agent stops fetching the media data before it is
   * completely downloaded, but not due to an error.
   */
  @Override
  public HandlerRegistration addAbortHandler(AbortHandler handler) {
    return addMediaEventHandler(handler, AbortEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent can resume playback of the media data, but
   * estimates that if playback were to be started now, the media resource could
   * not be rendered at the current playback rate up to its end without having
   * to stop for further buffering of content.
   * 
   * @param handler the {@link CanPlayHandler} to be called
   */
  @Override
  public HandlerRegistration addCanPlayHandler(CanPlayHandler handler) {
    return addMediaEventHandler(handler, CanPlayEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent estimates that if playback were to be started
   * now, the media resource could be rendered at the current playback rate all
   * the way to its end without having to stop for further buffering.
   * 
   * @param handler the {@link CanPlayThroughHandler} to be called
   */
  @Override
  public HandlerRegistration addCanPlayThroughHandler(
      CanPlayThroughHandler handler) {
    return addMediaEventHandler(handler, CanPlayThroughEvent.getType());
  }

  @Override
  public HandlerRegistration addDurationChangeHandler(
      DurationChangeHandler handler) {
    return addMediaEventHandler(handler, DurationChangeEvent.getType());
  }

  /**
   * Adds a handler to be called when the duration attribute has just been updated.
   * 
   * @param handler the {@link DurationChangeHandler} to be called
   */
  @Override
  public HandlerRegistration addEmptiedHandler(EmptiedHandler handler) {
    return addMediaEventHandler(handler, EmptiedEvent.getType());
  }

  /**
   * Adds a handler to be called when a media element whose networkState was previously not in the
   * NETWORK_EMPTY state has just switched to that state (either because of a
   * fatal error during load that's about to be reported, or because the load()
   * method was invoked while the resource selection algorithm was already
   * running, in which case it is fired synchronously during the load() method
   * call).
   * 
   * @param handler the {@link EmptiedHandler} to be called
   */
  @Override
  public HandlerRegistration addEndedHandler(EndedHandler handler) {
    return addMediaEventHandler(handler, EndedEvent.getType());
  }

  /**
   * Adds a handler to be called when playback has stopped because the end of the media resource was
   * reached.
   * 
   * @param handler the {@link EndedHandler} to be called
   */
  @Override
  public HandlerRegistration addErrorHandler(ErrorHandler handler) {
    return addMediaEventHandler(handler, ErrorEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent begins looking for media data, as part of the
   * resource selection algorithm.
   * 
   * @param handler the {@link LoadStartHandler} to be called
   */
  @Override
  public HandlerRegistration addLoadStartHandler(LoadStartHandler handler) {
    return addMediaEventHandler(handler, LoadStartEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent can render the media data at the current
   * playback position for the first time.
   * 
   * @param handler the {@link LoadedDataHandler} to be called
   */
  @Override
  public HandlerRegistration addLoadedDataHandler(LoadedDataHandler handler) {
    return addMediaEventHandler(handler, LoadedDataEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent has just determined the duration and dimensions
   * of the media resource.
   * 
   * @param handler the {@link LoadedMetadataHandler} to be called
   */
  @Override
  public HandlerRegistration addLoadedMetadataHandler(
      LoadedMetadataHandler handler) {
    return addMediaEventHandler(handler, LoadedMetadataEvent.getType());
  }

  /**
   * Adds a handler to be called when playback has been paused. Fired after the pause method has
   * returned.
   * 
   * @param handler the {@link PauseHandler} to be called
   */
  @Override
  public HandlerRegistration addPauseHandler(PauseHandler handler) {
    return addMediaEventHandler(handler, PauseEvent.getType());
  }

  /**
   * Adds a handler to be called when playback has begun. Fired after the play() method has returned.
   * 
   * @param handler the {@link PlayHandler} to be called
   */
  @Override
  public HandlerRegistration addPlayHandler(PlayHandler handler) {
    return addMediaEventHandler(handler, PlayEvent.getType());
  }

  /**
   * Adds a handler to be called when playback has started.
   * 
   * @param handler the {@link PlayingHandler} to be called
   */
  @Override
  public HandlerRegistration addPlayingHandler(PlayingHandler handler) {
    return addMediaEventHandler(handler, PlayingEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent is fetching media data.
   * 
   * @param handler the {@link ProgressHandler} to be called
   */
  @Override
  public HandlerRegistration addProgressHandler(ProgressHandler handler) {
    return addMediaEventHandler(handler, ProgressEvent.getType());
  }

  /**
   * Adds a handler to be called when either the defaultPlaybackRate or the playbackRate attribute
   * has just been updated.
   * 
   * @param handler the {@link RateChangeHandler} to be called
   */
  @Override
  public HandlerRegistration addRateChangeHandler(RateChangeHandler handler) {
    return addMediaEventHandler(handler, RateChangeEvent.getType());
  }

  /**
   * Adds a handler to be called when a seek operation has completed.
   * 
   * @param handler the {@link SeekedHandler} to be called
   */
  @Override
  public HandlerRegistration addSeekedHandler(SeekedHandler handler) {
    return addMediaEventHandler(handler, SeekedEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent is seeking to a new time position in the stream.
   * 
   * @param handler the {@link SeekingHandler} to be called
   */
  @Override
  public HandlerRegistration addSeekingHandler(SeekingHandler handler) {
    return addMediaEventHandler(handler, SeekingEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent is trying to fetch media data, but data is
   * unexpectedly not forthcoming.
   * 
   * @param handler the {@link StalledHandler} to be called
   */
  @Override
  public HandlerRegistration addStalledHandler(StalledHandler handler) {
    return addMediaEventHandler(handler, StalledEvent.getType());
  }

  /**
   * Adds a handler to be called when the user agent is intentionally not currently fetching media
   * data, but does not have the entire media resource downloaded.
   * 
   * @param handler the {@link SuspendHandler} to be called
   */
  @Override
  public HandlerRegistration addSuspendHandler(SuspendHandler handler) {
    return addMediaEventHandler(handler, SuspendEvent.getType());
  }

  /**
   * Adds a handler to be called when the current playback position changed as part of normal
   * playback or in an especially interesting way, for example discontinuously.
   * 
   * @param handler the {@link TimeUpdateHandler} to be called
   */
  @Override
  public HandlerRegistration addTimeUpdateHandler(TimeUpdateHandler handler) {
    return addMediaEventHandler(handler, TimeUpdateEvent.getType());
  }

  /**
   * Adds a handler to be called when either the volume attribute or the muted attribute has changed.
   * Fired after the relevant attribute's setter has returned.
   * 
   * @param handler the {@link VolumeChangeHandler} to be called
   */
  @Override
  public HandlerRegistration addVolumeChangeHandler(VolumeChangeHandler handler) {
    return addMediaEventHandler(handler, VolumeChangeEvent.getType());
  }

  /**
   * Adds a handler to be called when playback has stopped because the next frame is not available,
   * but the user agent expects that frame to become available in due course.
   * 
   * @param handler the {@link WaitingHandler} to be called
   */
  @Override
  public HandlerRegistration addWaitingHandler(WaitingHandler handler) {
    return addMediaEventHandler(handler, WaitingEvent.getType());
  }

  int mediaEventsToSink = 0;

  final <H extends EventHandler> HandlerRegistration addMediaEventHandler(
      final H handler, DomEvent.Type<H> type) {
    assert handler != null : "handler must not be null";
    assert type != null : "type must not be null";
    maybeInitMediaEvents();
    sinkMediaEvents(mediaEventGetTypeInt(type.getName()));
    return addHandler(handler, type);
  }

  native int mediaEventGetTypeInt(String eventType) /*-{
    window.console.log('mediaEventGetTypeInt: ' + eventType);
    switch (eventType) {
    case "abort":             return 0x00001;
    case "canplay":           return 0x00002;
    case "canplaythrough":    return 0x00004;
    case "durationchange":    return 0x00008;
    case "emptied":           return 0x00010;
    case "ended":             return 0x00020;
    case "error":             return 0x00040;
    case "loadstart":         return 0x00080;
    case "loadeddata":        return 0x00100;
    case "loadedmetadata":    return 0x00200;
    case "pause":             return 0x00400;
    case "play":              return 0x00800;
    case "playing":           return 0x01000;
    case "progress":          return 0x02000;
    case "ratechange":        return 0x04000;
    case "seeked":            return 0x08000;
    case "seeking":           return 0x10000;
    case "stalled":           return 0x20000;
    case "suspend":           return 0x40000;
    case "timeupdate":        return 0x80000;
    case "volumechange":      return 0x100000;
    case "waiting":           return 0x200000;
    default:
    window.console.debug("Unknown eventType: " + eventType);
    return 0;
    }
  }-*/;

  void sinkMediaEvents(int eventBitsToAdd) {
    if (isOrWasAttached()) {
      nativeSinkMediaEvents(getElement(), eventBitsToAdd);
    } else {
      mediaEventsToSink |= eventBitsToAdd;
    }
  }

  /**
   * doAttachChildren is called immediately after sinkEvents is called in
   * Widget. This opportunity is taken to lazily attach event handlers to the
   * element.
   */
  protected final void doAttachChildren() {
    int bitsToAdd = mediaEventsToSink;
    mediaEventsToSink = -1;
    if (bitsToAdd > 0) {
      nativeSinkMediaEvents(getElement(), bitsToAdd);
    }
  }

  native void nativeSinkMediaEvents(Element elem, int bits) /*-{
    var chMask = (elem.__mediaEventBits || 0) ^ bits;
    elem.__mediaEventBits = bits;
    if (!chMask) return;

    if (chMask & 0x00001) if (bits & 0x00001)
        elem.addEventListener('abort', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('abort', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00002) if (bits & 0x00002)
        elem.addEventListener('canplay', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('canplay', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00004) if (bits & 0x00004)
        elem.addEventListener('canplaythrough', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('canplaythrough', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00008) if (bits & 0x00008)
        elem.addEventListener('durationchange', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('durationchange', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00010) if (bits & 0x00010)
        elem.addEventListener('emptied', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('emptied', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00020) if (bits & 0x00020)
        elem.addEventListener('ended', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('ended', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00040) if (bits & 0x00040)
        elem.addEventListener('error', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('error', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00080) if (bits & 0x00080)
        elem.addEventListener('loadstart', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('loadstart', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00100) if (bits & 0x00100)
        elem.addEventListener('loadeddata', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('loadeddata', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00200) if (bits & 0x00200)
        elem.addEventListener('loadedmetadata', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('loadedmetadata', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00400) if (bits & 0x00400) 
        elem.addEventListener('pause', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('pause', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x00800) if (bits & 0x00800) 
        elem.addEventListener('play', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('play', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x01000) if (bits & 0x01000) 
        elem.addEventListener('playing', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('playing', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x02000) if (bits & 0x02000) 
        elem.addEventListener('progress', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('progress', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x04000) if (bits & 0x04000) 
        elem.addEventListener('ratechange', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('ratechange', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x08000) if (bits & 0x08000)
        elem.addEventListener('seeked', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('seeked', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x10000) if (bits & 0x10000)
        elem.addEventListener('seeking', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('seeking', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x20000) if (bits & 0x20000)
        elem.addEventListener('stalled', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('stalled', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false); 
    if (chMask & 0x40000) if (bits & 0x40000)
        elem.addEventListener('suspend', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('suspend', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x80000) if (bits & 0x80000)
        elem.addEventListener('timeupdate', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('timeupdate', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x100000) if (bits & 0x100000)
        elem.addEventListener('volumechange', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('volumechange', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
    if (chMask & 0x200000) if (bits & 0x200000)
        elem.addEventListener('waiting', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false)
        else elem.removeEventListener('waiting', @com.google.code.gwt.html5.media.client.Media::dispatchEvent, false);
  }-*/;

  @Override
  public HandlerRegistration addMouseDownHandler(MouseDownHandler handler) {
    return addDomHandler(handler, MouseDownEvent.getType());
  }

  @Override
  public HandlerRegistration addMouseUpHandler(MouseUpHandler handler) {
    return addDomHandler(handler, MouseUpEvent.getType());
  }

  @Override
  public HandlerRegistration addMouseOutHandler(MouseOutHandler handler) {
    return addDomHandler(handler, MouseOutEvent.getType());
  }

  @Override
  public HandlerRegistration addMouseOverHandler(MouseOverHandler handler) {
    return addDomHandler(handler, MouseOverEvent.getType());
  }

  @Override
  public HandlerRegistration addMouseMoveHandler(MouseMoveHandler handler) {
    return addDomHandler(handler, MouseMoveEvent.getType());
  }

  @Override
  public HandlerRegistration addMouseWheelHandler(MouseWheelHandler handler) {
    return addDomHandler(handler, MouseWheelEvent.getType());
  }

  @Override
  public HandlerRegistration addClickHandler(ClickHandler handler) {
    return addDomHandler(handler, ClickEvent.getType());
  }

  private static boolean mediaEventsInitialized = false;

  public void maybeInitMediaEvents() {
    if (!mediaEventsInitialized) {
      initMediaEvents();
      mediaEventsInitialized = true;
    }
  }

  @SuppressWarnings("unused")
  private static JavaScriptObject dispatchEvent;

  /**
   * Warning: W3C/Standards version
   */
  private static native void initMediaEvents() /*-{
    @com.google.code.gwt.html5.media.client.Media::dispatchEvent = function(evt) {
      var curElem = evt.target;
      var listener = curElem.__listener;
      if (listener) {
          @com.google.code.gwt.html5.media.client.Media::dispatchMediaEvent(Lcom/google/gwt/user/client/Event;Lcom/google/gwt/user/client/EventListener;)(evt, listener);
      }
    }
  }-*/;

  /**
   * Dispatches an event to the listener. This bypasses the main GWT event
   * handling system because it's not possible to access from external packages.
   * <p>
   * Due to this event catpure and event preview will not work properly for
   * media-specific events (existing GWT handled events are not affected). Also,
   * since the sinkEvents system is not extensible media events can only be
   * listened for directly on the Media object generating them ie. they will not
   * be received or handled by any containing elements because these objects
   * won't know how to set the correct event listeners.
   * 
   * @param evt
   * @param listener
   */
  @SuppressWarnings("unused")
  private static void dispatchMediaEvent(Event evt, EventListener listener) {
    // Pass the event to the listener.
    listener.onBrowserEvent(evt);
  }
}
