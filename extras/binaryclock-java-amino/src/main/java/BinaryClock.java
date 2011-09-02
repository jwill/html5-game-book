
import java.awt.*;
import java.util.*;
import com.joshondesign.amino.core.*;
import org.apache.commons.lang.StringUtils;

public class BinaryClock extends Core implements Callback {
	Group group = new Group();
	int sideLength = 50;
	int gap = 10;
	java.util.List<ClockLine>lines;

	public BinaryClock() {
		setSize(600,400);
		setBackground(Color.WHITE);
		setFPS(30);
		drawLines();
		
		root = group;

		addCallback(this);
	}

	public void drawLines() {
		lines = new ArrayList<ClockLine>();
		for (int i=0; i<6; i++) {
			ClockLine line = new ClockLine();
			lines.add(line);
		}
		
		lines.get(0).setMaxValue(4);
		lines.get(1).setMaxValue(8);
		
		lines.get(2).setMaxValue(4);
		lines.get(3).setMaxValue(8);
		
		lines.get(4).setMaxValue(4);
		lines.get(5).setMaxValue(8);

		
		
		for (int i=0; i<6; i++) {
				ClockLine line = lines.get(i);
				line.drawSquares();
				line.setX(i*(sideLength+gap));
				group.add(line);
		}
		
		// Alignment
		group.getChild(0).setY(60);
		
		group.getChild(2).setY(60);
		group.getChild(4).setY(60);
	}

	public void call (Object obj) {
		Calendar now = Calendar.getInstance();
		Integer hrs = now.get(Calendar.HOUR_OF_DAY);
		Integer mins = now.get(Calendar.MINUTE);
		Integer secs = now.get(Calendar.SECOND);
		
		String h = StringUtils.leftPad(hrs.toString(), 2, '0');
		String m = StringUtils.leftPad(mins.toString(), 2, '0');
		String s = StringUtils.leftPad(secs.toString(), 2, '0');
		
		lines.get(0).setValue(h.charAt(0));
		lines.get(1).setValue(h.charAt(1));
		lines.get(2).setValue(m.charAt(0));
		lines.get(3).setValue(m.charAt(1));
		lines.get(4).setValue(s.charAt(0));
		lines.get(5).setValue(s.charAt(1));
	}
	public static void main(String ... args) throws Exception {
		BinaryClock clock = new BinaryClock();
		clock.start();
	}
}
