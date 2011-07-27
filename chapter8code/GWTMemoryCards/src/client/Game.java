package client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.*;

/**
 * Created by IntelliJ IDEA.
 * User: jwill
 * Date: 11/20/10
 * Time: 11:50 AM
 */
public class Game implements EntryPoint {
    public void onModuleLoad() {
        Canvas canvas = new Canvas(800,800);
        RootPanel.get().add(canvas);
    }
}
