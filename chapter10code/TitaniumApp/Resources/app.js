// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'App',
    backgroundColor:'#fff'
});

var webview = Titanium.UI.createWebView({
    url:'index.html'
});

win1.add(webview);

// open window
win1.open();
