package com.google.code.gwt.html5.media.client.event;

import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;

/**
 * A widget that implements this interface is a public source of
 * {@link AbortEvent} events.
 */
public interface HasAbortHandlers extends HasHandlers {
  /**
   * Adds a {@link AbortEvent} handler.
   * 
   * @param handler the handler
   * @return the registration for the event
   */
  HandlerRegistration addAbortHandler(AbortHandler handler);
}
