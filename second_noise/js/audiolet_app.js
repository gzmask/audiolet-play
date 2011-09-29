window.onload = function() {
    var AudioletApp = function() {
        this.audiolet = new Audiolet();
    };

    this.audioletApp = new AudioletApp();

	var AudioletApp = function(){
		this.audiolet = new Audiolet();
		this.sine = new Sine(this.audiolet, 440);

		//I don't think this part is working
		this.modulator = new Saw(this.audiolet, 880);
		this.modulatorMulAdd = new MulAdd(this.audiolet, 200, 440);
		this.modulator.connect(this.modulatorMulAdd);
		this.modulatorMulAdd.connect(this.sine);
		
		//this.sine.connect(this.audiolet.output);
	};

	var noise = new AudioletApp();
	noise.sine.connect(noise.audiolet.output);
};


