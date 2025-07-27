import { useEffect, useState,useRef  } from 'react';
import axios from 'axios';
import TextInput from './SharedComponents/TextInput';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createPost, getPostByPostId, updatePost,getCountryData } from './services/apiService';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { BsArrowDownSquareFill  } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import './styles/index.css';


const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [country, setCountry] = useState('');
    const [dateOfVisit, setDateOfVisit] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [countryCodes, setCountryCodes] = useState([]);
    const [countryData, setCountryData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { postId } = useParams();
    const token = localStorage.getItem('token');
    const fileInputRef = useRef(null);


    useEffect(() => {
        const fetchCountryData = async () => {
            if (!country) return;

            try {
                const response = await getCountryData(country);
                setCountryData(response);
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        };
        fetchCountryData();
    }, [country]);



    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const codes = response.data.map(country => ({
                    value: country.cca2,
                    label: country.name.common,
                }));
                setCountryCodes(codes);
            })
            .catch(error => {
                console.error('Error fetching country codes:', error);
            });
    }, []);

    useEffect(() => {
        if (postId) {
            fetchUpdatedPostData();
        } else {
            // Clear form fields when there's no postId (create mode)
            setTitle('');
            setContent('');
            setCountry('');
            setDateOfVisit('');
            setCountryData(null);
            setErrors({});
        }
    }, [postId]);


    const fetchUpdatedPostData = async () => {
        if (postId) {
            const response = await getPostByPostId(postId, token);
            const post = response.post;
            setTitle(post.title);
            setContent(post.content);
            setCountry(post.country);
            setDateOfVisit(post.date_of_visit);
            setImage(post.image); // Assuming the image URL is stored in the post object

        }
    };


    const createBlogPost = async () => {
        const newErrors = {
            title: !title ? 'Title is required' : '',
            content: !content ? 'Content is required' : '',
            // country: !country ? 'Country is required' : '',
            dateOfVisit: !dateOfVisit ? 'Date of visit is required' : '',
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== ''); //This checks if at least one of those values is not an empty string 
        if (hasErrors) return;

        try {
            if (postId) {
                await updatePost(postId, title, content, country, dateOfVisit, token);
                setSnackbar({ open: true, message: 'Post updated successfully', severity: 'success' });

            } else {
                await createPost(title, content, country, dateOfVisit, token, image);
                setSnackbar({ open: true, message: 'Post created successfully', severity: 'success' });

                setTitle('');
                setContent('');
                setCountry('');
                setDateOfVisit('');
                setCountryData(null);
                setImage(null); // Reset the image state
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the file input
                }
                setErrors({});
            }
        } catch (error) {
            console.error('Error while submitting post:', error);
            setSnackbar({ open: true, message: 'Failed to submit post', severity: 'error' });
        }
    };

    const handleFileChange  = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImage(selectedFile);
        } else {
            setImage(null);
        }
    }

    const downloadFile = async () => {
        if (!image) return;

        try{
            const response = await fetch(image);

            // Convert the response data into a Blob object (binary large object)
            const blob = await response.blob();

            // Extract the filename from the URL by taking the last part after '/'
            // and removing any query parameters after '?'
            const filename = image.split('/').pop().split('?')[0];

            // Create a temporary local URL for the Blob object
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element (<a>)
            const a = document.createElement('a');

            // Set the href of the anchor to the Blob URL
            a.href = url;

            // Set the 'download' attribute with the filename to trigger download
            a.download = filename || 'downloaded-file';

            // Append the anchor to the document body (required for Firefox)
            document.body.appendChild(a);

            // Programmatically click the anchor to start the download
            a.click();

            // Remove the anchor element from the DOM after click
            a.remove();

            // Release the Blob URL to free up memory
            window.URL.revokeObjectURL(url);


        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

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
                    <label htmlFor="country" className="form-label">
                        Country <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                        id="country"
                        label="Country"
                        placeholder="Select a country"
                        options={countryCodes.map(country => ({
                            value: country.value,
                            label: country.label,
                        }))}
                        onChange={(selectedOption) => {
                            setCountry(selectedOption.value);
                        }}
                        value={country ? countryCodes.find(option => option.value === country) : null}  //react-select uses the object’s label to display:
                    />
                    {errors.country && (
                        <div className="error-message">
                            {errors.country}
                        </div>
                    )}
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

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />

               {image && typeof image === 'string' && (
                    <BsArrowDownSquareFill 
                        className = "download-nav-icon"
                        onClick={downloadFile}
                        title="Download"
                    />
                )}


                
                      
            </div>

            <div className="text-end mt-4">
                <button id="create_btn" onClick={createBlogPost} className="btn btn-success" >
                    {postId ? 'Update' : 'Create'}
                </button>
            </div>


           {countryData && (
                <div className="country-info-container">
                    <h5 className="country-info-title">Country Information</h5>

                    <div className="mb-2">
                        <strong>Capital:</strong> <span className="country-info-text">{countryData.capital}</span>
                    </div>

                    {countryData.currency.length > 0 && (
                        <div className="country-currency-info">
                            <span className="country-currency-label">Currencies:</span>
                            {countryData.currency.map((curr, index) => (
                                <span key={index} className="country-currency-item">
                                    {curr.code} - {curr.name} ({curr.symbol})
                                </span>
                            ))}
                        </div>
                    )}

                    {countryData.flag && (
                        <div>
                            <img
                                src={countryData.flag}
                                alt="Country Flag"
                                className="country-info-flag"
                            />
                        </div>
                    )}

                </div>
            )}
            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>
    );
};

export default CreateBlog;