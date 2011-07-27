package com.informit.chapter8.canvas2d.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.RootPanel;
import gwt.g2d.client.graphics.KnownColor;
import gwt.g2d.client.graphics.Surface;

/**
 * Created by IntelliJ IDEA.
 * User: jwill
 * Date: 11/27/10
 * Time: 7:21 PM
 */
public class SurfaceExample implements EntryPoint {
    public void onModuleLoad() {
        Surface surface = new Surface(640, 480);
        surface.setFillStyle(KnownColor.BLUE).fillRectangle(100, 175, 40, 40);
        surface.setFillStyle(KnownColor.BLACK).scale(2).fillText("Hello from gwt-g2d", 100, 100);
        RootPanel.get().add(surface);
    }
}
