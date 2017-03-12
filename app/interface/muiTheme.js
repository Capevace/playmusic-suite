import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  deepOrange400,
  deepOrange700,
  blueGrey700,
  lightBlue700,
  grey50,
  grey100,
  grey300,
  grey400,
  grey500,
  grey700,
  white,
  darkBlack,
  fullBlack
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepOrange400,
    primary2Color: deepOrange700,
    primary3Color: grey400,
    accent1Color: grey50,
    accent2Color: grey300,
    accent3Color: grey700,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey700,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: deepOrange400,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  }
});

export default muiTheme;
