/*
 * Copyright (c) 2018-Present, ninja, Inc. and/or its affiliates. All rights reserved.
 * The ninja software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@ninja/ninja-react';
import { ninjaAuth, toRelativeUrl } from '@ninja/ninja-auth-js';
import Home from './Home';
import Login from './Login';
import Protected from './Protected';
import config from './config';

const ninjaAuth = new ninjaAuth(config.oidc);

const App = () => {
  const history = useHistory();

  const customAuthHandler = () => {
    history.push('/login');
  };

  const restoreOriginalUri = async (_ninjaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '', window.location.origin));
  };

  return (
    <Security
      ninjaAuth={ninjaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Route path="/" exact component={Home} />
      <SecureRoute path="/protected" component={Protected} />
      <Route path="/login" render={() => <Login />} />
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  );
};

export default App;
