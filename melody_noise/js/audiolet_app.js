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

	var AudioletApp = function() {
		this.audiolet = new Audiolet();

		this.audiolet.scheduler.addAbsolute(0/*beat number*/, function() {
		  var synth = new Synth(this.audiolet, 262);
		  synth.connect(this.audiolet.output);
		}.bind(this));

		this.audiolet.scheduler.addAbsolute(1, function() {
		  var synth = new Synth(this.audiolet, 262);
		  synth.connect(this.audiolet.output);
		}.bind(this));

		this.audiolet.scheduler.addAbsolute(2, function() {
		  var synth = new Synth(this.audiolet, 392);
		  synth.connect(this.audiolet.output);
		}.bind(this));

		this.audiolet.scheduler.addAbsolute(3, function() {
		  var synth = new Synth(this.audiolet, 392);
		  synth.connect(this.audiolet.output);
		}.bind(this));
	};
	

    this.audioletApp = new AudioletApp();
	

};


