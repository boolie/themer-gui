import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import Button from './Button';
import Checkbox from './Checkbox';
import {
  previousTip,
  nextTip,
  setShowTipsOnStartup,
  closeDialogs,
} from '../actions';
import css from './TipsDialog.css';

import Inputs from '../assets/inputs.mp4';
import ColorSemantics from '../assets/color-semantics.mp4';
import ColorSetOptions from '../assets/color-set-options.mp4';
import Export from '../assets/export.mp4';
import Prefill from '../assets/prefill.mp4';

const Transition = ({ children }) => (
    { children }
);

const tips = [
  {
    text: 'Type your theme’s colors into the inputs, or click the droplet icon to use a color picker.',
    videoSrc: Inputs,
  },
  {
    text: 'shade0-7 are your background, UI, and foreground colors. accent0-7 are your syntax and special colors.',
    videoSrc: ColorSemantics,
  },
  {
    text: 'Your theme can define a dark variant, a light variant, or both.',
    videoSrc: ColorSetOptions,
  },
  {
    text: 'Export themes to a variety of programs and wallpapers.',
    videoSrc: Export,
  },
  {
    text: 'Tweak built-in themes or use them as-is.',
    videoSrc: Prefill,
  },
];

const TipsDialog = ({
  tipIndex,
  showTipsOnStartup,
  previousTip,
  nextTip,
  setShowTipsOnStartup,
  closeDialogs,
}) => (
  <div className={ css.container }>
    <p className={ css.tipText }>{ tips[tipIndex].text }</p>
    <div className={ css.videoWrapper }>
      <TransitionGroup>
        <CSSTransition
          key={ tips[tipIndex].videoSrc }
          classNames={{
            appear: css.videoAppear,
            appearActive: css.videoAppearActive,
            enter: css.videoEnter,
            enterActive: css.videoEnterActive,
            exit: css.videoExit,
            exitActive: css.videoExitActive,
          }}
          appear
          timeout={ 300 }
        >
          <video
            autoPlay
            loop
            muted
            width="640"
            height="360"
            src={ tips[tipIndex].videoSrc }
          />
        </CSSTransition>
      </TransitionGroup>
    </div>
    <div>
      <Button
        onClick={ previousTip }
        disabled={ tipIndex <= 0 }
      >Previous</Button>
      <span>{ tipIndex + 1 } / { tips.length }</span>
      <Button
        primary
        onClick={ tipIndex >= tips.length-1 ? closeDialogs : nextTip }
      >
        { tipIndex >= tips.length-1 ? 'Got it' : 'Next' }
      </Button>
      { tipIndex < tips.length-1 ? (
        <Button
          plain
          onClick={ closeDialogs }
        >Close</Button>
      ) : null }
    </div>
    <div>
      <Checkbox
        label="Show tips on startup"
        value={ showTipsOnStartup }
        onChange={ val => setShowTipsOnStartup(val) }
      />
    </div>
  </div>
);

const mapStateToProps = state => ({
  tipIndex: state.tips.currentTipIndex,
  showTipsOnStartup: state.preferences.showTipsOnStartup,
});
const mapDispatchToProps = {
  previousTip,
  nextTip,
  setShowTipsOnStartup,
  closeDialogs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TipsDialog);
