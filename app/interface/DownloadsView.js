import React from 'react';
import { List, ListItem, LinearProgress } from 'material-ui';

function DownloadsView({ downloads }) {
  return (
    <List>
      {Object.keys(downloads).map((downloadKey, index) => {
        const download = downloads[downloadKey];

        return (
          <ListItem
            primaryText={
              (
                <div>
                  {download.playlist.name}
                  <LinearProgress
                    mode="determinate"
                    value={download.progress * 100}
                    style={{
                      width: '40%',
                      float: 'right',
                      margin: '5px'
                    }}
                  />
                </div>
              )
            }
            rightIcon={null}
          />
        );
      })}
    </List>
  );
}

export default DownloadsView;
