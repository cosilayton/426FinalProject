import React from 'react';

import Firebase from './api/Firebase';
import Users from './api/Users';

const REFRESH_MS = 1000;
const URL_ANONYMOUS = '/anonymous.png';
const URL_PENDING = '<pending>';

class UserProfile extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: null
        };
    }

    componentDidMount() {
        this.checkImage();
    }

    checkImage = () => {
        const { user } = this.props;
        Users.profileURL(user.uid).then(this.onSuccess);
    }

    onSuccess = (url) => {
        if (!url) {
            this.setState({ url: URL_ANONYMOUS });
        } else if (url === URL_PENDING) {
            setTimeout(this.checkImage, REFRESH_MS);
            this.setState({ url: URL_ANONYMOUS });
        } else if (url.indexOf('http') === 0) {
            // Absolute/external URL - use as-is
            this.setState({ url });
        } else {
            // Firebase storage path - create a URL
            Firebase.storage().ref().child(url).getDownloadURL()
                .then(storageURL => this.setState({ url: storageURL }));
        }
    }

    render() {
        const { url } = this.state;
        return url ? <img className='avatar' alt='User Avatar' src={url} /> : null;
    }
};

export default UserProfile;
