import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import electron from 'electron';

import backend from '../backend';
import LoginView from './LoginView';
import NavBar from './NavBar';
import TabBar from './TabBar';
import PlaylistView from './PlaylistView';
import DownloadsView from './DownloadsView';

import muiTheme from './muiTheme';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      isLoggingIn: false,
      playlists: [],
      downloads: {},
      loading: 0
    };

    this.onLoginAttempt = this.onLoginAttempt.bind(this);
    this.onPlaylistSelect = this.onPlaylistSelect.bind(this);
  }

  onLoginAttempt(username, passcode) {
    this.setState({ loading: this.state.loading + 1, isLoggingIn: true });

    backend.playmusic.login(username, passcode).then(() => {
      const playlists = backend.playmusic.getPlaylists();

      this.setState({
        isLoggedIn: true,
        isLoggingIn: false,
        playlists,
        loading: this.state.loading - 1
      });
    }, () => {
      this.setState({
        isLoggedIn: false,
        isLoggingIn: false,
        loading: this.state.loading - 1
      });
    });
  }

  updatePlaylists(playlists) {
    this.setState({
      playlists
    });
  }

  onPlaylistSelect(playlist) {
    if (this.state.downloads[playlist.id]) return;
    console.log(backend.download.needsDownloadPath());
    if (backend.download.needsDownloadPath()) {
      electron.remote.dialog.showOpenDialog(
        {
          properties: ['openDirectory', 'createDirectory'],
          title: 'Select a folder to download your playlists to',
          buttonLabel: 'Select Directory'
        },
        filenames => {
          if (!filenames) return;

          backend.download.setDownloadPath(filenames[0]);
          this.downloadPlaylist(playlist);
        }
      );
    } else {
      this.downloadPlaylist(playlist);
    }
  }

  downloadPlaylist(playlist) {
    const downloads = Object.assign({}, this.state.downloads, {
      [playlist.id]: {
        playlist,
        progress: 0
      }
    });
    this.setState({ downloads, loading: this.state.loading + 1 });

    backend.download
      .downloadPlaylist(playlist)
      .on('progress', progress => {
        const downloads = Object.assign({}, this.state.downloads, {
          [playlist.id]: {
            playlist,
            progress
          }
        });
        this.setState({ downloads });
      })
      .on('complete', () => {
        let downloads = Object.assign({}, this.state.downloads);
        delete downloads[playlist.id];

        this.setState({ downloads, loading: this.state.loading - 1 });
      });
  }

  render() {
    const {
      activeTab,
      isLoggedIn,
      isLoggingIn,
      playlists,
      downloads,
      loading
    } = this.state;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <NavBar showLoader={loading > 0} />

          {!isLoggedIn &&
            <LoginView
              onLoginAttempt={this.onLoginAttempt}
              isLoggingIn={isLoggingIn}
            />}
          {isLoggedIn &&
            <TabBar
              downloadCount={Object.keys(downloads).length}
              playlistTab={
                (
                  <PlaylistView
                    playlists={playlists}
                    downloads={downloads}
                    onPlaylistSelect={this.onPlaylistSelect}
                  />
                )
              }
              downloadsTab={<DownloadsView downloads={downloads} />}
            />}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
