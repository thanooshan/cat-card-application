import { writeFile } from 'fs';
import { join } from 'path';
import axios from 'axios';
import qs from 'qs';
import blend from '@mapbox/blend';

//for the simplicity of the project I've added the common variables here, otherwise can load as environment variable.
const ROOT_URL = 'https://cataas.com/cat/says';
const OUTPUT_NAME = 'cat-card';

// return cat images with the text
export const createImage = async (title, config) => {
	const url = `${ROOT_URL}/${title}?${qs.stringify(config)}`;
	return await axios
		.get(url, {
			responseType: 'arraybuffer',
		})
		.then((response) => response);
};

// merges the images into one
export const mergeImages = (cats, config) => {
	const { width, height } = config;

	axios
		.all([...cats])
		.then((responses) => {
			blend(
				[...bufferImages(responses, config.width)],
				{
					width: width * responses.length,
					height: height,
					format: 'jpeg',
				},
				(err, data) => {
					if (err) console.log(err);

					saveImage(data, OUTPUT_NAME);
				}
			);
		})
		.catch((err) => {
			console.log(`Received response with: ${err}`);
		});
};

// return the images as buffer instances
const bufferImages = (images, width) => {
	let data = [];

	images.map((image, i) => {
		let img = {
			buffer: image.data,
			x: width * i,
			y: 0,
		};

		data.push(img);
	});

	return data;
};

// save the image
const saveImage = (data, imageName) => {
	const output = join(process.cwd(), `/${imageName}.jpg`);

	writeFile(output, data, 'binary', (err) => {
		if (err) console.log(err);
		console.log('The file was saved!');
	});
};
