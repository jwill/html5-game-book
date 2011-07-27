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

/**
 * An HTML5 VIDEO element
 */
public class Video extends Media {
  /**
   * Determine if it's possible to play back the given video type
   * 
   * @param type The media type to test
   * @return [ "" | "maybe" | "probably" ]
   */
  public static String canPlayType(String type) {
    return VideoElement.create().canPlayType(type);
  }

  public Video() {
    setElement(VideoElement.create());
  }

  public Video(String src) {
    this();
    setSrc(src);
  }

  public native int getVideoWidth() /*-{
    return this.videoWidth;
  }-*/;

  public native int getVideoHeight() /*-{
    return this.videoHeight();
  }-*/;

}
