
import React, { Component } from 'react';
import './auth.css'
import AuthContext from '../context/auth-context'
export default class AuthPage extends Component {
    
    state = {

        isLogin: true
    }

    static contextType = AuthContext             //contextType is used for class components tp access the context 

    constructor(props) {
        super(props)
        this.emailEl = React.createRef()
        this.passwordEl = React.createRef()

    }

    switchLoginHandler = () => {
        this.setState({ isLogin: !this.state.isLogin })
    }

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
              query Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                  userId
                  token
                  tokenExpiration
                }
              }
            `,
            variables: {
              email: email,
              password: password
            }
          };

          if (!this.state.isLogin) {
            requestBody = {
              query: `
                mutation CreateUser($email: String!, $password: String!) {
                  createUser(userInput: {email: $email, password: $password}) {
                    _id
                    email
                  }
                }
              `,
              variables: {
                email: email,
                password: password
              }
            };
          }
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                if (resData.data.login.token) {
                    this.context.login(resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration)

                }

            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input ref={this.emailEl} type="email" id="email" />

                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input ref={this.passwordEl} type="password" id="password" />

                </div>
                <div className="form-actions">
                    <button type="button" onClick={this.switchLoginHandler}>{this.state.isLogin ? 'Switch to Signup' : 'Switch to Login'}</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )
    }
}

