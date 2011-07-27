package com.hydro4ge.raphaelgwt.client;

public abstract class AnimationCallback {
  public abstract void onComplete();
  static public void fire(AnimationCallback c) {
	c.onComplete();
  }
}

