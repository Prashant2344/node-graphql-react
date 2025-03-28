const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
              throw new Error('User exists already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
  
            console.log(hashedPassword);
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
            const result = await user.save();
  
            console.log(result);
            return {
              ...result._doc,
              password: null
            };
        } catch(error) {
            throw error;
        }
    },

    login: async ({email, password}) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('User does not exist!');
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Password is incorrect!');
      }
      const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
        expiresIn: '1h'
      });
      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1
      };
    }
};