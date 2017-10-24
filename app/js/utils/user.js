/* globals $ toastr */
/* eslint-disable no-undefined */
class User {
    constructor() {
        this.id = undefined;
        this.firstname = undefined;
        this.lastname = undefined;
        this.username = undefined;
        this.email = undefined;
        this.profilePic = undefined;
        this.signedIn = undefined;
        this.role = undefined;
    }
    _setUser(userData, change = true) {
        this.signedIn = !!userData;
        if (this.signedIn) {
            for (const prop in this) {
                if (this.hasOwnProperty(prop) &&
                    (typeof this[prop] !== 'function') &&
                    (prop !== 'signedIn')) {
                    this[prop] = userData[prop];
                }
            }
        } else {
            for (const prop in this) {
                if (this.hasOwnProperty(prop) &&
                    (typeof this[prop] !== 'function') &&
                    (prop !== 'signedIn')) {
                    this[prop] = undefined;
                }
            }
        }
        if (this.onStatusChange && change) {
            this.onStatusChange(this);
        }
    }
    checkStatus(change = false) {
        return $.get('/api/v1/auth')
            .then((userData) => {
                this._setUser(userData, change);
                return Promise.resolve(JSON.parse(JSON.stringify(this)));
            })
            .catch(() => {
                this._setUser(null, change);
                return Promise.resolve(JSON.parse(JSON.stringify(this)));
            });
    }
    signIn(userSignInData) {
        $.post('/api/v1/auth', userSignInData)
            .then((userData) => {
                this._setUser(userData);
                toastr.success(`Welcome: ${this.username}`);
            })
            .catch((err) => {
                this._setUser(null);
                toastr.error(err.responseText);
            });
    }
    signOut() {
        $.ajax('/api/v1/auth', {
            method: 'DELETE',
        })
            .then(() => {
                toastr.success(`You have successfully signed out!`);
                this._setUser(null);
            })
            .catch((err) => {
                toastr.error(err.responseText);
            });
    }

    register(registerData) {
        $.post('/api/v1/users', registerData)
            .then(() => {
                this.signIn(registerData);
            })
            .catch((err) => {
                this._setUser(null);
                toastr.error(err.responseText);
            });
    }
}

const user = new User();

module.exports = user;
