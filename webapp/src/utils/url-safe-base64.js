const encode = base64 => {
	return base64
		.replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
		.replace(/=+$/, ''); // Remove ending '='
};

export default encode;