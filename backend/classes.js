class User
{
    constructor(name, username, id, password) {
        this.name = name;
        this.username = username;
        this.id = id;
        this.password = this.hashPassword(password); 
        
}

deleteaccount(){

}
}

class Patient extends User {
    constructor(name, username, id, password) {
        super(name, username, id, password);
        this.verified = false;
    }
}

class Doctor extends User {
    constructor(name, username, id, password) {
        super(name, username, id, password);
        this.patients = [];
        this.verified = false;
}
}
class Admin extends User {
    constructor(name, username, id, password) {
        super(name, username, id, password);

    }

}


