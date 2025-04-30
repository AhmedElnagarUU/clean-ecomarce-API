import passport from 'passport'
import {Strategy as localStrategy} from 'passport-local'
import bcrypt from 'bcrypt'
import { AdminService } from '../modules/admin/admin.service'
import { Admin } from '../modules/admin/admin.model'



passport.use(new localStrategy({usernameField:'email', passwordField:'password'}, async (usernameField, password, done) => {
console.log("this is come from passport");
console.log(usernameField, password);
    try{
    const admin = await Admin.findOne({email:usernameField})
    console.log("this is come from admin");
    console.log(admin);
    console.log(admin?.password);
    if(!admin){

        return done(null, false, {message: 'Invalid email or password'})
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    console.log("this is come from isPasswordValid");
    console.log(isPasswordValid);
    if(!isPasswordValid){
        console.log("this is come from isPasswordValid");
        console.log(isPasswordValid);
        return done(null, false, {message: 'Invalid email or password'})
    }
    console.log("this is come from done");
    console.log(admin);
    return done(null, admin)


}catch(error){
    return done(error)
}
}))



passport.serializeUser((admin: any, done: any) => {
    done(null,admin._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    const admin = await AdminService.getAdminById(id)
    done(null, admin)
})  

export default passport
