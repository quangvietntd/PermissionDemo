import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    AppState,
} from 'react-native';

import Permissions from 'react-native-permissions';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            status: {},
        };
    }


    componentDidMount() {
        const types = Permissions.getTypes();
        const canOpenSettings = Permissions.canOpenSettings();

        this.setState({ types, canOpenSettings });
        this.updatePermissions(types);
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    //update permissions when app comes back from settings
    handleAppStateChange = appState => {
        if (appState === 'active') {
            this.updatePermissions(this.state.types);
        }
    }

    updatePermissions = types => {
        Permissions.checkMultiple(types)
            .then(status => this.setState({ status }));
        console.log(this.state.status);
    }

    requestPermission = permission => {
        Permissions.request(permission)
            .then(res => {
                this.setState({
                    status: { ...this.state.status, [permission]: res },
                });
            })
            .catch(e => console.log(e));
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.types.map(type => (
                    <TouchableOpacity
                        style={[styles.button, styles[this.state.status[type]]]}
                        key={type}
                        onPress={() => this.requestPermission(type)}
                    >
                        <View>
                            <Text style={styles.text}>{type}</Text>
                            <Text style={styles.subtext}>{this.state.status[type]}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
    subtext: {
        textAlign: 'center',
    },
    button: {
        margin: 5,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    buttonInner: {
        flexDirection: 'column',
    },
    undetermined: {
        backgroundColor: 'darkviolet',
    },
    authorized: {
        backgroundColor: 'green',
    },
    denied: {
        backgroundColor: 'red',
    },
    restricted: {
        backgroundColor: 'yellow',
    },
});

