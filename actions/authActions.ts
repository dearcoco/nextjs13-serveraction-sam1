'use server'


import User from "@/models/userModel";
import {IUser} from "@/models/structs";
import { Account, Profile, getServerSession } from "next-auth";
import {redirect} from 'next/navigation';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from "@/utils/token";
import { sendEmail } from "@/utils/sendEmail";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { send } from "process";
import connectDB from "@/utils/database";

const Base_Url = process.env.NEXTAUTH_URL;

export async function updateUser({name, image}: {name: string, image: string}): Promise<string> {

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            throw new Error('Unauthorization!');
        }
        const user = session.user;

        const res = await User
            .findByIdAndUpdate(user.id, {name, image}, {new: true})
            .select('-password');
        
        if (!res) {
            throw new Error('Email does not exist!');
        }
        return 'Update profile Successfully!';
    }
    catch(error: any) {
        redirect(`/errors?error=${error.message}`);
    }
}

export async function signUpWidthCredentials({name, email, password}: {name: string, email: string, password: string}): Promise<string> {
    try {
        const user = await User.findOne({email});
        if (user) {
            throw new Error('Email already exists!');
        }
        if (password) {
            password = await bcrypt.hash(password, 10);
        }
        const token = generateToken({name, email, password});

        const url = `${Base_Url}/verify?token=${token}`;
        await sendEmail({
            to: email,
            url,
            text: 'Verify Email'
        });

        return 'Sign up success! Check your email to complete the registration.';
    }
    catch(error: any) {
        redirect(`/errors?error=${error.message}`);
    }
}

export async function verifyWidthCredentials({token}: {token: string}): Promise<string> {
    try {
        console.log('create new user1');
        const verified = verifyToken(token);
        const msg = 'Verify Success!';
        const userExist = await User.findOne({email: verified.email});
        if (userExist) {
            return msg + '(user exists)';
        }
        
        const newUser = new User({
            name: verified.name,
            email: verified.email,
            password: verified.password
        });
        await newUser.save();

        return msg;
    }
    catch(error: any) {
        redirect(`/errors?error=${error.message}`);
    }
}

export async function changePasswordWithCredentials({old_pass, new_pass}
	: {old_pass: string, new_pass: string}): Promise<string> {

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            throw new Error('Unauthorization!');
        }
        const user = await User.findById(session.user.id);
        if (!user) {
            throw new Error(`User does not exists.`);
        }
        if (user.provider !== 'credentials') {
            throw new Error(`This account is signed in with ${user.provider}`);
        }

        const compare = await bcrypt.compare(old_pass, user.password);
        if (!compare) {
            throw new Error('Old password does not match!');
        }

        const new_password = await bcrypt.hash(new_pass, 10);
        await User.findByIdAndUpdate(user._id, {password: new_password});

        return 'Change Password Successfully!'

    }
    catch(error: any) {
        redirect(`/errors?error=${error.message}`);
    }    
}

export async function forgotPasswordWithCredentials({email}
	: {email: string}): Promise<string> {

    try {
       
        const user = await User.findOne({email});
        if (!user) {
            throw new Error(`Email does not exists.`);
        }
        if (user.provider !== 'credentials') {
            throw new Error(`This account is signed in with ${user.provider}`);
        }

        const token = generateToken({userId: user._id});

        //console.log({token});
        await sendEmail({
            to: email,
            url: `${Base_Url}/reset_password?token=${token}`,
            text: 'reset password'
        });

        return 'Change Password Successfully!'

    }
    catch(error: any) {
        redirect(`/errors?error=${error.message}`);
    }    
}

export async function resetPasswordWithCredentials({token, password}
	: {token: string, password: string}): Promise<string> {

    try {
        const verified = verifyToken(token);
        const user = await User.findById(verified.userId);
        if (!user) {
            throw new Error(`User does not exists.`);
        }
        if (user.provider !== 'credentials') {
            throw new Error(`This account is signed in with ${user.provider}`);
        }
        const new_password = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(verified.userId, {password: new_password});

        return 'Reset Password Successfully!'

    }
    catch(error: any) {
        redirect(`/errors?error=${error.message}`);
    }    
}

export async function signInWithOAuth(account: Account | null, profile: Profile): Promise<boolean> {
	await connectDB();
	const user = await User.findOne({ email: profile.email });
	if (user) {
		return true;
	}

	// if !user => sign up => sign in
	const newUser = new User({
		name: profile.name,
		email: profile.email,
		image: (profile as any).picture,
		provider: account!.provider,
	});

	await newUser.save();
	//console.log({newUser});
	return true;
}

export async function getUserByEmail({ email }: { email: string }): Promise<IUser> {
	await connectDB();
	const user = await User.findOne({ email }).select("-password");
	if (!user) {
		throw new Error("Email does not exist!");
	}

    return {
        ...user._doc, 
        id: user._id.toString(), 
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(), 
        updatedAt: user.updatedAt.toISOString(),} as IUser;

	// return {
	// 	name: user.name,
	// 	id: user._id.toString(),
	// 	email: user.email,
	// 	password: user.password,
	// 	role: user.role,
    //     image: user.image,
	// 	provider: user.provider
	// };;
}

export async function signInWithCredentials({email, password}
	: {email: string, password: string}): Promise<IUser> {
	
	await connectDB();
	const user = await User.findOne({ email });
    
	if (!user) {
		throw new Error("Email does not exist!");
	}

	const compare = await bcrypt.compare(password, user.password);
	if (!compare) {
		throw new Error('Password does not match!');
	}
	
    const res = {
        ...user._doc, 
        id: user._id.toString(), 
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(), 
        updatedAt: user.updatedAt.toISOString(),} as IUser;
    
    console.log({res});
    
	// const res = {
	// 	name: user.name,
	// 	id: user._id.toString(),
	// 	email: user.email,
	// 	password: user.password,
	// 	role: user.role,
    //     image: user.image,
	// 	provider: user.provider
	// };
	
	return res;
}