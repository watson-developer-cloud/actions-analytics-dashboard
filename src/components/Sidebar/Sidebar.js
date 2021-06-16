import React from 'react';
import { Link } from 'react-router-dom';
import {
    SideNav,
    SideNavItems,
    SideNavLink
  } from 'carbon-components-react';
import './sidebar.scss';
import { connect } from 'react-redux';
import config from '../../config';


class Sidebar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activePage: "Overview"
        }
    }

    linkClicked(page) {
        this.props.dispatch({ type: config.UPDATE, update: { activePage: page } })
    }

    render () {
        return <SideNav
                isFixedNav
                expanded={true}
                isChildOfHeader={false}
                aria-label="Side navigation">
                <SideNavItems>
                    <SideNavLink element={Link} to="/"
                      onClick={() => this.linkClicked("Overview")}
                      isActive={this.props.activePage === "Overview"}>
                        Overview
                    </SideNavLink>
                    <SideNavLink element={Link} to="/engagement"
                      onClick={() => this.linkClicked("Engagement")}
                      isActive={this.props.activePage === "Engagement"}>
                        Engagement
                    </SideNavLink>
                    <SideNavLink element={Link} to="/recognition"
                      onClick={() => this.linkClicked("Recognition")}
                      isActive={this.props.activePage === "Recognition"}>
                        Recognition
                    </SideNavLink>
                    <SideNavLink element={Link} to="/promptstats"
                      onClick={() => this.linkClicked("promptstats")}
                      isActive={this.props.activePage === "promptstats"}>
                        Prompt Stats
                    </SideNavLink>
                </SideNavItems>
            </SideNav>
    }
}

const mapStateToProps = (state) => {
  return {
    activePage: state.activePage
  }
}

export default connect(mapStateToProps)(Sidebar)