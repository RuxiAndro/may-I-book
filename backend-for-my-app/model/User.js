const mongoose = require('mongoose');
const bcrypt = require('bcrypt');//biblioteca pt criptarea parolelor
const jwt= require('jsonwebtoken');//pt gestionarea token-urilor JWT
const crypto = require('crypto');

const userSchema= new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: {type: String, enum: ['admin','owner','client'], default: 'client',required:true},
    resetPasswordToken: { type: String ,index: true}, 
    resetPasswordExpires: { type: Date } 
});

//criptarea parolei inainte de salvare
//hook pre-save ,se executa inaite de salvarea documentului in  baza de date
/*userSchema.pre('save', async function (next) {
    if(this.isModified('password') || this.isNew){
        this.password = await bcrypt.hash(this.password,10);//fct are 2 param: parola care trebuie criptata si nr de  "salt rounds"= complexitatea criptarii
    }
    next(); //next functie care permite continuarea procesului de salvare dupa ce hook-ul a terminat
})*/
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });


//definire metoda pt schema userSchema
userSchema.methods.comparePassword = function(passwordToCompare) {
    return bcrypt.compare(passwordToCompare, this.password);
  };
  

//jwt.sign(payload, secretOrPrivateKey, [options])
//payload= datele pe care vreau sa le includ in token
//secretKey= chei secreta , ar trebui sa o salvezz in variabile de mediu
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, role: this.role}, 'secretKey', {expiresIn: '1h'});//token-ul expira peste o ora, iar utilizatorul va trebui sa se autentifice din nou
    return token;
}

userSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex'); // generați un token aleatoriu
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = Date.now() + 3600000; // token-ul este valabil timp de 1 oră
    return resetToken;
  };
/*
userSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // Tokenul expiră în 1 oră
    return resetToken;
  };*/
const User = mongoose.model('User',userSchema);
module.exports = User;