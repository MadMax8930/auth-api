import mongoose from 'mongoose';

// User schema & authentication object
const UserSchema = new mongoose.Schema({
   username: { type: String, required: true },
   email: { type: String, required: true },
   authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
   },
});

// We turn the schema into a model
export const UserModel = mongoose.model('User', UserSchema);

// We write actions (usually in controllers)
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

