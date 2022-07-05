import {
	createImage,
	mergeImages,
} from './controllers/catServices.js';

const imageConfig = {
	width: 400,
	height: 400,
	color: 'Pink',
	size: 100,
};

const cats = [
	createImage('Hey', imageConfig),
	createImage('You', imageConfig),
	createImage('Cat!', imageConfig),
];

mergeImages(cats, imageConfig);
