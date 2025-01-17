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

import React from 'react';
import { useninjaAuth } from '@ninja/ninja-react';
import { toRelativeUrl } from '@ninja/ninja-auth-js';
import { Route, RouteProps, useRouteMatch } from 'react-router-dom';
import Loading from './Loading';

export const SecureRoute: React.FC<{
  errorComponent?: React.ComponentType<{ error: Error }>;
} & RouteProps> = ({ errorComponent, ...routeProps }) => {
  const { ninjaAuth, authState } = useninjaAuth();
  const match = useRouteMatch();
  const isPending = React.useRef(false);
  const [ error, setError ] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    const login = async () => {
      if (isPending.current) {
        return;
      }

      isPending.current = true;

      const originalUri = toRelativeUrl(window.location.href, window.location.origin);
      ninjaAuth.setOriginalUri(originalUri);
      await ninjaAuth.signInWithRedirect();
    };

     // Only process logic if the route matches
     if (!match) {
      return;
    }

    if (!authState) {
      return;
    }

    if (authState.isAuthenticated) {
      isPending.current = false;
      return;
    }

    if (!authState.isAuthenticated) { 
      login().catch(err => {
        setError(err);
      });
    }
  }, [authState, ninjaAuth, match, isPending, setError]);

  if (error && errorComponent) {
    const ErrorComponent = errorComponent;
    return <ErrorComponent error={error} />
  }

  if (!authState || !authState?.isAuthenticated) {
    return (<Loading />);
  }

  return (
    <Route
      { ...routeProps }
    />
  );
};

export default SecureRoute;