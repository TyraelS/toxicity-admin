const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');
const Post = require('../../models/Post');
const e = require('express');

//@route  POST api/users
//@desc   register user
//@access Public
router.get(
  '/',
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    try {

      let posts;
	  let user;

	  if(userId){
		  user = await User.findById(userId).select('-password');
		  if(user.role === 'admin'){
			posts = await Post.find({status: 'open'}).setOptions({limit: 15});
		  } else {
			posts = await Post.find({status: 'open'}).select('-moderation').setOptions({limit: 15});
		  }
	  }
	  else {
		posts = await Post.find({status: 'open'}).select('-moderation').setOptions({limit: 15});
	  }

      const payload = {
        posts
      };

	  res.json(payload);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/post', auth, [
    check('userId', 'userId is required')
      .not()
      .isEmpty(),
	check('content', 'message text is required').exists()
  ],
  async (req, res) => {
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, content } = req.body;

    try {
		const user = await User.findById(userId).select('-password');

		if(user.banned){
			res.status(400).json({ error: 'user is banned from posting' });
		} else {
			let post = new Post({
				userId,
				content
			});

				//   ML ANALYSIS HERE

			await post.save();
			const payload = {
				user: {
				  id: post.id,
				  userId: post.userId,
				  content: post.content,
				  date: post.date,
				}
			};

			res.json(payload);
		}
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
)

module.exports = router;
