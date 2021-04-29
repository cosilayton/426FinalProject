import md5 from 'md5';

const Gravatar = {
    profileImageURL(email) {
        const hash = md5(email);
        return `https://www.gravatar.com/avatar/${hash}`;
    }
};

export default Gravatar;
