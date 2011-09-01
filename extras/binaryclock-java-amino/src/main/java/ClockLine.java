import java.awt.*;

import com.joshondesign.amino.core.*;
import org.apache.commons.lang.StringUtils;

public class ClockLine extends Group {
	int maxValue = 8;
	int value = 0;
	int sideLength = 50;
	int gap = 10;
	
	public ClockLine() { }
	public ClockLine(int value) {
		setMaxValue(value);
	}
	
	public ClockLine(int value, int side, int g) {
		setMaxValue(value);
		sideLength = side;
		gap = g;
	}

	public void setMaxValue(int val) {
		maxValue = val;
	}

	public Rect createNewRect() {
		return new Rect().set(0, 0, sideLength, sideLength);
	}

	public void drawSquares() {
		Rect[] rect = new Rect[4];
		for (int i=0; i<4; i++) {
			Rect r = createNewRect();
			r.setY(i*(sideLength+gap));
			rect[i] = r;
		}
		
		if (maxValue == 8) {
			add(rect[0]).add(rect[1]).add(rect[2]).add(rect[3]);
		} else if (maxValue == 4) {
			add(rect[0]).add(rect[1]).add(rect[2]);
		} else add(rect[0]).add(rect[1]);
	}

	public void setValue(char num) {
		Integer n = new Integer(""+num);
		value = n;
		
		String binaryText = Integer.toBinaryString(value);
		int padding = (maxValue == 8) ? 4 : (maxValue == 4) ? 3 : 2;
		binaryText = StringUtils.leftPad(binaryText, padding, '0');

		for (int i=0; i<binaryText.length(); i++) {
			char v = binaryText.charAt(i);
			if (v == '0') {
				((Rect)getChild(i)).setFill(Color.RED);
			} else ((Rect)getChild(i)).setFill(Color.GREEN);
		}
	}

	public void setX(int x) {
		for (int i=0; i<childCount(); i++) {
			getChild(i).setX(x);
		}
	}
}
