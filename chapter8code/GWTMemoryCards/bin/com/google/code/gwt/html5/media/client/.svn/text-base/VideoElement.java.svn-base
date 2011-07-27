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

import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.TagName;

@TagName(VideoElement.TAG)
public final class VideoElement extends MediaElement {
  static final String TAG = "video";

  public static VideoElement create() {
    return Document.get().createElement(TAG).cast();
  }

  protected VideoElement() {
  }

  public native void getWidth() /*-{
    return this.width;
  }-*/;

  public native void setWidth(int width) /*-{
    this.width = width;
  }-*/;

  public native int getHeight() /*-{
    return this.height;
  }-*/;

  public native void setHeight(int height) /*-{
    this.height = height;
  }-*/;

  public native int getVideoWidth() /*-{
    return this.videoWidth;
  }-*/;

  public native int getVideoHeight() /*-{
    return this.videoHeight;
  }-*/;

  public native String getPoster() /*-{
    return this.poster;
  }-*/;

  public native void setPoster(String url) /*-{
    this.poster = url;
  }-*/;
}
