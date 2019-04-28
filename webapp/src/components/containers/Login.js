import React from 'react';
import '../../styles/main.scss';

import Logo from '@thulium/assets/logo/logo-with-text-white.png';

const blackboardURI = 'https://itba-test.blackboard.com/learn/api/public/v1/oauth2/authorizationcode';
const blackboardURL = `${blackboardURI}?redirect_uri=${SERVICE_URL}/core/v1/auth/social/blackboard&response_type=code&client_id=${BB_CLIENT_ID}&scope=read write offline`;

const Login = () => (
	<div className="full-height container-fluid" style={{backgroundColor:'#343A40'}}>
		<div className="row">
		<div className="col-md-5"></div>
			<div className="col-md-2 text-center" style={{padding: 20, paddingTop: '10%' }}>
				<img className="img-fluid" src={Logo} />
				<a href={blackboardURL} style={{marginTop: 50}} className="btn btn-light">Login</a>
			</div>
		</div>
	</div>
);

export default Login;