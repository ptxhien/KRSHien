import React, {Component} from 'react';

import {
    Button, Card
} from 'reactstrap';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {
    faCommentDots
} from '@fortawesome/free-solid-svg-icons'

class Messages extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    state = {
        showing: false
    };
    render() {

        const {showing} = this.state;

        return (
            <div className={"ui-messages-setting"}>
                <Button className={"btn-open-options"} color="primary"
                        onClick={() => this.setState({showing: !showing})}>
                    <FontAwesomeIcon icon={faCommentDots} color="white" fixedWidth={false} size="2x"/>
                </Button>
                <div className={(showing ? ' messages-open' : 'messages-close')}>
                    <div className="theme-settings__inner">
                        <PerfectScrollbar>
                            <div className="theme-settings__options-wrapper">
                                <h1 className="text-center">Chatbox</h1>
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
        );
    }
}

export default Messages;
