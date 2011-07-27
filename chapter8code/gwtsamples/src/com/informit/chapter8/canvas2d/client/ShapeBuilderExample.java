package com.informit.chapter8.canvas2d.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.*;
import gwt.g2d.client.graphics.KnownColor;
import gwt.g2d.client.graphics.Surface;
import gwt.g2d.client.graphics.shapes.Shape;
import gwt.g2d.client.graphics.shapes.ShapeBuilder;
import gwt.g2d.client.math.Arc;

/**
 * Created by IntelliJ IDEA.
 * User: jwill
 * Date: 11/27/10
 * Time: 7:51 PM
 */
public class ShapeBuilderExample implements EntryPoint {
    public void onModuleLoad() {
        ShapeBuilder builder = new ShapeBuilder();
        builder.drawArc(new Arc(100,100,25, 0, Math.PI*2));
        Shape shape = builder.build();

        Surface surface = new Surface(640,480);
        surface.setFillStyle(KnownColor.GREEN).fillShape(shape);
        surface.setFillStyle(KnownColor.YELLOW).translate(75,0).fillShape(shape);
        RootPanel.get().add(surface);

    }
}
