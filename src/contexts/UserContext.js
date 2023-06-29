import React from 'react';

export const UserContext = React.createContext();

export class AppProvider extends React.Component {
    state = {
        name: '',
        userId: '',
        email: '',
        isAthlete: false,
        isTrainer: false,
    };

    setEmail = (email) => {
        this.setState({ email });
    }

    setName = (name) => {
        this.setState({ name });
    };

    setUserId = (userId) => {
        this.setState({ userId });
    };

    setAsAthlete = () => {
        console.log('setting as athlete')
        this.setState({ isAthlete: true, isTrainer: false });
    };

    setAsTrainer = () => {
        console.log('setting as trainer')
        this.setState({ isAthlete: false, isTrainer: true });
    };

    render() {
        const values = {
            email : this.state.email,
            setEmail: this.setEmail,

            name: this.state.name,
            setName: this.setName,

            userId: this.state.userId,
            setUserId: this.setUserId,

            isAthlete: this.state.isAthlete,            
            setAsAthlete: this.setAsAthlete,
            
            isTrainer: this.state.isTrainer,
            setAsTrainer: this.setAsTrainer,
        }

        return (
            <UserContext.Provider value={values}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

