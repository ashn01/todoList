import React from 'react';
import { bindActionCreators } from 'redux'

import { connect } from 'react-redux';
import Login from '../components/Login/Login';
import {setInfo} from '../Stores/Reducers/userInfo';

class NavPanelContainer extends React.PureComponent
{
    handleNavStatus = () =>{
        this.props.setInfo();
    }
    render()
    {
        return <Login info={this.handleNavStatus}/>
    }
}

const mapStateToProps = ({navStater}) =>({
    state: navStater.state,
})

const mapDispatchToProps = dispatch =>
bindActionCreators({toggleNav},dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavPanelContainer)