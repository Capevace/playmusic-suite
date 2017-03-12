import PlayMusic from 'playmusic';
const playMusic = new PlayMusic();

let playlists = [];

function parsePlaylists(playlistInput = []) {
  playlists = playlistInput
    .map(playlist => ({
      id: playlist.id,
      lastModified: playlist.lastModifiedTimestamp,
      name: playlist.name
    }))
    .sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA > nameB) return 1;
      else if (nameA < nameB) return -1;
      else return 0;
    });
}

function filterSongsWithPlaylist(songs, playlist) {
  const sorted = songs
    .map(song => ({
      ...song.track,
      playlistId: song.playlistId,
      playlistName: playlist.name
    }))
    .filter(song => song.playlistId === playlist.id);
  return sorted;
}

export default {
  getPlaylists() {
    return playlists;
  },
  getSongsInPlaylist(playlist) {
    return new Promise((resolve, reject) => {
      playMusic.getPlayListEntries((err, data) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        resolve(filterSongsWithPlaylist(data.data.items, playlist));
      });
    });
  },
  login(username, password) {
    const config = {
      email: username,
      password: password
    };

    return new Promise((resolve, reject) => {
      playMusic.init(config, loginError => {
        if (loginError) {
          console.error(loginError);
          reject(loginError);
          return;
        }

        // Get playlists  after launch
        playMusic.getPlayLists((playlistError, data) => {
          if (playlistError) {
            console.error(playlistError);
            reject(playlistError);
            return;
          }

          parsePlaylists(data.data.items);
          resolve();
        });
      });
    });
  },
  getStreamUrl(song) {
    return new Promise((resolve, reject) => {
      playMusic.getStreamUrl(song.storeId, (err, url) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        resolve(url);
      });
    });
  }
};
