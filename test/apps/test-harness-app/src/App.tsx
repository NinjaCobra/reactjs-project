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

import * as React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ninjaAuth, toRelativeUrl } from '@ninja/ninja-auth-js';
import { Security, LoginCallback, SecureRoute } from '@ninja/ninja-react';
import Home from './Home';
import Protected from './Protected';
import CustomLogin from './CustomLogin';
import WidgetLogin from './WidgetLogin';
import SessionTokenLogin from './SessionTokenLogin';

const App: React.FC<{ 
  ninjaAuth: ninjaAuth; 
  customLogin: boolean; 
  baseUrl: string;
}> = ({ ninjaAuth, customLogin, baseUrl }) => {
  const history = useHistory();

  const onAuthRequired = async () => {
    history.push('/login');
  };

  const onAuthResume = async () => { 
    history.push('/widget-login');
  };

  const restoreOriginalUri = async (_ninjaAuth: ninjaAuth, originalUri: string) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <React.StrictMode>
      <Security
        ninjaAuth={ninjaAuth}
        onAuthRequired={customLogin ? onAuthRequired : undefined}
        restoreOriginalUri={restoreOriginalUri}
      >
        <Switch>
          <Route path='/login' component={CustomLogin} />
          <Route path='/widget-login' render={ (props) => 
            <WidgetLogin {...props} baseUrl={baseUrl} />
          } />
          <Route path='/sessionToken-login' component={SessionTokenLogin} />
          <SecureRoute exact path='/protected' component={Protected} />
          <Route path='/implicit/callback' component={LoginCallback} />
          <Route path='/pkce/callback' render={ (props) => 
            <LoginCallback 
              {...props} 
              onAuthResume={ onAuthResume } 
              loadingElement={ <p id='login-callback-loading'>Loading...</p> }
              errorComponent={(props: any) => {
                const { error } = props;
                return (
                  <p id='login-callback-error'>
                    {error?.name}:{error?.message}
                  </p>
                );
              }}
            />
          } />
          <Route path='/' component={Home} />
        </Switch>
      </Security>
      <a href="/?pkce=1">PKCE Flow</a> | <a href="/">Implicit Flow</a>
    </React.StrictMode>
  );
};

export default App;
