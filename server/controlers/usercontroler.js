import Admin from '../models/admin.model.js';
import  User  from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registeradmin = async (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existingUser = await Admin.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists',success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            name,
            username,
            password: hashedPassword,
            isAdmin: true, // Default to false, can be changed later
        });
        return res.status(201).json({ message: 'User registered successfully',success: true });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const registerUser = async (req, res) => {
    const { name, username, password,confirmpassword, origin } = req.body;
    if (!name || !username || !password || !confirmpassword || !origin) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // const existingUser = await User.findOne({ username });
         // ✅ Sequelize: find user
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists',success: false });
        }
        if (password !== confirmpassword){
            return res.status(400).json({ message: 'password and confirmed password does not match',success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            username,
            password: hashedPassword,
            isAdmin: false, // Default to false, can be changed later
            origin
        });
        return res.status(201).json({ message: 'User registered successfully',success: true });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const loginUser = async (req, res) => {
    const { username, password,origin } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const userFound = await User.findOne({ where: { username },attributes: ['password','origin'],})
        if (!userFound) {
            return res.status(401).json({ message: 'Invalid credentials',success: false });
        }
        
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if (userFound.origin !== origin) {
            return res.status(401).json({ message: 'Invalid origin',success: false });
        }
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password',success: false });
        }
        const token = jwt.sign({ userId: userFound._id,isAdmin: userFound.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie("token",token,{maxAge:24*60*60*1000,httpOnly:true,sameSite:'none'});
            res.cookie("origin", origin, {
             maxAge: 24 * 60 * 60 * 1000,
             sameSite: 'None',
             secure: true // Required when sameSite is 'None'
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                origin,
                user: {
                    _id: userFound._id,
                    name: userFound.name,
                    username: userFound.username,
                    isAdmin: userFound.isAdmin,
                }})
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const loginadmin = async (req, res) => {
    const { username, password, } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const adminFound = await Admin.findOne({ where: { username },attributes: ['password'],  });
        if (!adminFound) {
            return res.status(401).json({ message: 'Invalid credentials',success: false });
        }
        
        const isPasswordValid = await bcrypt.compare(password, adminFound.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password',success: false });
        }
        const token = jwt.sign({ userId: adminFound._id,isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).cookie("token",token,{maxage:24*60*60*1000,httpOnly:true,sameSite:"lax"})
            .json({
                success: true,
                message: "Login successful",
                token,
                admin: {
                    _id: adminFound._id,
                    name: adminFound.name,
                    username: adminFound.username,
                    isAdmin: adminFound.isAdmin,
                }})
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getuserdetails = async (req,res) =>{
    try {
        const entries = await User.findAll({attributes: { exclude: ['password'],order: [['createdAt', 'DESC']]}}) // Sort by createdAt in descending order
        return res.status(200).json({ entries, success: true });
    } catch (error) {
        console.error('Error get userdata:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const changepassword = async (req,res,model) =>{
    const {username,oldpassword,newpassword,confirmedpassword} = req.body;
    if (!username ||!oldpassword || !newpassword || !confirmedpassword){
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (newpassword !== confirmedpassword){
        return res.status(400).json({ message: 'newpassword and confirmedpassword does not match' });
    }
    try {
        const finduser = await model.findOne({ where:{username},attributes:['password'] });
       
        if (!finduser){
          return res.status(400).json({ message: 'User not found' });  
        }
        const comparepassword = await bcrypt.compare(oldpassword,finduser.password);
        if (!comparepassword){
            return res.status(400).json({ message: 'Oldpassword is incorrect' }); 
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        finduser.password = hashedPassword;
        await finduser.save();
        return res.status(200).json({message: 'Password has been changed',success:true});

    } catch (error) {
       console.error("Error while changed password",error);
       res.status(500).json({ message: 'Internal server error' }); 
    }
}

export const userChangePassword = (req, res) => {
  return changepassword(req, res, User);
};

export const adminChangePassword = (req, res) => {
  return changepassword(req, res, Admin);
};