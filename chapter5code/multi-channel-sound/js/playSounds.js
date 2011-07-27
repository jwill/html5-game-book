/**
 * @author jwill
 */
var numChannels = 10;
channels = new Array();
for (var i = 0; i<numChannels; i++) {
	channels[i] = new Audio();
}
var play_multi_channel = function(id) {
	for (var i = 0; i<channels.length; i++) {
		if (isNaN(channels[i].duration) || channels[i].duration == channels[i].currentTime) {
			channels[i].src = document.getElementById(id).src;
			channels[i].load();
			channels[i].play();
			console.log("Playing on Channel: "+i);
			break;
		}
	}
	
}
