import fs from 'fs-extra';
import EventEmitter from 'events';
import path from 'path';
import slug from 'slug';
import touch from 'touch';
import request from 'request';
import nodeID3 from 'node-id3';

import playmusic from './playmusic';

const MAX_CONCURRENT_DOWNLOADS = 10;

let downloadDir;

let queue = [];
let current = {};

function downloadSong(song, callback) {
  if (Object.keys(current).length >= MAX_CONCURRENT_DOWNLOADS) {
    queue.push({
      song,
      callback
    });
    return;
  }

  const id = slug(`${song.artist} - ${song.title} (${song.storeId})`);
  const playlistPath = path.resolve(
    downloadDir,
    `${song.playlistName} (${slug(song.playlistId)})`
  );

  current[id] = {
    id,
    playlistPath,
    song,
    meta: {
      title: song.title,
      artist: song.artist,
      album: song.album
    },
    temporaryMp3Path: path.resolve(playlistPath, id + '.mp3.part'),
    finalMp3Path: path.resolve(playlistPath, id + '.mp3'),
    coverPath: path.resolve(playlistPath, 'covers', id + 'jpg'),
    progress: 0
  };

  // Check if playlist directory already exists
  fs.stat(playlistPath, (err, stats) => {
    // Folder does not exist
    if (err) {
      try {
        fs.mkdirSync(playlistPath);
      } catch (e) {
      }
    }

    try {
      fs.mkdirSync(path.resolve(playlistPath, 'covers'));
    } catch (e) {
    }

    downloadSongFile(id)
      .then(() => downloadCover(id))
      .then(hasCover => applyMetaToSong(id, hasCover))
      .then(() => finishSong(id))
      .then(() => {
        const songData = current[id];
        delete current[id];

        if (queue.length > 0) {
          const entry = queue.shift();
          downloadSong(entry.song, entry.callback);
        }

        callback(songData);
      })
      .catch(err => console.error(err));
  });
}

function downloadSongFile(id) {
  return new Promise((resolve, reject) => {
    const songData = current[id];

    playmusic.getStreamUrl(songData.song).then(url => {
      // Create an empty file
      touch(songData.temporaryMp3Path, {}, err => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        request(url)
          .pipe(fs.createWriteStream(songData.temporaryMp3Path))
          .on('error', err => console.error(err))
          .on('close', () => {
            resolve();
          });
      });
    });
  });
}
function downloadCover(id) {
  return new Promise((resolve, reject) => {
    const songData = current[id];
    const coverUrl = songData.song.albumArtRef
      ? songData.song.albumArtRef[0]
      : null;

    if (coverUrl) {
      request(coverUrl)
        .pipe(fs.createWriteStream(songData.coverPath))
        .on('error', err => {
          console.error(err);
          resolve(false);
        })
        .on('close', () => {
          resolve(true);
        });
    } else {
      resolve(false);
    }
  });
}

function applyMetaToSong(id, hasCover) {
  return new Promise(resolve => {
    const songData = current[id];
    const meta = songData.meta;

    if (hasCover) meta.image = songData.coverPath;

    nodeID3.write(meta, songData.temporaryMp3Path);
    resolve();
  });
}

function finishSong(id) {
  return new Promise(resolve => {
    const songData = current[id];

    fs.rename(songData.temporaryMp3Path, songData.finalMp3Path, resolve);
  });
}

export default {
  downloadPlaylist(playlist) {
    const emitter = new EventEmitter();
    let progress = 0;

    playmusic.getSongsInPlaylist(playlist).then(songs => {
      const progressPerSong = 1.0 / songs.length;

      songs.forEach(song => downloadSong(song, songEntry => {
        progress += progressPerSong;
        emitter.emit('progress', progress);

        if (progress >= 1) {
          fs.remove(path.resolve(songEntry.playlistPath, 'covers'), err => {
            emitter.emit('complete');
          });
        }
      }));
    }, err => console.error(err));

    return emitter;
  },
  needsDownloadPath() {
    return !downloadDir;
  },
  setDownloadPath(path) {
    downloadDir = path;
  }
};
