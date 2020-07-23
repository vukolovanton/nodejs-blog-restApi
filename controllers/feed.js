const { validationResult } = require('express-validator');
const Post = require('../model/post');

exports.getPosts = (req, res, next) => {
    Post.find().then(
        posts => {
            res.status(200).json({message: 'OK', posts})
        }
    ).catch(err => console(err));
    
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
}