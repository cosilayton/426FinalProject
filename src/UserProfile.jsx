import React from 'react';

import Users from './api/Users';

class UserProfile extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: null
        };
    }

    componentDidMount() {
        const { user } = this.props;
        Users.profileURL(user.uid).then(this.onSuccess);
    }

    onSuccess = (url) => {
        this.setState({ url });
    }

    render() {
        const { url } = this.state;
        return url ? <img className='avatar' alt='User Avatar' src={url} /> : null;
    }
};

export default UserProfile;
