jo.load()
stack = new joStackScroller()
scn = new joScreen(stack)
card = new joCard([
    new joTitle("Hello"),
    new joCaption("Hello World!"),
    new joDivider(),
    new joButton("OK")
]);
stack.push(card)
stack.show()
stack.home()
#scn.alert("Hello, Jo!", "This is a simple alert.")

