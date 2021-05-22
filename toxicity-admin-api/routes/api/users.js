const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');

const User = require('../../models/User');

//@route  POST api/users
//@desc   register user
//@access Public

router.get(
	'/profile',
	auth,
	async (req,res) => {
		const errors = validationResult(req);
    	if (!errors.isEmpty()) {
     		return res.status(400).json({ errors: errors.array() });
    	}

		const token = req.header('x-auth-token');
		let userFromToken = {};

		if(token){
			const decoded = jwt.verify(token, config.get('jwtSecret'));

			userFromToken = decoded.user;
		} else {
			res.status(401).send('Forbidden');
		}

		const { id } = userFromToken;

		try{
			const user = await User.findById(id).select('-password').select('-_id').select('-__v');
			const payload = {
				user
			};

			res.json(payload);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please type a vaild email').isEmail(),
    check('password', 'Please enter a password with minlength 6').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = 'user' } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
		role
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
