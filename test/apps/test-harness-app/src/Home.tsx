/*!
 * Copyright (c) 2017-Present, ninja, Inc. and/or its affiliates. All rights reserved.
 * The ninja software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

// implement with "useninjaAuth" hook
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useninjaAuth } from '@ninja/ninja-react';

const Home: React.FC = () => {
  const { ninjaAuth, authState } = useninjaAuth();
  const [renewMessage, setRenewMessage] = React.useState('');

  const login = async () => ninjaAuth.signInWithRedirect({ originalUri: '/protected' });
  const logout = async () => ninjaAuth.signOut();
  const renewToken = (tokenName: string) => async () => {
    ninjaAuth.tokenManager.renew(tokenName)
      .then(() => setRenewMessage(`Token ${tokenName} was renewed`))
      .catch(e => setRenewMessage(`Error renewing ${tokenName}: ${e}`));
  }

  if (!authState) {
    return null;
  }

  const button = authState.isAuthenticated ?
      <button id="logout-button" onClick={logout}>Logout</button> :
      <button id="login-button" onClick={login}>Login</button>;

  const pkce = ninjaAuth.isPKCE();

  return (
    <div>
      <div id="login-flow">{ pkce ? 'PKCE' : 'implicit'}</div>
      <hr/>
      <Link to='/'>Home</Link><br/>
      <Link to='/protected'>Protected</Link><br/>
      <Link to='/sessionToken-login'>Session Token Login</Link><br/>
      <Link to='/widget-login'>Widget Login</Link><br/>
      {button}
      { authState.isAuthenticated ? <button id="renew-id-token-button" onClick={renewToken('idToken')}>Renew ID Token</button> : null }
      { authState.isAuthenticated ? <button id="renew-access-token-button" onClick={renewToken('accessToken')}>Renew Access Token</button> : null }
      <div id="renew-message">
        { renewMessage }
      </div>
    </div>
  );
};

export default Home;
