var audioContext;
var pcmProcessorNode;

function sineWaveGenerator(soundData) {
	
}

var playing = false;

$(document).ready(function(){
	try	{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();
	} catch (e) {
		alert('Web Audio API is not supported in this browser');
		return;
	}

	// This buffer just serves as a way to keep the pcmProcessorNode from
	// outputting for all eternity
	var gen = new sineWaveGenerator();

	var bufferSize = 4096;
	pcmProcessorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
	pcmProcessorNode.onaudioprocess = function(e) {
		if (!playing) {return;}
		var output = e.outputBuffer.getChannelData(0);
		for (var i = 0; i < bufferSize; ++i){
			// Generate samples
			output[i] = gen.nextSample();
		}
	}

	document.getElementById("play_btn").onclick = function(event){
		if(!playing) {
			playing = true;
			pcmProcessorNode.connect(audioContext.destination);
			document.getElementById("play_btn").innerHTML = "Pause";
		} else {
			playing = false;
			pcmProcessorNode.disconnect();
			document.getElementById("play_btn").innerHTML = "Play";
		}
	}

	document.getElementById("freq_sldr").oninput = document.getElementById("freq_sldr").mousemove = function () {
		var v = document.getElementById("freq_sldr").value;
		var freq = Math.pow(2,(v - 69)/12)*440;
		gen.setFrequency(freq);
		document.getElementById("freq_lbl").innerHTML = freq + " Hz";
		console.log("Midi note: " + v + " frequency: " + freq);
	}
})

function sineWaveGenerator(sampleRate = 44100, frequency = 440.0) {
	this.sampleRate = sampleRate;
	this.phase = 0;
	this.frequency = frequency;
	this.updateIncrement = function (){
		return this.frequency * 2 * Math.PI / this.sampleRate;
	}
	this.increment = this.updateIncrement();
	this.setFrequency = function (f){
		this.frequency = f;
		this.increment = this.updateIncrement();
	}
	this.nextSample = function (){
		var v = Math.sin(this.phase);
		this.phase += this.increment;
		return v;
	}
}