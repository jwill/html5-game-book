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
package com.google.code.gwt.html5.media.client.event;

import com.google.gwt.event.dom.client.DomEvent;

/**
 * Represents a native ratechange event.
 */
public class RateChangeEvent extends DomEvent<RateChangeHandler> {

  /**
   * Event type for ratechange events. Represents the meta-data associated with this
   * event.
   */
  private static final Type<RateChangeHandler> TYPE = new Type<RateChangeHandler>(
      "ratechange", new RateChangeEvent());

  /**
   * Gets the event type associated with ratechange events.
   * 
   * @return the handler type
   */
  public static Type<RateChangeHandler> getType() {
    return TYPE;
  }

  /**
   * Protected constructor, use
   * {@link DomEvent#fireNativeEvent(com.google.gwt.dom.client.NativeEvent, com.google.gwt.event.shared.HasHandlers)}
   * to fire ratechange events.
   */
  protected RateChangeEvent() {
  }

  @Override
  public final Type<RateChangeHandler> getAssociatedType() {
    return TYPE;
  }

  @Override
  protected void dispatch(RateChangeHandler handler) {
    handler.onRateChange(this);
  }

}
