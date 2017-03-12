import React from 'react';
import {
  RaisedButton,
  Card,
  CardHeader,
  CardText,
  TextField
} from 'material-ui';
import styled from 'styled-components';
import style from './style';

import { shell } from 'electron';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

class LoginView extends React.Component {
  constructor() {
    super();

    this.state = {
      usernameField: '',
      passcodeField: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  updateFieldGenerator(field) {
    return event => {
      this.setState({
        [field + 'Field']: event.target.value
      });
    };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.onLoginAttempt(
      this.state.usernameField,
      this.state.passcodeField
    );
  }

  render() {
    const { usernameField, passcodeField } = this.state;
    const { onLoginAttempt, isLoggingIn } = this.props;

    return (
      <Container>
        <Card>
          <CardText>
            To use this tool, you will need to configure an App Passcode.
            See <a
              onClick={() =>
                shell.openExternal(
                  'https://support.google.com/accounts/answer/185833'
                )}
              href="#"
            >
              here
            </a> for help.

            The Google account also needs to have the "Allow less secure apps" setting set to "ON".
          </CardText>
        </Card><br />
        <Card
          style={{
            marginTop: '50px'
          }}
        >
          <CardHeader title="Google Login" subtitle={null} />
          <CardText>
            <form onSubmit={this.onSubmit}>
              <TextField
                type="text"
                placeholder="Email"
                onChange={this.updateFieldGenerator('username')}
                value={usernameField}
                disabled={isLoggingIn}
              />
              <br />
              <TextField
                type="password"
                placeholder="App Passcode"
                onChange={this.updateFieldGenerator('passcode')}
                value={passcodeField}
                disabled={isLoggingIn}
              />
              <br />
              <RaisedButton type="submit" primary disabled={isLoggingIn}>
                LOGIN
              </RaisedButton>
            </form>

          </CardText>
        </Card>
      </Container>
    );
  }
}

LoginView.propTypes = {
  onLoginAttempt: React.PropTypes.func.isRequired
};

export default LoginView;
