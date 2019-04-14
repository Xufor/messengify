import React, { Component } from 'react';
import axLib from 'axios';
import './App.css';

const INITIAL_STATE = {
    mode: 'login',
    id: '',
    name: '',
    pass: '',
    to: '',
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
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.to = React.createRef();
        this.txt = React.createRef();
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
        const { id, pass } = this.state;
        if(id === '' || pass === '')
        {
            alert("Please fill all the fields with a valid entry.")
        } else {
            axLib.request({
                url: 'http://localhost:3003/login',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    id,
                    pass
                }
            }).then(res => {
                if(res.data.flag === 'Success'){
                    this.setState({mode: 'home', name: res.data.name});
                    this.initiateLoadingMails(id);
                } else {
                    alert('Could not log in. Please check your credentials.');
                }
            })
        }
    };

    initiateLoadingMails = (id) => {
        axLib.request({
            url: 'http://localhost:3003/load',
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            data: {
                id
            }
        }).then(res => {
            this.generateMailLists(res);
        })
    };

    generateMailLists = (res)  => {
        let a = res.data, i, received = [], sent = [];
        for(i =0; i< res.data.length;i++) {
            if(a[i].destination === this.state.name) {
                received.push([`${a[i].source}`, `${a[i].message}`]);
            }
            else {
                sent.push([`${a[i].destination}`, `${a[i].message}`]);
            }
        }
        this.setState({received, sent});
    };

    onClickRegister = () => {
        const {name, id , pass} = this.state;
        if(name === '' || id === '' || pass === '')
        {
            alert("Please fill all the fields with a valid entry.")
        } else {
            axLib.request({
                url: 'http://localhost:3003/register',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    id,
                    pass,
                    name
                }
            });
            alert('Wait for few seconds! Your id will be sent to you on your mobile number!');
            setTimeout(
                () => {
                    this.setState({mode: 'home'});
                }, 3000
            );
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
                    <div id={'btnPair'}>
                        <button onClick={() => this.initiateLoadingMails(this.state.id)}>Refresh</button>
                        <button onClick={this.logout}>Logout</button>
                    </div>
                </div>
            </div>
        );
    };

    logout = () => {
        this.setState(INITIAL_STATE);
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
                    <div id={'to'} >To:</div>
                    <input id={'receiverName'} ref={this.to} onChange={this.onChangeTo}/>
                    <div id={'msg'}>Message:</div>
                    <textarea id={'textarea'} ref={this.txt}  onChange={this.onMessageChange} placeholder={'Type your message!'}/>
                    <button id={'sendBtn'} onClick={this.onClickSend}>Send</button>
                </React.Fragment>
            );
        }
    };

    onChangeTo = (event) => {
        this.setState({
            to: event.target.value
        });
    };

    onMessageChange = (event) => {
        this.setState({
            text: event.target.value
        });
    };

    onClickSend = () => {
        const {id, to, text}  = this.state;
        if(to === '' || text === '')
        {
            alert('Please fill all the fields with a valid entry.');
        } else {
            axLib.request({
                url: 'http://localhost:3003/send',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    to,
                    id,
                    text
                }
            });
            alert('Mail Sent.');
            this.txt.current.value = '';
            this.to.current.value = '';
        }
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
