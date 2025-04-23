import "./community.css"
import { useState, useEffect, useCallback, useRef } from "react";
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
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isFetchingRef = useRef(false);
    const scrollContainerRef = useRef(null);
    const postsListRef = useRef(null);
    const location = useLocation();

    const formatPost = (post) => ({
        ...post,
        id: post._id,
        author: post.author?.name || 'Unknown',
        authorImage: post.author?.profilePic || '/default-avatar.png',
        date: new Date(post.createdAt).toLocaleDateString('ar-EG'),
        comments: post.comments || [],
        likes: post.likes || []
    });

    const fetchPosts = useCallback(async (pageNum = 1, isInitialLoad = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const userId = user?._id || JSON.parse(localStorage.getItem('user'))._id;
            const response = await axios.get('/api/v1/posts', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    role: JSON.parse(localStorage.getItem('user')).role,
                },
                params: {
                    userId,
                    page: pageNum,
                    limit: 4,
                    _: Date.now() // Cache buster
                }
            });

            const newPosts = response.data.data;
            setHasMore(newPosts.length === 4);

            setPosts(prev => {
                // Filter out duplicates
                const existingIds = new Set(prev.map(p => p._id));
                const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));

                return isInitialLoad
                    ? newPosts.map(formatPost)
                    : [...prev, ...uniqueNewPosts.map(formatPost)];
            });

            setPage(prevPage => pageNum >= prevPage ? pageNum + 1 : prevPage);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('حدث خطأ أثناء جلب المنشورات');
        } finally {
            isFetchingRef.current = false;
            if (isInitialLoad) {
                setIsLoading(false);
            } else {
                setIsFetchingMore(false);
            }
        }
    }, [user]);


    useEffect(() => {
        fetchPosts(1, true);
    }, [fetchPosts]);


    useEffect(() => {
        // Only proceed if the posts list container exists
        if (!postsListRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
                    fetchPosts(page);
                }
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.1
            }
        );

        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        sentinel.id = 'scroll-sentinel';

        // Use the ref to append the sentinel
        postsListRef.current.appendChild(sentinel);
        observer.observe(sentinel);

        return () => {
            observer.disconnect();
            if (postsListRef.current) {
                const existingSentinel = document.getElementById('scroll-sentinel');
                if (existingSentinel) {
                    postsListRef.current.removeChild(existingSentinel);
                }
            }
        };
    }, [fetchPosts, hasMore, page]);

useEffect(() => {
    if (location.pathname === '/community/jobs') {
        setActiveFilter('job');
    } else if (location.pathname === '/community/success-stories') {
        setActiveFilter('success');
    } else {
        setActiveFilter('all');
    }
}, [location.pathname]);


function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}



const handlePostSubmit = async (newPost) => {
    try {
        setPosts(prevPosts => [newPost, ...prevPosts]);
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
        await axios.patch(`/api/v1/posts/${postId}/approve`, { status: 'approved', user: { role: user.role } }, {
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

if (isLoading && !posts.length) {
    return <div className="loading">جاري التحميل...</div>;
}

const handleLike = async (postId) => {
    try {
        await axios.patch(`/api/v1/posts/${postId}/like`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};
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
        <div className="posts-list" ref={postsListRef}>
            {posts.length > 0 ? (
                posts.map(post => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onLike={handleLike}
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
            {isFetchingMore && <div className="loading-more">جاري تحميل المزيد...</div>}
        </div>
    </div>
);
};

export default Community;