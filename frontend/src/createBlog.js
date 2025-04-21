import React, { useEffect, useState } from 'react';
import TextInput from './SharedComponents/TextInput';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createPost, getPostByPostId, updatePost } from './services/apiService';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { useParams } from 'react-router-dom';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [country, setCountry] = useState('');
    const [dateOfVisit, setDateOfVisit] = useState('');
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { postId } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (postId) {
            fetchUpdatedPostData();
        } else {
            // Clear form fields when there's no postId (create mode)
            setTitle('');
            setContent('');
            setCountry('');
            setDateOfVisit('');
            setErrors({});
        }
    }, [postId]);
    

    const fetchUpdatedPostData = async () => {
        if (postId) {
            const response = await getPostByPostId(postId, token);
            const post = response.post;
            setCountry(post.country);
            setTitle(post.title);
            setContent(post.content);
            setDateOfVisit(post.date_of_visit);
        }
    };
    

    const createBlogPost = async () => {
        const newErrors = {
            title: !title ? 'Title is required' : '',
            content: !content ? 'Content is required' : '',
            country: !country ? 'Country is required' : '',
            dateOfVisit: !dateOfVisit ? 'Date of visit is required' : '',
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== ''); //This checks if at least one of those values is not an empty string (i.e., an error message exists).
        if (hasErrors) return;

        try {
            if (postId) {
                await updatePost(postId,title, content, country, dateOfVisit, token);
                setSnackbar({ open: true, message: 'Post updated successfully', severity: 'success' });
                
            } else {
                await createPost(title, content, country, dateOfVisit, token);
                setSnackbar({ open: true, message: 'Post created successfully', severity: 'success' });
        
                setTitle('');
                setContent('');
                setCountry('');
                setDateOfVisit('');
                setErrors({});
            }
        } catch (error) {
            console.error('Error while submitting post:', error);
            setSnackbar({ open: true, message: 'Failed to submit post', severity: 'error' });
        }
        
    };

    return (
        <div className="form container mt-4">
            <h4 className="text-left mb-4">{postId ? 'Update Blog' : 'Create Blog'}</h4>
            <div className="row g-3">
                <div className="col-md-4">
                    <TextInput
                        id="title"
                        label="Title"
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        errorMessage={errors.title}
                        required={true}
                    />
                </div>

                <div className="col-md-4">
                    <TextInput
                        id="content"
                        label="Content"
                        type="text"
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        errorMessage={errors.content}
                        required={true}
                    />
                </div>

                <div className="col-md-4">
                    <TextInput
                        id="country"
                        label="Country"
                        type="text"
                        placeholder="Enter country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        errorMessage={errors.country}
                        required={true}
                    />
                </div>

                <div className="col-md-4">
                    <TextInput
                        id="dateOfVisit"
                        label="Date of Visit"
                        type="date"
                        placeholder="Enter date of visit"
                        value={dateOfVisit}
                        onChange={(e) => setDateOfVisit(e.target.value)}
                        errorMessage={errors.dateOfVisit}
                        required={true}
                    />
                </div>
            </div>

            <div className="text-end mt-4">
                <button id="create_btn" onClick={createBlogPost} className="btn btn-success" >
                    {postId ? 'Update' : 'Create'}
                </button>
            </div>

            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>
    );
};

export default CreateBlog;
