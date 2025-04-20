// classes.js
import bcrypt from 'bcryptjs';
const { randomUUID } = require('crypto');
const saltRounds = 10;

export class User {
  constructor(first_name, last_name, email, password, id) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password; 
    this.id = id;
  }

  static async create(first_name, last_name, email, originalPassword, id) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(originalPassword, salt);
    const id = randomUUID();
    return new User(first_name, last_name, email, hash, id);
  }
}

export class Patient extends User {
  constructor(first_name, last_name, email, password, id) {
    super(first_name, last_name, email, password, id);
  }
}

export class Doctor extends User {
  constructor(first_name, last_name, email, password, id) {
    super(first_name, last_name, email, password, id);
  }
}


export class Admin extends User {
  constructor(first_name, last_name, email, password, id) {
    super(first_name, last_name, email, password, id);
  }
}

export class medication {
    constructor(n,d)
    {
        this.medicationName=n
        this.dose=d
        this.rating=100
    }
}

export class prescription extends medication {
    constructor(n,d,f,s,e)
    {
        super(n,d)
        frequency=f
        startDate=s
        endDate=e
    }
}


