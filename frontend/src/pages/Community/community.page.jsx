import "./community.css"
import { useState, useEffect, useCallback, useRef } from "react";
import CreatePost from "../../components/CreatePost/createPost.component";
import PostCard from "../../components/PostCard/postCard";
import { useUser } from "../../contexts/UserContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Community = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const { user } = useUser();
    const [activeFilter, setActiveFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const location = useLocation();
    const postsListRef = useRef(null);
    const isFetchingRef = useRef(false);

    const formatPost = (post) => ({
        ...post,
        id: post._id,
        author: post.author?.name || 'Unknown',
        authorImage: post.author?.profilePic || '/default-avatar.png',
        date: new Date(post.createdAt).toLocaleDateString('ar-EG'),
        comments: post.comments || [],
        likes: post.likes || []
    });
    
    const applyFilter = useCallback((posts) => {
        return posts.filter(post => {
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
    }, [activeFilter, user]);
    
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
                    _: Date.now()
                }
            });

            const newPosts = response.data.data;
            setHasMore(newPosts.length === 4);
            
            setAllPosts(prev => {
                const existingIds = new Set(prev.map(p => p._id));
                const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));
                
                const updatedPosts = isInitialLoad 
                    ? newPosts.map(formatPost)
                    : [...prev, ...uniqueNewPosts.map(formatPost)];
                
                const filtered = applyFilter(updatedPosts);
                setFilteredPosts(filtered);
                
                return updatedPosts;
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
    }, [user, applyFilter]);


    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    }, [activeFilter, fetchPosts]);

    useEffect(() => {
        const filtered = applyFilter(allPosts);
        setFilteredPosts(filtered);
    }, [allPosts, activeFilter, applyFilter]);


    useEffect(() => {
        if (!postsListRef.current || !hasMore) return;
    
        const currentRef = postsListRef.current;
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
        currentRef.appendChild(sentinel);
        observer.observe(sentinel);
    
        return () => {
            observer.disconnect();
            const existingSentinel = document.getElementById('scroll-sentinel');
            if (existingSentinel && currentRef.contains(existingSentinel)) {
                currentRef.removeChild(existingSentinel);
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






    const handlePostSubmit = async (newPost) => {
        try {
            setAllPosts(prev => [formatPost(newPost), ...prev]);
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء نشر المنشور');
        }
    };


    const handleApprove = async (postId) => {
        try {
            await axios.patch(`/api/v1/posts/${postId}/approve`, { status: 'approved', user: { role: user.role } }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAllPosts(prev => prev.map(post =>
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
            setAllPosts(prev => prev.map(post =>
                post._id === postId ? { ...post, status: 'rejected' } : post
            ));
            toast.success('تم رفض المنشور');
        } catch (error) {
            console.error('Error rejecting post:', error);
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء رفض المنشور');
        }
    };

    if (isLoading && !allPosts.length) {
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
                {[
                    { id: 'all', label: 'الكل' },
                    { id: 'general', label: 'عام' },
                    { id: 'announcement', label: 'إعلانات' },
                    { id: 'job', label: 'وظائف' },
                    { id: 'success', label: 'قصص نجاح' },
                    ...(user?.role === 'admin' ? [{ id: 'pending', label: 'قيد المراجعة' }] : [])
                ].map(filter => (
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
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onLike={handleLike}
                            onCommentAdded={(newComment) => {
                                setAllPosts(prev => prev.map(p =>
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