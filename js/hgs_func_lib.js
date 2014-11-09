/*
function Decode(tex, mask) {return tex};
function Encode(tex, mask) {return tex}; */

function Decode(tex, mask) {
	var fri = new String("");
	var Stri = new String("");
	Stri = tex;
	var i = 0;
	var j = 0;
	var Mask = new String(mask);
	for(i = 0; i < Stri.length; i++) {
		var c = Stri.charAt(i);
		var com = c.charCodeAt(0)^Mask.charCodeAt(j);
		c = String.fromCharCode(com);
		fri += c;
		if(j == Mask.length-1)j=0; else j++;
	}
		return fri;
}


function Encode(to_enc, xor_key)
{
    var the_res="";
    var key_i = 0;
    for(i=0;i<to_enc.length;++i)
    {
        the_res+=String.fromCharCode(xor_key.charCodeAt(key_i++)^to_enc.charCodeAt(i));
        if (key_i > xor_key.length) key_i = 0;

    }
    return the_res;
}

function Decode(to_dec, xor_key)
{
    var dec_res = "";
    var key_i = 0;
    for(i=0;i<to_dec.length;i++)
    {
        dec_res += String.fromCharCode(xor_key.charCodeAt(key_i++)^to_dec.charCodeAt(i));
        if (key_i > xor_key.length) key_i = 0;
    }
    return dec_res;
}

var RNG = function (seed) { 
  // LCG using GCC's constants 
  this.m = 0x1000000000; // 2**32; 
  this.a = 1103515245; 
  this.c = 12345; 
  this.state = seed ? seed : Math.floor(Math.random() * (this.m-1)); 
}

RNG.prototype.nextInt = function() { 
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state; 
}

RNG.prototype.nextFloat = function() { 
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1); 
}

RNG.prototype.nextRange = function(start, end) { 
  // returns in range [start, end): including start, excluding end 
  // can't modulu nextInt because of weak randomness in lower bits 
  var rangeSize = end - start; 
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize); 
} 

RNG.prototype.Choice = function(array) { 
  return array[this.nextRange(0, array.length)]; 
} 

RNG.prototype.Dice = function(number, dice, plus) {
	var s = 0;
	for (var i = 0; i < number; i++){
		s = s + this.nextRange(1, dice+1);
	}
	  return s + plus; 
}

RNG.prototype.DiceSeed = function(seed) {
	this.m = 0x100000000; // 2**32; 
	this.a = 1103515245; 
	this.c = 12345; 
	this.state = seed ? seed : Math.floor(Math.random() * (this.m-1));
}

