
class User
{
    constructor(name, username, id, password) {
        this.name = name;
        this.username = username;
        this.id = id;
        this.password = this.hashPassword(password);
}




}
