class User {
    constructor(userId, username, email, password, role, profile) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.profile = profile;
    }
    getUser(){
        return {
            userId: this.userId,
            username: this.username,
            email: this.email,
            password: this.password,
            role: this.role,
            profile: this.profile
        }
    }
}
export default User