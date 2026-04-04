import { render } from 'preact';
import { Popup } from './Popup';

const root = document.getElementById('root');
if (root) {
  render(<Popup />, root);
}
