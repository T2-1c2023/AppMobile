import React from 'react';

export const UserContext = React.createContext();

export class AppProvider extends React.Component {
    state = {
        fullName: '',
        role: '',
    };

    setFullName = (fullName) => {
        this.setState({ fullName });
    };

    setRole = (role) => {
        // TODO: validacion ( o bien uso de enum )
        this.setState({ role });
    };

    render() {
        const values = {
            fullName: this.state.fullName,
            role: this.state.role,
            setFullName: this.setFullName,
            setRole: this.setRole,
        }

        return (
            <UserContext.Provider value={values}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

