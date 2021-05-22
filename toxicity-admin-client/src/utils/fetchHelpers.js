import config from '../config';

const appendUrlParams = (url, params) => {
	let result = url;

	if (params && Object.keys(params).length > 0) {
		result = Object.keys(params).reduce((url, paramKey) => url.replace(`:${ paramKey }`, params[paramKey]), url);
	}

	return result
		.split('/')
		.reduce((urlParts, urlPart) => {
			if (urlPart.indexOf(':') === 0) {
				return urlParts;
			}
			urlParts.push(urlPart);

			return urlParts;
		}, [])
		.join('/');
};

export const createQuery = params =>
	Object.keys(params)
		.reduce((resultList, paramName) => {
			if (params[paramName] !== undefined) {
				resultList.push(`${ paramName }=${ params[paramName] }`);
			}

			return resultList;
		}, [])
		.join('&');

export const getEndpointUrl = (endpoint, params = {}, pathParams = {}) => {
	let url = appendUrlParams(config[endpoint], pathParams);

	if (params && typeof params === 'object' && Object.keys(params).length > 0) {
		const queryStr = createQuery(params);

		if (queryStr) {
			url += `?${ queryStr }`;
		}
	}

	return `${ config.endpoint }${ url }`;
};
