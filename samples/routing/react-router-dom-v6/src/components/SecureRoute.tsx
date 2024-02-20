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

import React, { useEffect } from 'react';
import { useninjaAuth } from '@ninja/ninja-react';
import { toRelativeUrl } from '@ninja/ninja-auth-js';
import { Outlet } from 'react-router-dom';
import Loading from './Loading';

export const RequiredAuth: React.FC = () => {
  const { ninjaAuth, authState } = useninjaAuth();

  useEffect(() => {
    if (!authState) {
      return;
    }

    if (!authState?.isAuthenticated) {
      const originalUri = toRelativeUrl(window.location.href, window.location.origin);
      ninjaAuth.setOriginalUri(originalUri);
      ninjaAuth.signInWithRedirect();
    }
  }, [ninjaAuth, !!authState, authState?.isAuthenticated]);

  if (!authState || !authState?.isAuthenticated) {
    return (<Loading />);
  }

  return (<Outlet />);
}
