import React from 'react';
import { AppBar, CircularProgress } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';

function NavBar({ muiTheme, showLoader }) {
  return (
    <AppBar
      title="Google Play Music Suite"
      iconElementRight={
        showLoader
          ? <CircularProgress
              size={20}
              color={muiTheme.palette.primary2Color}
              style={{
                marginTop: '15px',
                marginRight: '20px'
              }}
            />
          : null
      }
      showMenuIconButton={false}
    />
  );
}

/* <Nav>
  <NavLinkContainer>
    <NavLinkBox active={activeNavLink === 'playlists'}>
      <NavLink href="#" onClick={() => onNavClick('playlists')}>
        Playlists
      </NavLink>
    </NavLinkBox>
    <NavLinkBox active={activeNavLink === 'downloads'}>
      <NavLink href="#" onClick={() => onNavClick('downloads')}>
        Downloads
      </NavLink>
    </NavLinkBox>
  </NavLinkContainer>
</Nav> */

export default muiThemeable()(NavBar);
