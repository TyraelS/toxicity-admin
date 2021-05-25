const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');
const Post = require('../../models/Post');
const e = require('express');

require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.8;

const criteriaSeverities = {
	'identity_attack': 0.2,
	'insult': 0.2,
	'obscene': 0.2,
	'severe_toxicity': 0.3,
	'sexual_explicit': 0.3,
	'threat': 0.3,
	'toxicity': 0.1
};

// @route  POST api/users
// @desc   register user
// @access Public
router.get(
	'/',
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const token = req.header('x-auth-token');
		let userFromToken = {};

		if (token) {
			const decoded = jwt.verify(token, config.get('jwtSecret'));

			userFromToken = decoded.user;
		}

		const { deleted, moderated, open } = req.query;
		const { id } = userFromToken;

		try {
			let posts;
			let user;

			if (id) {
				user = await User.findById(id).select('-password');
				if (user.role === 'admin') {
					if (deleted) {
						posts = await Post.find({ status: 'blocked' }).setOptions({ limit: 15 }).sort({ 'moderation.moderationDate' : -1});
					} else if (moderated) {
						posts = await Post.find({ 'moderation.moderated': true }).setOptions({ limit: 15 }).sort({ 'moderation.moderationDate' : -1 });
					} else if(open) {
						posts = await Post.find({ status: 'open', 'moderation.moderated': false }).setOptions({ limit: 15 }).sort('date');
					} else {
						posts = await Post.find({ status: 'open' }).select('-moderation').setOptions({ limit: 15 }).sort('-date');
					}
				} else {
					posts = await Post.find({ status: 'open' }).select('-moderation').setOptions({ limit: 15 }).sort('-date');
				}
			} else {
				posts = await Post.find({ status: 'open' }).select('-moderation').setOptions({ limit: 15 }).sort('-date');
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

router.get('/post', auth,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const token = req.header('x-auth-token');
		let userFromToken = {};

		if (token) {
			const decoded = jwt.verify(token, config.get('jwtSecret'));

			userFromToken = decoded.user;
		} else {
			res.status(401).send('Forbidden');
		}

		const { id } = userFromToken;
		const { postId } = req.query;

		try {
			const user = await User.findById(id).select('-password');
			const post = await Post.findById(postId);
			if (user.role === 'admin') {
				const payload = {
					post: {
						id: post.id,
						userId: post.userId,
						content: post.content,
						date: post.date,
						username: user.name,
						email: user.email,
						moderation: post.moderation,
						status: post.status
					}
				};

				res.json(payload);
			} else {
				res.status(402).send('Forbidden');
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

router.post('/post', auth, [
	check('content', 'message text is required').not().isEmpty()
],
async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const token = req.header('x-auth-token');
	let userFromToken = {};

	if (token) {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		userFromToken = decoded.user;
	} else {
		res.status(401).send('Forbidden');
	}

	const { id } = userFromToken;

	const { content } = req.body;

	try {
		const user = await User.findById(id).select('-password');

		if (user.banned) {
			res.status(400).json({ error: 'user is banned from posting' });
		} else {
			const model = await toxicity.load(threshold);
			const analysisResult = await model.classify([ content ]);
			const severityCoefficient = analysisResult.reduce((acc, criteria) => {
				const criteriaProbability = criteria.results[0].match ? 1 : criteria.results[0].probabilities['1'];

				return acc + criteriaSeverities[criteria.label] * criteriaProbability;
			}, 0);

			const post = new Post({
				userId: id,
				content,
				moderation: {
					severityCoefficient: severityCoefficient % 1,
					analysisResult,
					moderated: false
				} });

				//   ML ANALYSIS HERE

			await post.save();
			const payload = {
				user: {
					id: post.id,
					userId: post.userId,
					content: post.content,
					date: post.date
				}
			};

			res.json(payload);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
}
);

router.post('/moderate', auth,
	check('postId', 'postId is required').not().isEmpty(),
	check('status', 'updated status is required').not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);

   		if (!errors.isEmpty()) {
      		return res.status(400).json({ errors: errors.array() });
    	}

		const token = req.header('x-auth-token');
		let userFromToken = {};

		if (token) {
			const decoded = jwt.verify(token, config.get('jwtSecret'));

			userFromToken = decoded.user;
		} else {
			res.status(401).send('Forbidden');
		}

		const { id } = userFromToken;

    	const { postId, status } = req.body;

    	try {
			let user;

			user = await User.findById(id).select('-password');

			if (user.role !== 'admin') {
				res.status(402).send('Forbidden');
			} else {
				const post = await Post.findByIdAndUpdate(postId, {
					'moderation.moderated': true,
					'moderation.moderationDate': Date.now(),
					status
				});
				// post.moderation.moderated = true;
				// post.moderation.moderationDate = Date.now();
				// post.status = status;

				// await post.update();
				const payload = {
					post
				};

				res.json(payload);
			}
		} catch (err) {
			console.error(err.message);
     		res.status(500).send('Server error');
		}
	}
);

module.exports = router;
