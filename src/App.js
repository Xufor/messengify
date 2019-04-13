import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'login',
            id: '',
            name: '',
            pass: '',
            operation: 'inbox',
            received : [
                ['Mike', 'Come to Meeting by 5pm'],
                ['Tyler', 'Hey, How are you?'],
                ['Kasper', 'Long time no see.']
            ],
            sent : [
                ['Mike', 'Come to Meeting by 5pm'],
                ['Tyler', 'Hey, How are you?'],
                ['Kasper', 'Long time no see.']
            ],
            text: ''
        }
    }

    onIdChange = (event) => {
        this.setState({
            id: event.target.value
        });
    };

    onPasswordChange = (event) => {
        this.setState({
            pass: event.target.value
        });
    };

    onNameChange = (event) => {
        this.setState({
            name: event.target.value
        });
    };


    onClickSignIn = () => {
        if(this.state.id === '' || this.state.pass === '')
        {
            alert("Please fill all the fields with a valid entry.")
        } else {
            this.setState({mode: 'home'});
        }
    };


    onClickRegister = () => {
        if(this.state.name === '' || this.state.id === '' || this.state.pass === '')
        {
            alert("Please fill all the fields with a valid entry.")
        } else {
            this.setState({mode: 'home'});
        }
    };

    registerInstead = () => {
        this.setState({mode: 'register'});
    };

    loginInstead = () => {
        this.setState({mode: 'login'});
    };

    loginGen = () => {
        return(
            <div id={'loginPageBackground'}>
                <div id={'loginBox'}>
                    <div className={'boxHeading'}>Login</div>
                    <div id={'inputLabelLgBx'}>Employee ID</div>
                    <input onChange={this.onIdChange} className={'inputBox'} type={'email'} required/>
                    <div id={'inputLabelLgBx'}>Password</div>
                    <input onChange={this.onPasswordChange} className={'inputBox'} type={'password'} required/>
                    <button onClick={this.onClickSignIn} id={'loginButton'}>Login</button>
                    <div id={'registerInstead'} onClick={this.registerInstead}>Don't have an account?</div>
                </div>
            </div>
        )
    };

    registerGen = () => {
        return (
            <div id={'registerPageBackground'}>
                <div id={'registerBox'}>
                    <div className={'boxHeading'}>Register</div>
                    <div id={'inputLabelRgBx'}>Name</div>
                    <input onChange={this.onNameChange} className={'inputBox'} type={'text'}/>
                    <div id={'inputLabelRgBx'}>Employee ID</div>
                    <input onChange={this.onIdChange} className={'inputBox'} type={'email'}/>
                    <div id={'inputLabelRgBx'}>Password</div>
                    <input onChange={this.onPasswordChange} className={'inputBox'} type={'password'}/>
                    <button onClick={() => this.onClickRegister()} id={'registerButton'}>Register</button>
                    <div id={'loginInstead'} onClick={this.loginInstead}>Already have an account?</div>
                </div>
            </div>
        );
    };

    homeGen = () => {
        return(
            <div id={'homePageWrapper'}>
                <div id={'mainContentWrapper'}>
                    <div id={'topRegion'}>
                        <div onClick={() => this.changeOperation('inbox')}>Inbox</div>
                        <div>|</div>
                        <div onClick={() => this.changeOperation('sent')}>Sent</div>
                        <div>|</div>
                        <div onClick={() => this.changeOperation('compose')}>Compose</div>
                    </div>
                    <div id={'bottomRegion'}>
                        {this.bottomContentGen()}
                    </div>
                    <div id={'logoutBtn'} onClick={this.logOut}><button>Logout</button></div>
                </div>
            </div>
        );
    };

    logOut = () => {
        this.setState({mode: 'login'});
    };

    changeOperation = (operation) => {
        this.setState({operation});
    };

    bottomContentGen = () => {
        if(this.state.operation === 'inbox') {
            let i = 0,{ received } = this.state;
            return (
                received.map((listItem) => {
                    return <MailElement
                        direction={'From'}
                        text = {listItem[1]}
                        person = {listItem[0]}
                        key={`re${i++}`}
                    />;
                })
            );
        } else if(this.state.operation === 'sent') {
            let i = 0,{ sent } = this.state;
            return (
                sent.map((listItem) => {
                    return <MailElement
                        direction={'To'}
                        text = {listItem[1]}
                        person = {listItem[0]}
                        key={`re${i++}`}
                    />;
                })
            );
        } else if(this.state.operation === 'compose') {
            return (
                <React.Fragment>
                    <div id={'to'}>To:</div>
                    <input id={'receiverName'}/>
                    <div id={'msg'}>Message:</div>
                    <textarea id={'textarea'} onChange={this.onMessageChange} placeholder={'Type your message!'}/>
                    <button id={'sendBtn'} onClick={this.onClickSend}>Send</button>
                </React.Fragment>
            );
        }
    };

    onMessageChange = (event) => {
        this.setState({
            text: event.target.value
        });
    };

    onClickSend = () => {

    };

    viewGenerator = () => {
        if(this.state.mode === 'login')
            return this.loginGen;
        else if(this.state.mode === 'register')
            return this.registerGen;
        else if(this.state.mode === 'home')
            return this.homeGen;
    };

    render() {
        return (
            <div id={'app'}>
                {this.viewGenerator()()}
            </div>
        );
    }
}

class MailElement extends Component {
    render() {
        let {direction, text, person} = this.props;
        return (
            <div id={'mailElementWrapper'}>
                <div>{`${direction}: ${person}`}</div>
                <div>{`Message: ${text}`}</div>
            </div>
        );
    }
}

export default App;
