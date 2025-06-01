import passport from 'passport'
import {Strategy as localStrategy} from 'passport-local'
import bcrypt from 'bcrypt'
import { AdminUseCase } from '../modules/admin/application/admin.usecase'
import { IAdminRepository } from '../modules/admin/domain/repositories/admin.repository.interface'
import { AdminRepository } from '../modules/admin/infra/admin.repository'

const adminRepository: IAdminRepository = new AdminRepository();
const adminUseCase = new AdminUseCase(adminRepository);

passport.use(new localStrategy({usernameField:'email', passwordField:'password'}, async (usernameField, password, done) => {
console.log("this is come from passport");
console.log(usernameField, password);
    try{
    const admin = await adminUseCase.getAdminByEmail(usernameField)
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
    done(null,admin.id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const admin = await adminUseCase.getAdminById(id)
        done(null, admin)
    } catch (error) {
        done(error)
    }
})  

export default passport
