//@flow

import React from "react";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Nav from "react-bootstrap/lib/Nav";
import Navbar from "react-bootstrap/lib/Navbar";
import NavDropdown from "react-bootstrap/lib/NavDropdown";
import NavItem from "react-bootstrap/lib/NavItem";

export default class TopBar extends React.Component<{}> {

    render() {
        return (
            <Navbar inverse fixedTop collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/#/"><Glyphicon glyph="play-circle"/> Runs</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="/#/">
                            Dashboard
                        </NavItem>
                        <NavItem eventKey={2} href="/#/activities">
                            All Activities
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavDropdown eventKey={1} title="Shortcuts" id="basic-nav-dropdown">
                            {/*TODO : implement*/}
                            <MenuItem eventKey={1.1}>Add Activity</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
