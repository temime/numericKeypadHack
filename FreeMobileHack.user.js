// ==UserScript==
// @name        FreeMobileHack
// @namespace   http://www.ghusse.com
// @description Free mobile hack
// @include     about:addons
// @include     https://mobile.free.fr/moncompte/
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @grant       none
// @version     1
// ==/UserScript==

var correspondances = [];
var images = [];
var models = [{
	white: [[19, 18], [18, 19]],
	red: [[20, 18]]
}, 
{
	white: [[21, 13]],
	red: [[20, 13]]
}, 
{
	white: [[21, 24]],
	red: [[21, 25]]
}, {
	white: [[15, 16]],
	red: [[15, 14], [15, 22]]
}, {
white: [[20, 27], [15, 24]],
red: [[20, 26], [15, 22]]},
{
	white: [[15, 20]],
	red: [[15, 19]]
}, {
	white: [[21, 16]],
	red: [[21, 17], [15, 21]]
}, {
	white: [[15, 15]],
	red: [[15, 13]]
}, {
	white: [[18, 16]],
	red: [[18, 18], [16, 19], [21, 16]]
}, 
{
	white: [[16, 23]],
	red: [[16, 16], [16, 24]]
}];

function onImageLoad(canvas, index){
	canvas.remove();
}

function findImages(){
	return $("img.ident_chiffre_img");
}

function findWhosWho(){
	images = findImages();

	for (var i = 0; i < images.length; i++){
		whoAmI(images[i]);
	}
}

function whoAmI(image){
	var canvas = $("<canvas />")
		.attr("height", image.height)
		.attr("width", image.width)
		.appendTo("body");

	var context = canvas[0].getContext('2d');
	var img = new Image();
	img.src = $(image).attr("src");
	context.drawImage(img, 0, 0);

	var imgd = context.getImageData(0, 0, image.width, image.height),
		pixels = imgd.data;

	for (var i = 0; i< models.length; i++){
		var result = testModel(models[i], pixels, image.width);
		if (result !== false){
			models[i] = null;
			correspondances[i] = $(image);
			console.log("found: " + i + " is " + image.alt);
		}
	}

	canvas.remove();
}

function RIndex(pixels, x, y, width){
	return 4*(x + y * width);
}

function testModel(model, pixels, width){
	if (model == null){
		return false;
	}

	for (var i = 0; i < model.white.length; i++){
		var pixel = model.white[i],
			r = RIndex(pixels, pixel[0], pixel[1], width);

		if (!isWhite(pixels[r], pixels[r+1], pixels[r + 2])){
			return false;
		}
	}

	for (var i = 0; i < model.red.length; i++){
		var pixel = model.red[i],
			r = RIndex(pixels, pixel[0], pixel[1], width);

		if (!isRed(pixels[r], pixels[r+1], pixels[r + 2])){
			return false;
		}
	}


	return true;
}

function isWhite(r, g, b){
	return r > 200 && g > 200  && b > 200;
}

function isRed(r, g, b){
	return r > 200 && g < 200  && b < 200;
}

$(document).ready(function(){
	findWhosWho();

	correspondances[1].click();
	correspondances[3].click();
	correspondances[3].click();
	correspondances[7].click();
});
