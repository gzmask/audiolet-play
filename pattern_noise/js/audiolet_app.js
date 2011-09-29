window.onload = function() {
    var AudioletApp = function() {
        this.audiolet = new Audiolet();
    };

    this.audioletApp = new AudioletApp();

	var Synth = function(audiolet, frequency){
		AudioletGroup.apply(this, [audiolet,0,1]);
		this.sine = new Sine(this.audiolet, frequency);
        this.modulator = new Saw(this.audiolet, 2 * frequency);
        this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);
        this.modulator.connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.sine);
		this.gain = new Gain(this.audiolet);
		//Attack release
        this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.2, 0.5,
            function() {
                this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
            }.bind(this)
        );
        this.modulator.connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.sine);
        this.envelope.connect(this.gain, 0, 1);
        this.sine.connect(this.gain);
        this.gain.connect(this.outputs[0]);
	};
	extend(Synth, AudioletGroup);

	//music.js kicks in
	var a4 = Note.fromLatin('A4');  // single note
	var c4 = Note.fromLatin('C4');  // single note
	var d4 = Note.fromLatin('D4');  // single note
	//var freq = n.frequency();  // returns 440
	//var name = n.latin();  // returns "A"
	//var octave = n.octave();  // returns 4 


	//simple pattern
	var AudioletAppSimple = function() {
		this.audiolet = new Audiolet();

		//var frequencyPattern = new PSequence([262, 262, 392, 392], 1); //before music.js
		var frequencyPattern = new PSequence(
				[a4.frequency(), 
				c4.frequency(), 
				d4.frequency(), 
				a4.frequency()], 1/*part of pattern*/); //after music.js

		this.audiolet.scheduler.play([frequencyPattern], 1/*WTF this do?*/,
		  function(frequency) {
			  var synth = new Synth(this.audiolet, frequency);
			  synth.connect(this.audiolet.output);
		  }.bind(this)
		);
	};

	//complex pattern
	var AudioletAppComplex = function() {
		this.audiolet = new Audiolet();

		var melodyA = new PSequence([262, 294, 330, 349]);
		var melodyB = new PSequence([349, 330, 349, 392]);
		var melodyC = new PSequence([440, 392, 349, 330]);
		var frequencyPattern = new PChoose([melodyA, melodyB, melodyC],
										 Infinity);

		var durationPattern = new PChoose([new PSequence([4, 1, 1, 2]),
										 new PSequence([2, 2, 1, 3]),
										 new PSequence([1, 1, 1, 1])],
										Infinity);

		this.audiolet.scheduler.play([frequencyPattern], durationPattern,
		  function(frequency) {
			  var synth = new Synth(this.audiolet, frequency);
			  synth.connect(this.audiolet.output);
		  }.bind(this)
		);
	};
	

    //this.audioletApp = new AudioletAppComplex();
    this.audioletApp = new AudioletAppSimple();
	

};


