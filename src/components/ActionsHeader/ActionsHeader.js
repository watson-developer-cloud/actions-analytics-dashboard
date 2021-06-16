import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';import {
    Help20,
    UserAvatar20,
  } from '@carbon/icons-react';
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Dropdown,
  DropdownSkeleton
} from 'carbon-components-react';
import config from '../../config';
import './actions-header.scss';

let propsInstance;

// Top Bar Component w/ dropdown for assistants
class ActionsHeader extends React.Component {
    constructor(props) {
        super(props)

        propsInstance = props;
    }

    dropdownChanged(change) {
        // Dispatch event that a new assistant was selected
        propsInstance.dispatch({ type: config.ASSISTANT_SELECTED, assistant: change.selectedItem })
    }

    render () {
        return <Header aria-label="Carbon Tutorial">
                    <HeaderName element={Link} to="/" prefix="IBM">
                    Actions Dashboard
                    </HeaderName>
                    <div id="headerDivider"></div>
                    <div style={{ width: 185 }}>
                    { this.props.assistantsLoaded
                    ? <Dropdown
                        type="inline"
                        label="Assistant"
                        ariaLabel="Dropdown"
                        id="assistant-dropdown"
                        items={this.props.assistants}
                        selectedItem={this.props.selectedAssistant}
                        onChange={ this.dropdownChanged }/>
                    : <DropdownSkeleton/> }
                    </div>
                    <HeaderGlobalBar>
                        <HeaderGlobalAction aria-label="Help" onClick={()=> window.open("https://medium.com/@zanderb98/actions-analytics-for-watson-assistant-dee3df47ad41", "_blank")}>
                            <Help20 />
                        </HeaderGlobalAction>
                        {/* <HeaderGlobalAction aria-label="User Avatar">
                            <UserAvatar20 />
                        </HeaderGlobalAction> */}
                    </HeaderGlobalBar>
                </Header>
    }
}

const mapStateToProps = (state) => {
    return {
        assistantsLoaded: state.assistantsLoaded,
        assistants: state.assistants,
        selectedAssistant: state.selectedAssistant
    };
}

export default connect(mapStateToProps)(ActionsHeader)