class User
{
    constructor(name, username, id, password) {
        this.name = name;
        this.username = username;
        this.id = id;
        this.password = this.hashPassword(password); 
        
}
}

class Patient extends User {
    constructor(name, username, id, password) {
        super(name, username, id, password);
        this.verified = false;
        this.medications = [];
        this.doctors = [];
    }
    deleteaccount(){
/*sql request to delete self*/
    }
}

class Doctor extends User {
    constructor(name, username, id, password) {
        super(name, username, id, password);
        this.patients = [];
        this.verified = false;   
    }
    deleteaccount(){
        /*sql request to delete self*/
            }
}
class Admin extends User {
    constructor(name, username, id, password) {
        super(name, username, id, password);

    }
    approveaccount(){

    }
    deleteaccount(userid){
        id = User.id;
        /*sql request to delete user*/
            }
}


