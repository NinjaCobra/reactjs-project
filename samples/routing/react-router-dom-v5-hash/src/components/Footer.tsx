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

function Footer() {
  const { authState, ninjaAuth } = useninjaAuth();

  const handleLogin = () => ninjaAuth.signInWithRedirect();
  const handleLogout = () => ninjaAuth.signOut();

  return (
    <footer>
      <hr />
      {
        !authState || !authState.isAuthenticated ?
        (
          <>
            <p>Please log in</p>
            <button type="button" onClick={handleLogin}>Login</button>
          </>
        ) :
        (
          <>
            <p>You&apos;re logged in!</p>
            <button type="button" onClick={handleLogout}>Logout</button>
          </>
        )
      }
    </footer>
  );
}

export default Footer;
