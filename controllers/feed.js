const { validationResult } = require('express-validator');
const Post = require('../model/post');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;

    let totalItems;

    Post.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find().skip((currentPage - 1) * perPage).limit(perPage)
    })
    .then(posts => {
            res.status(200).json({message: 'OK', posts, totalItems})
        })
    .catch(err => console.log(err));
}

exports.postPost = (req, res, next )=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed', errors: errors.array() } );
    }
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        imageUrl: 'image',
        content: content,
        creator: { name: 'Anton' }
    })

    post.save().then(
        result => {
            console.log(result)

            res.status(201).json({
                message: 'Post created successfully',
                post: result
            })
        }
    ).catch(err => console.log(err))
}

exports.getPost = (req, res, next ) => {
    const postId = req.params.postId;

    Post.findById(postId).then(
        post => {
            //If we couldn't find the post
            if (!post) {
                const error = new Error('Could not find post');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Post fetched', post})
        }
    ).catch(err => console.log(err))
};

exports.updatePost = (req, res, next ) => {
    const postId = req.params.postId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed', errors: errors.array() } );
    }

    const title = req.body.title;
    const content = req.body.content;

    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;
        }

        post.title = title;
        post.content = content;

        return post.save();
    })
    .then(result => {
        res.status(200).json({message: 'OK', post: result})
    })
    .catch(err => console.log(err))
}