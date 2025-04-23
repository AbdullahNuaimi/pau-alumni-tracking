import "./community.css"
import { useState, useEffect } from "react";
import CreatePost from "../../components/CreatePost/createPost.component";
import PostCard from "../../components/PostCard/postCard";
import { useUser } from "../../contexts/UserContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Community = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useUser();
    const [activeFilter, setActiveFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchPosts = async () => {
            const userId = await JSON.parse(localStorage.getItem('user'))._id;
            setIsLoading(true);
            try {
                const response = await axios.get('/api/v1/posts', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        role: JSON.parse(localStorage.getItem('user')).role,
                    },
                    params: { userId }
                });

                const formattedPosts = response.data.data.map(post => ({
                    ...post,
                    id: post._id,
                    author: post.author?.name || 'Unknown',
                    authorImage: post.author?.profilePic || '/default-avatar.png',
                    date: new Date(post.createdAt).toLocaleDateString('ar-EG'),
                    comments: post.comments || [],
                    likes: post.likes || []
                }));
                console.log("fetched posts: ", response.data.data);
                setPosts(formattedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
                toast.error('حدث خطأ أثناء جلب المنشورات');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (location.pathname === '/community/jobs') {
            setActiveFilter('job');
        } else if (location.pathname === '/community/success-stories') {
            setActiveFilter('success');
        } else {
            setActiveFilter('all');
        }
    }, [location.pathname]);

    const visiblePosts = posts.filter(post => {
        if (!post) return false;

        const statusMatch =
            activeFilter === 'pending' ?
                post.status === 'pending' :
                (post.status === 'approved' || post.author?._id === user?.id || user?.role === 'admin');

        const typeMatch =
            ['all', 'pending'].includes(activeFilter) ||
            post.type === activeFilter;

        return statusMatch && typeMatch;
    });

    const handlePostSubmit = async (newPost) => {
        try {
            setPosts(prevPosts => {
                const exists = prevPosts.some(post =>
                    post._id === newPost._id ||
                    (post.content === newPost.content && post.author === newPost.author)
                );
                return exists ? prevPosts : [newPost, ...prevPosts];
            });
            toast.success('تم نشر المنشور بنجاح');
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء نشر المنشور');
        }
    };

    const postFilters = [
        { id: 'all', label: 'الكل' },
        { id: 'general', label: 'عام' },
        { id: 'announcement', label: 'إعلانات' },
        { id: 'job', label: 'وظائف' },
        { id: 'success', label: 'قصص نجاح' },
        ...(user?.role === 'admin' ? [{ id: 'pending', label: 'قيد المراجعة' }] : [])
    ];

    const handleApprove = async (postId) => {
        try {
            await axios.patch(`/api/v1/posts/${postId}/approve`, { status: 'approved' }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPosts(posts.map(post =>
                post._id === postId ? { ...post, status: 'approved' } : post
            ));
            toast.success('تم اعتماد المنشور');
        } catch (error) {
            console.error('Error approving post:', error);
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء اعتماد المنشور');
        }
    };

    const handleReject = async (postId) => {
        try {
            await axios.patch(`/api/v1/posts/${postId}/approve`, { status: 'rejected' }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPosts(posts.map(post =>
                post._id === postId ? { ...post, status: 'rejected' } : post
            ));
            toast.success('تم رفض المنشور');
        } catch (error) {
            console.error('Error rejecting post:', error);
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء رفض المنشور');
        }
    };

    if (isLoading) {
        return <div className="loading">جاري التحميل...</div>;
    }

    return (
        <div className="community-page">
            <h1>المجتمع الأكاديمي</h1>

            <CreatePost onPostSubmit={handlePostSubmit} />
            <div className="post-filters">
                {postFilters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            <div className="posts-list">
                {visiblePosts.length > 0 ? (
                    visiblePosts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onCommentAdded={(newComment) => {
                                setPosts(prev => prev.map(p =>
                                    p._id === post._id
                                        ? { ...p, comments: [...p.comments, newComment] }
                                        : p
                                ));
                            }}
                        />
                    ))
                ) : (
                    <p className="no-posts">لا توجد منشورات بعد. كن أول من ينشر!</p>
                )}
            </div>
        </div>
    );
};

export default Community;